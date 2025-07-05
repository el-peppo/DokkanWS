import { logger } from '../utils/logger.js';
import { PlaywrightParser } from './playwright-parser.js';
import { PerformanceMonitor } from '../utils/performance-monitor.js';
export class PlaywrightClient {
    playwrightParser;
    concurrencyLimit;
    config;
    errors = [];
    pLimitModule;
    performanceMonitor;
    activePagesCount = 0;
    totalRequestsCount = 0;
    successfulRequestsCount = 0;
    constructor(config) {
        this.config = config;
        this.performanceMonitor = new PerformanceMonitor();
        const playwrightConfig = {
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
    async initialize() {
        try {
            // Dynamic import of p-limit for concurrency control
            this.pLimitModule = await import('p-limit');
            const pLimit = this.pLimitModule.default || this.pLimitModule;
            this.concurrencyLimit = pLimit(this.config.concurrentLimit);
            // Initialize Playwright browser
            await this.playwrightParser.initialize();
            await logger.info('PlaywrightClient initialized successfully');
        }
        catch (error) {
            await logger.error('Failed to initialize PlaywrightClient:', {}, error);
            throw error;
        }
    }
    /**
     * Navigate to URL and return page with retry logic
     */
    async fetchWithRetry(url, _customTimeout) {
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
                }
                catch (error) {
                    const duration = Date.now() - requestStart;
                    this.performanceMonitor.recordRequest(duration, false);
                    const errorInfo = {
                        url,
                        error: error.message,
                        timestamp: new Date(),
                        retryAttempt: attempt
                    };
                    this.errors.push(errorInfo);
                    if (attempt === this.config.maxRetries) {
                        await logger.error(`Failed to fetch ${url} after ${this.config.maxRetries} attempts:`, { url, attempt }, error);
                        return null;
                    }
                    else {
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
    async fetchBatch(urls, progressCallback) {
        const startTime = Date.now();
        const results = [];
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
    async closePage(page) {
        try {
            await this.playwrightParser.closePage(page);
            this.activePagesCount = Math.max(0, this.activePagesCount - 1);
        }
        catch (error) {
            await logger.error('Failed to close page:', {}, error);
        }
    }
    /**
     * Get performance and error statistics
     */
    getStats() {
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
    async getBrowserStats() {
        return await this.playwrightParser.getStats();
    }
    /**
     * Get accumulated errors
     */
    getErrors() {
        return [...this.errors];
    }
    /**
     * Clear accumulated errors
     */
    clearErrors() {
        this.errors.length = 0;
    }
    /**
     * Get performance monitor instance
     */
    getPerformanceMonitor() {
        return this.performanceMonitor;
    }
    /**
     * Take screenshot of a page
     */
    async takeScreenshot(page, filename) {
        await this.playwrightParser.takeScreenshot(page, filename);
    }
    /**
     * Wait for element on page
     */
    async waitForElement(page, selector, timeout) {
        return await this.playwrightParser.waitForElement(page, selector, timeout);
    }
    /**
     * Wait for network idle on page
     */
    async waitForNetworkIdle(page, timeout) {
        await this.playwrightParser.waitForNetworkIdle(page, timeout);
    }
    /**
     * Extract text from page element
     */
    async extractText(page, selector, fallback) {
        return await this.playwrightParser.extractText(page, selector, fallback);
    }
    /**
     * Extract text array from page elements
     */
    async extractTextArray(page, selector) {
        return await this.playwrightParser.extractTextArray(page, selector);
    }
    /**
     * Extract attribute from page element
     */
    async extractAttribute(page, selector, attribute, fallback) {
        return await this.playwrightParser.extractAttribute(page, selector, attribute, fallback);
    }
    /**
     * Check if client is properly initialized
     */
    isInitialized() {
        return this.concurrencyLimit !== undefined && this.playwrightParser !== null;
    }
    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Cleanup all resources
     */
    destroy() {
        try {
            // Close all active pages and cleanup Playwright
            this.playwrightParser.destroy();
            this.activePagesCount = 0;
            logger.info('PlaywrightClient destroyed successfully');
        }
        catch (error) {
            logger.error('Error during PlaywrightClient cleanup:', {}, error);
        }
    }
}
//# sourceMappingURL=playwright-client.js.map