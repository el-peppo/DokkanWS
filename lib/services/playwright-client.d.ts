import { Page } from 'playwright';
import { ScrapingConfig, ScrapingError } from '../types/character.js';
import { PerformanceMonitor } from '../utils/performance-monitor.js';
export declare class PlaywrightClient {
    private playwrightParser;
    private concurrencyLimit;
    private readonly config;
    private readonly errors;
    private pLimitModule;
    private performanceMonitor;
    private activePagesCount;
    private totalRequestsCount;
    private successfulRequestsCount;
    constructor(config: ScrapingConfig);
    /**
     * Initialize the Playwright client
     */
    initialize(): Promise<void>;
    /**
     * Navigate to URL and return page with retry logic
     */
    fetchWithRetry(url: string, _customTimeout?: number): Promise<Page | null>;
    /**
     * Process multiple URLs in batches with progress tracking
     */
    fetchBatch(urls: string[], progressCallback?: (completed: number, total: number) => void): Promise<Array<{
        url: string;
        page: Page | null;
    }>>;
    /**
     * Close a page and update active count
     */
    closePage(page: Page): Promise<void>;
    /**
     * Get performance and error statistics
     */
    getStats(): {
        successRate: number;
        totalErrors: number;
        activePagesCount: number;
        totalRequestsCount: number;
        averageResponseTime: number;
    };
    /**
     * Get detailed browser statistics
     */
    getBrowserStats(): Promise<{
        contextsCount: number;
        pagesCount: number;
    }>;
    /**
     * Get accumulated errors
     */
    getErrors(): ScrapingError[];
    /**
     * Clear accumulated errors
     */
    clearErrors(): void;
    /**
     * Get performance monitor instance
     */
    getPerformanceMonitor(): PerformanceMonitor;
    /**
     * Take screenshot of a page
     */
    takeScreenshot(page: Page, filename: string): Promise<void>;
    /**
     * Wait for element on page
     */
    waitForElement(page: Page, selector: string, timeout?: number): Promise<boolean>;
    /**
     * Wait for network idle on page
     */
    waitForNetworkIdle(page: Page, timeout?: number): Promise<void>;
    /**
     * Extract text from page element
     */
    extractText(page: Page, selector: string, fallback?: string): Promise<string>;
    /**
     * Extract text array from page elements
     */
    extractTextArray(page: Page, selector: string): Promise<string[]>;
    /**
     * Extract attribute from page element
     */
    extractAttribute(page: Page, selector: string, attribute: string, fallback?: string): Promise<string>;
    /**
     * Check if client is properly initialized
     */
    isInitialized(): boolean;
    /**
     * Utility delay function
     */
    private delay;
    /**
     * Cleanup all resources
     */
    destroy(): void;
}
//# sourceMappingURL=playwright-client.d.ts.map