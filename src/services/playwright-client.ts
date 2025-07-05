import { Page } from 'playwright';
import { ScrapingConfig, ScrapingError } from '../types/character.js';
import { logger } from '../utils/logger.js';
import { PlaywrightParser, PlaywrightParserConfig } from './playwright-parser.js';
import { PerformanceMonitor } from '../utils/performance-monitor.js';

type PLimitFunction = (fn: Function) => Promise<any>;

export class PlaywrightClient {
    private playwrightParser: PlaywrightParser;
    private concurrencyLimit!: PLimitFunction;
    private readonly config: ScrapingConfig;
    private readonly errors: ScrapingError[] = [];
    private pLimitModule: any;
    private performanceMonitor: PerformanceMonitor;
    private activePagesCount = 0;
    private totalRequestsCount = 0;
    private successfulRequestsCount = 0;

    constructor(config: ScrapingConfig) {
        this.config = config;
        this.performanceMonitor = new PerformanceMonitor();

        const playwrightConfig: PlaywrightParserConfig = {
            headless: true,
            viewport: { width: 1920, height: 1080 },
            userAgent: config.userAgent,
            timeout: config.requestTimeout,
            maxConcurrentContexts: config.concurrentLimit,
            screenshotOnError: true,
            screenshotPath: './screenshots',
            blockResources: true
        };

        this.playwrightParser = new PlaywrightParser(playwrightConfig);
    }

    /**
     * Initialize the Playwright client
     */
    async initialize(): Promise<void> {
        try {
            // Dynamic import of p-limit for concurrency control
            this.pLimitModule = await import('p-limit');
            const pLimit = this.pLimitModule.default || this.pLimitModule;
            this.concurrencyLimit = pLimit(this.config.concurrentLimit);

            // Initialize Playwright browser
            await this.playwrightParser.initialize();
            
            await logger.info('PlaywrightClient initialized successfully');
        } catch (error) {
            await logger.error('Failed to initialize PlaywrightClient:', {}, error as Error);
            throw error;
        }
    }

    /**
     * Navigate to URL and return page with retry logic
     */
    async fetchWithRetry(url: string, _customTimeout?: number): Promise<Page | null> {
        if (!this.concurrencyLimit) {
            await this.initialize();
        }

        return this.concurrencyLimit(async () => {
            for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
                const requestStart = Date.now();
                this.totalRequestsCount++;
                
                try {
                    const page = await this.playwrightParser.navigateToPage(url);
                    this.activePagesCount++;

                    // Record successful request
                    const duration = Date.now() - requestStart;
                    this.performanceMonitor.recordRequest(duration, true);
                    this.successfulRequestsCount++;

                    await logger.debug(`Successfully navigated to ${url} (attempt ${attempt}/${this.config.maxRetries}) in ${duration}ms`);
                    return page;

                } catch (error) {
                    const duration = Date.now() - requestStart;
                    this.performanceMonitor.recordRequest(duration, false);

                    const errorInfo: ScrapingError = {
                        url,
                        error: (error as Error).message,
                        timestamp: new Date(),
                        retryAttempt: attempt
                    };
                    
                    this.errors.push(errorInfo);

                    if (attempt === this.config.maxRetries) {
                        await logger.error(`Failed to fetch ${url} after ${this.config.maxRetries} attempts:`, { url, attempt }, error as Error);
                        return null;
                    } else {
                        const delay = this.config.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
                        await logger.warn(`Attempt ${attempt}/${this.config.maxRetries} failed for ${url}, retrying in ${delay}ms`, { url, attempt, delay });
                        await this.delay(delay);
                    }
                }
            }
            return null;
        });
    }

    /**
     * Process multiple URLs in batches with progress tracking
     */
    async fetchBatch(
        urls: string[], 
        progressCallback?: (completed: number, total: number) => void
    ): Promise<Array<{ url: string; page: Page | null }>> {
        const startTime = Date.now();
        const results: Array<{ url: string; page: Page | null }> = [];
        let completed = 0;

        await logger.info(`Starting batch fetch of ${urls.length} URLs`);

        // Process URLs with concurrency control
        const promises = urls.map(async (url) => {
            const page = await this.fetchWithRetry(url);
            
            completed++;
            if (progressCallback) {
                progressCallback(completed, urls.length);
            }

            const result = { url, page };
            results.push(result);
            
            // Log progress every 10 completed requests
            if (completed % 10 === 0 || completed === urls.length) {
                const elapsed = Date.now() - startTime;
                const rate = completed / (elapsed / 1000);
                await logger.info(`Batch progress: ${completed}/${urls.length} completed (${rate.toFixed(1)} pages/sec)`);
            }

            return result;
        });

        await Promise.all(promises);

        const totalTime = Date.now() - startTime;
        const successCount = results.filter(r => r.page !== null).length;
        
        await logger.info(`Batch fetch completed: ${successCount}/${urls.length} successful in ${(totalTime / 1000).toFixed(2)}s`);

        return results;
    }

    /**
     * Close a page and update active count
     */
    async closePage(page: Page): Promise<void> {
        try {
            await this.playwrightParser.closePage(page);
            this.activePagesCount = Math.max(0, this.activePagesCount - 1);
        } catch (error) {
            await logger.error('Failed to close page:', {}, error as Error);
        }
    }

    /**
     * Get performance and error statistics
     */
    getStats(): { 
        successRate: number; 
        totalErrors: number; 
        activePagesCount: number;
        totalRequestsCount: number;
        averageResponseTime: number;
    } {
        return {
            successRate: this.totalRequestsCount > 0 ? this.successfulRequestsCount / this.totalRequestsCount : 0,
            totalErrors: this.errors.length,
            activePagesCount: this.activePagesCount,
            totalRequestsCount: this.totalRequestsCount,
            averageResponseTime: 0 // Placeholder for now
        };
    }

    /**
     * Get detailed browser statistics
     */
    async getBrowserStats(): Promise<{ contextsCount: number; pagesCount: number }> {
        return await this.playwrightParser.getStats();
    }

    /**
     * Get accumulated errors
     */
    getErrors(): ScrapingError[] {
        return [...this.errors];
    }

    /**
     * Clear accumulated errors
     */
    clearErrors(): void {
        this.errors.length = 0;
    }

    /**
     * Get performance monitor instance
     */
    getPerformanceMonitor(): PerformanceMonitor {
        return this.performanceMonitor;
    }

    /**
     * Take screenshot of a page
     */
    async takeScreenshot(page: Page, filename: string): Promise<void> {
        await this.playwrightParser.takeScreenshot(page, filename);
    }

    /**
     * Take screenshot for visual regression testing
     */
    async takeRegressionScreenshot(page: Page, testName: string): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${testName}-${timestamp}.png`;
        await this.playwrightParser.takeScreenshot(page, filename);
        return filename;
    }

    /**
     * Compare page visually with baseline screenshot
     */
    async compareVisualRegression(page: Page, testName: string, _threshold: number = 0.2): Promise<{ match: boolean; filename: string }> {
        const filename = await this.takeRegressionScreenshot(page, testName);
        
        // For now, just return the filename
        // In a full implementation, this would compare with a baseline image
        return {
            match: true, // Placeholder - would compare with baseline
            filename
        };
    }

    /**
     * Wait for element on page
     */
    async waitForElement(page: Page, selector: string, timeout?: number): Promise<boolean> {
        return await this.playwrightParser.waitForElement(page, selector, timeout);
    }

    /**
     * Wait for network idle on page
     */
    async waitForNetworkIdle(page: Page, timeout?: number): Promise<void> {
        await this.playwrightParser.waitForNetworkIdle(page, timeout);
    }

    /**
     * Extract text from page element
     */
    async extractText(page: Page, selector: string, fallback?: string): Promise<string> {
        return await this.playwrightParser.extractText(page, selector, fallback);
    }

    /**
     * Extract text array from page elements
     */
    async extractTextArray(page: Page, selector: string): Promise<string[]> {
        return await this.playwrightParser.extractTextArray(page, selector);
    }

    /**
     * Extract attribute from page element
     */
    async extractAttribute(page: Page, selector: string, attribute: string, fallback?: string): Promise<string> {
        return await this.playwrightParser.extractAttribute(page, selector, attribute, fallback);
    }

    /**
     * Check if client is properly initialized
     */
    isInitialized(): boolean {
        return this.concurrencyLimit !== undefined && this.playwrightParser !== null;
    }

    /**
     * Utility delay function
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Cleanup all resources
     */
    destroy(): void {
        try {
            // Close all active pages and cleanup Playwright
            this.playwrightParser.destroy();
            this.activePagesCount = 0;
            
            logger.info('PlaywrightClient destroyed successfully');
        } catch (error) {
            logger.error('Error during PlaywrightClient cleanup:', {}, error as Error);
        }
    }
}