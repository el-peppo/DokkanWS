import { ScrapingConfig, ScrapingError } from '../types/character.js';
export declare class HttpClient {
    private readonly axios;
    private concurrencyLimit;
    private readonly config;
    private readonly errors;
    private pLimitModule;
    private circuitBreaker;
    private performanceMonitor;
    constructor(config: ScrapingConfig);
    /**
     * Initialize the http client (must be called before using)
     */
    initialize(): Promise<void>;
    /**
     * Fetch URL with retry logic, timeout handling, and concurrency control
     */
    fetchWithRetry(url: string, customTimeout?: number): Promise<string | null>;
    /**
     * Fetch multiple URLs in controlled batches with progress tracking
     */
    fetchBatch(urls: string[], progressCallback?: (completed: number, total: number) => void): Promise<Array<{
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
     * Get comprehensive request statistics
     */
    getStats(): {
        successRate: number;
        totalErrors: number;
        performance: any;
        circuitBreaker: any;
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