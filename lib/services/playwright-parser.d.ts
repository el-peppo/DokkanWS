import { Page } from 'playwright';
export interface PlaywrightParserConfig {
    headless?: boolean;
    viewport?: {
        width: number;
        height: number;
    };
    userAgent?: string;
    timeout?: number;
    maxConcurrentContexts?: number;
    screenshotOnError?: boolean;
    screenshotPath?: string;
    blockResources?: boolean;
}
export declare class PlaywrightParser {
    private browser;
    private contexts;
    private config;
    private nextContextIndex;
    constructor(config?: PlaywrightParserConfig);
    /**
     * Initialize the browser and create contexts
     */
    initialize(): Promise<void>;
    /**
     * Create a new browser context with optimized settings
     */
    private createContext;
    /**
     * Get the next available context in round-robin fashion
     */
    private getNextContext;
    /**
     * Navigate to a URL and return the page
     */
    navigateToPage(url: string): Promise<Page>;
    /**
     * Parse HTML content and return a page object
     */
    parseHTML(html: string): Promise<Page>;
    /**
     * Extract character links from category page
     */
    extractCharacterLinks(page: Page, baseUrl: string): Promise<string[]>;
    /**
     * Extract pagination URLs from category page
     */
    extractPaginationUrls(page: Page, currentUrl: string): Promise<string[]>;
    /**
     * Safe element query with timeout
     */
    querySelector(page: Page, selector: string, timeout?: number): Promise<any>;
    /**
     * Safe multiple element query
     */
    querySelectorAll(page: Page, selector: string): Promise<any[]>;
    /**
     * Extract text content from element
     */
    extractText(page: Page, selector: string, fallback?: string): Promise<string>;
    /**
     * Extract text content with Ki sphere replacements
     */
    extractTextWithKiSpheres(page: Page, selector: string, fallback?: string): Promise<string>;
    /**
     * Replace Ki sphere icons with text equivalents
     */
    private replaceKiSphereIcons;
    /**
     * Extract attribute from element
     */
    extractAttribute(page: Page, selector: string, attribute: string, fallback?: string): Promise<string>;
    /**
     * Extract array of text content from elements
     */
    extractTextArray(page: Page, selector: string): Promise<string[]>;
    /**
     * Take screenshot of the page
     */
    takeScreenshot(page: Page, filename: string): Promise<void>;
    /**
     * Wait for element to be visible
     */
    waitForElement(page: Page, selector: string, timeout?: number): Promise<boolean>;
    /**
     * Wait for network to be idle
     */
    waitForNetworkIdle(page: Page, timeout?: number): Promise<void>;
    /**
     * Close a page and clean up
     */
    closePage(page: Page): Promise<void>;
    /**
     * Get current browser statistics
     */
    getStats(): Promise<{
        contextsCount: number;
        pagesCount: number;
    }>;
    /**
     * Cleanup all resources
     */
    destroy(): Promise<void>;
}
//# sourceMappingURL=playwright-parser.d.ts.map