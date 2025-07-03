import { ScrapingConfig, ScrapingError } from '../types/character.js';
export declare class HttpClient {
    private readonly axios;
    private concurrencyLimit;
    private readonly config;
    private readonly errors;
    private pLimitModule;
    constructor(config: ScrapingConfig);
    /**
     * Initialize the http client (must be called before using)
     */
    initialize(): Promise<void>;
    /**
     * Fetch URL with retry logic and concurrency control
     */
    fetchWithRetry(url: string): Promise<string | null>;
    /**
     * Fetch multiple URLs in controlled batches
     */
    fetchBatch(urls: string[]): Promise<Array<{
        url: string;
        data: string | null;
    }>>;
    /**
     * Get accumulated errors from all requests
     */
    getErrors(): ScrapingError[];
    /**
     * Clear error history
     */
    clearErrors(): void;
    /**
     * Get request statistics
     */
    getStats(): {
        successRate: number;
        totalErrors: number;
    };
    /**
     * Delay utility for retry logic
     */
    private delay;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
//# sourceMappingURL=http-client.d.ts.map