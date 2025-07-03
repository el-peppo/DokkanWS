import axios from 'axios';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { logger } from '../utils/logger.js';
export class HttpClient {
    axios;
    concurrencyLimit;
    config;
    errors = [];
    pLimitModule;
    constructor(config) {
        this.config = config;
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
     * Fetch URL with retry logic and concurrency control
     */
    async fetchWithRetry(url) {
        if (!this.concurrencyLimit) {
            await this.initialize();
        }
        return this.concurrencyLimit(async () => {
            for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
                try {
                    const response = await this.axios.get(url);
                    return response.data;
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    if (attempt === this.config.maxRetries) {
                        const scrapingError = {
                            url,
                            error: errorMessage,
                            timestamp: new Date(),
                            retryAttempt: attempt
                        };
                        this.errors.push(scrapingError);
                        logger.error(`Failed to fetch ${url} after ${attempt} attempts: ${errorMessage}`);
                        return null;
                    }
                    logger.warn(`Attempt ${attempt}/${this.config.maxRetries} failed for ${url}: ${errorMessage}`);
                    await this.delay(this.config.retryDelay * attempt); // Exponential backoff
                }
            }
            return null;
        });
    }
    /**
     * Fetch multiple URLs in controlled batches
     */
    async fetchBatch(urls) {
        const batchPromises = urls.map(async (url) => ({
            url,
            data: await this.fetchWithRetry(url)
        }));
        return Promise.all(batchPromises);
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
     * Get request statistics
     */
    getStats() {
        const totalRequests = this.errors.length; // This would need tracking for full stats
        const totalErrors = this.errors.length;
        const successRate = totalRequests > 0 ? ((totalRequests - totalErrors) / totalRequests) * 100 : 100;
        return { successRate, totalErrors };
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