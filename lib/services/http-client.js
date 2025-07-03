import axios from 'axios';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { logger } from '../utils/logger.js';
import { CircuitBreaker } from '../utils/circuit-breaker.js';
import { PerformanceMonitor } from '../utils/performance-monitor.js';
export class HttpClient {
    axios;
    concurrencyLimit;
    config;
    errors = [];
    pLimitModule;
    circuitBreaker;
    performanceMonitor;
    constructor(config) {
        this.config = config;
        // Initialize circuit breaker
        const circuitConfig = {
            failureThreshold: 5, // Open circuit after 5 consecutive failures
            resetTimeout: 30000, // Wait 30s before trying again
            monitoringPeriod: 60000 // Monitor failures over 1 minute
        };
        this.circuitBreaker = new CircuitBreaker(circuitConfig);
        // Initialize performance monitor
        this.performanceMonitor = new PerformanceMonitor();
        // Create connection pooling agents
        const httpAgent = new HttpAgent({
            keepAlive: true,
            maxSockets: config.concurrentLimit * 2,
            timeout: config.requestTimeout
        });
        const httpsAgent = new HttpsAgent({
            keepAlive: true,
            maxSockets: config.concurrentLimit * 2,
            timeout: config.requestTimeout
        });
        this.axios = axios.create({
            timeout: config.requestTimeout,
            httpAgent,
            httpsAgent,
            headers: {
                'User-Agent': config.userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive'
            }
        });
    }
    /**
     * Initialize the http client (must be called before using)
     */
    async initialize() {
        try {
            // Dynamic import of p-limit to handle ESM compatibility
            this.pLimitModule = await import('p-limit');
            const pLimit = this.pLimitModule.default || this.pLimitModule;
            this.concurrencyLimit = pLimit(this.config.concurrentLimit);
        }
        catch (error) {
            await logger.error('Failed to load p-limit module:', {}, error);
            // Fallback: no concurrency limiting
            this.concurrencyLimit = async (fn) => fn();
        }
    }
    /**
     * Fetch URL with retry logic, timeout handling, and concurrency control
     */
    async fetchWithRetry(url, customTimeout) {
        if (!this.concurrencyLimit) {
            await this.initialize();
        }
        return this.concurrencyLimit(async () => {
            for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
                const requestStart = Date.now();
                try {
                    // Use circuit breaker to prevent overwhelming a failing service
                    const response = await this.circuitBreaker.execute(async () => {
                        const controller = new AbortController();
                        const timeoutMs = customTimeout || this.config.requestTimeout;
                        // Set up timeout
                        const timeoutId = setTimeout(() => {
                            controller.abort();
                        }, timeoutMs);
                        try {
                            const axiosResponse = await this.axios.get(url, {
                                signal: controller.signal,
                                timeout: timeoutMs
                            });
                            clearTimeout(timeoutId);
                            return axiosResponse.data;
                        }
                        catch (error) {
                            clearTimeout(timeoutId);
                            throw error;
                        }
                    });
                    // Record successful request
                    const responseTime = Date.now() - requestStart;
                    this.performanceMonitor.recordRequest(responseTime, true);
                    return response;
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('aborted');
                    const isNetworkError = errorMessage.includes('ECONNRESET') || errorMessage.includes('ENOTFOUND');
                    const timeoutMs = customTimeout || this.config.requestTimeout;
                    // Log different error types
                    if (isTimeout) {
                        await logger.warn(`Request timeout (${timeoutMs}ms) for ${url} on attempt ${attempt}`);
                    }
                    else if (isNetworkError) {
                        await logger.warn(`Network error for ${url} on attempt ${attempt}: ${errorMessage}`);
                    }
                    if (attempt === this.config.maxRetries) {
                        // Record failed request
                        const responseTime = Date.now() - requestStart;
                        this.performanceMonitor.recordRequest(responseTime, false);
                        const scrapingError = {
                            url,
                            error: errorMessage,
                            timestamp: new Date(),
                            retryAttempt: attempt
                        };
                        this.errors.push(scrapingError);
                        await logger.error(`Failed to fetch ${url} after ${attempt} attempts: ${errorMessage}`);
                        return null;
                    }
                    // Exponential backoff with jitter for better distribution
                    const baseDelay = this.config.retryDelay * attempt;
                    const jitter = Math.random() * 1000; // 0-1s random jitter
                    const delay = baseDelay + jitter;
                    await logger.warn(`Attempt ${attempt}/${this.config.maxRetries} failed for ${url}, retrying in ${Math.round(delay)}ms`);
                    await this.delay(delay);
                }
            }
            return null;
        });
    }
    /**
     * Fetch multiple URLs in controlled batches with progress tracking
     */
    async fetchBatch(urls, progressCallback) {
        let completed = 0;
        // Process URLs with controlled concurrency to prevent memory issues
        const promises = urls.map(async (url) => {
            const data = await this.fetchWithRetry(url);
            completed++;
            // Call progress callback if provided
            if (progressCallback) {
                progressCallback(completed, urls.length);
            }
            return { url, data };
        });
        // Wait for all requests to complete
        const batchResults = await Promise.all(promises);
        // Force garbage collection hint for large batches
        if (urls.length > 50 && global.gc) {
            global.gc();
        }
        return batchResults;
    }
    /**
     * Get accumulated errors from all requests
     */
    getErrors() {
        return [...this.errors];
    }
    /**
     * Clear error history
     */
    clearErrors() {
        this.errors.length = 0;
    }
    /**
     * Get comprehensive request statistics
     */
    getStats() {
        const perfMetrics = this.performanceMonitor.getMetrics();
        const cbStats = this.circuitBreaker.getStats();
        const successRate = perfMetrics.totalRequests > 0
            ? (perfMetrics.successfulRequests / perfMetrics.totalRequests) * 100
            : 100;
        return {
            successRate,
            totalErrors: perfMetrics.failedRequests,
            performance: perfMetrics,
            circuitBreaker: cbStats
        };
    }
    /**
     * Delay utility for retry logic
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Cleanup resources
     */
    destroy() {
        // Cleanup is handled automatically by Node.js HTTP agents
        logger.info('HTTP client destroyed');
    }
}
//# sourceMappingURL=http-client.js.map