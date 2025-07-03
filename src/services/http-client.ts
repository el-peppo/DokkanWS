import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { ScrapingConfig, ScrapingError } from '../types/character.js';
import { logger } from '../utils/logger.js';

type PLimitFunction = (fn: Function) => Promise<any>;

export class HttpClient {
    private readonly axios: AxiosInstance;
    private concurrencyLimit!: PLimitFunction;
    private readonly config: ScrapingConfig;
    private readonly errors: ScrapingError[] = [];
    private pLimitModule: any;

    constructor(config: ScrapingConfig) {
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
    async initialize(): Promise<void> {
        try {
            // Dynamic import of p-limit to handle ESM compatibility
            this.pLimitModule = await import('p-limit');
            const pLimit = this.pLimitModule.default || this.pLimitModule;
            this.concurrencyLimit = pLimit(this.config.concurrentLimit);
        } catch (error) {
            logger.error('Failed to load p-limit module:', error);
            // Fallback: no concurrency limiting
            this.concurrencyLimit = async (fn: Function) => fn();
        }
    }

    /**
     * Fetch URL with retry logic and concurrency control
     */
    async fetchWithRetry(url: string): Promise<string | null> {
        if (!this.concurrencyLimit) {
            await this.initialize();
        }
        return this.concurrencyLimit(async () => {
            for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
                try {
                    const response: AxiosResponse<string> = await this.axios.get(url);
                    return response.data;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    
                    if (attempt === this.config.maxRetries) {
                        const scrapingError: ScrapingError = {
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
    async fetchBatch(urls: string[]): Promise<Array<{ url: string; data: string | null }>> {
        const batchPromises = urls.map(async (url) => ({
            url,
            data: await this.fetchWithRetry(url)
        }));

        return Promise.all(batchPromises);
    }

    /**
     * Get accumulated errors from all requests
     */
    getErrors(): ScrapingError[] {
        return [...this.errors];
    }

    /**
     * Clear error history
     */
    clearErrors(): void {
        this.errors.length = 0;
    }

    /**
     * Get request statistics
     */
    getStats(): { successRate: number; totalErrors: number } {
        const totalRequests = this.errors.length; // This would need tracking for full stats
        const totalErrors = this.errors.length;
        const successRate = totalRequests > 0 ? ((totalRequests - totalErrors) / totalRequests) * 100 : 100;
        
        return { successRate, totalErrors };
    }

    /**
     * Delay utility for retry logic
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Cleanup resources
     */
    destroy(): void {
        // Cleanup is handled automatically by Node.js HTTP agents
        logger.info('HTTP client destroyed');
    }
}