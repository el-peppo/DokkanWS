import { chromium } from 'playwright';
import { logger } from '../utils/logger.js';
export class PlaywrightParser {
    browser = null;
    contexts = [];
    config;
    nextContextIndex = 0;
    constructor(config = {}) {
        this.config = {
            headless: true,
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            timeout: 30000,
            maxConcurrentContexts: 5,
            screenshotOnError: true,
            screenshotPath: './screenshots',
            blockResources: true,
            ...config
        };
    }
    /**
     * Initialize the browser and create contexts
     */
    async initialize() {
        try {
            await logger.info('Initializing Playwright browser...');
            this.browser = await chromium.launch({
                headless: this.config.headless,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--window-size=1920,1080'
                ]
            });
            // Create initial browser contexts
            for (let i = 0; i < this.config.maxConcurrentContexts; i++) {
                const context = await this.createContext();
                this.contexts.push(context);
            }
            await logger.info(`Playwright initialized with ${this.contexts.length} browser contexts`);
        }
        catch (error) {
            await logger.error('Failed to initialize Playwright:', {}, error);
            throw error;
        }
    }
    /**
     * Create a new browser context with optimized settings
     */
    async createContext() {
        if (!this.browser) {
            throw new Error('Browser not initialized. Call initialize() first.');
        }
        const context = await this.browser.newContext({
            viewport: this.config.viewport,
            userAgent: this.config.userAgent,
            // Add reasonable defaults for scraping
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
            // Reduce resource usage
            reducedMotion: 'reduce'
        });
        // Block unnecessary resources for better performance
        if (this.config.blockResources) {
            await context.route('**/*', (route) => {
                const resourceType = route.request().resourceType();
                // Block images, stylesheets, fonts, media for better performance
                if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                    route.abort();
                }
                else if (resourceType === 'other') {
                    // Block ads and analytics
                    const url = route.request().url();
                    if (url.includes('google-analytics') ||
                        url.includes('googlesyndication') ||
                        url.includes('doubleclick') ||
                        url.includes('facebook.com') ||
                        url.includes('twitter.com')) {
                        route.abort();
                    }
                    else {
                        route.continue();
                    }
                }
                else {
                    route.continue();
                }
            });
        }
        return context;
    }
    /**
     * Get the next available context in round-robin fashion
     */
    getNextContext() {
        if (this.contexts.length === 0) {
            throw new Error('No browser contexts available. Call initialize() first.');
        }
        const context = this.contexts[this.nextContextIndex];
        this.nextContextIndex = (this.nextContextIndex + 1) % this.contexts.length;
        return context;
    }
    /**
     * Navigate to a URL and return the page
     */
    async navigateToPage(url) {
        const context = this.getNextContext();
        const page = await context.newPage();
        try {
            await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: this.config.timeout
            });
            // Wait for the main content to load
            await page.waitForLoadState('networkidle', { timeout: 10000 });
            return page;
        }
        catch (error) {
            await logger.error(`Failed to navigate to ${url}:`, { url }, error);
            // Take screenshot on error if enabled
            if (this.config.screenshotOnError) {
                await this.takeScreenshot(page, `navigation-error-${Date.now()}.png`);
            }
            await page.close();
            throw error;
        }
    }
    /**
     * Parse HTML content and return a page object
     */
    async parseHTML(html) {
        const context = this.getNextContext();
        const page = await context.newPage();
        try {
            await page.setContent(html, { waitUntil: 'domcontentloaded' });
            return page;
        }
        catch (error) {
            await logger.error('Failed to parse HTML:', {}, error);
            await page.close();
            throw error;
        }
    }
    /**
     * Extract character links from category page
     */
    async extractCharacterLinks(page, baseUrl) {
        try {
            await page.waitForSelector('.category-page__member-link', { timeout: 5000 });
            const links = await page.$$eval('.category-page__member-link', (elements) => {
                return elements.map(el => el.href);
            });
            return links.map(link => link.startsWith('http') ? link : baseUrl + link);
        }
        catch (error) {
            await logger.error('Failed to extract character links:', {}, error);
            return [];
        }
    }
    /**
     * Extract pagination URLs from category page
     */
    async extractPaginationUrls(page, currentUrl) {
        try {
            const categoryName = currentUrl.split('/Category:')[1]?.split('?')[0];
            if (!categoryName)
                return [];
            const paginationUrls = await page.$$eval('a', (elements, catName) => {
                const urls = [];
                elements.forEach(link => {
                    const href = link.getAttribute('href') || '';
                    const text = link.textContent?.trim() || '';
                    // Look for category links with "from" parameter
                    if (href.includes(`Category:${catName}`) && href.includes('from=')) {
                        urls.push(href);
                    }
                    // Look for "next 200" style links
                    const lowerText = text.toLowerCase();
                    if ((lowerText.includes('next') || lowerText.includes('200')) &&
                        href.includes(`Category:${catName}`)) {
                        urls.push(href);
                    }
                });
                return urls;
            }, categoryName);
            // Make URLs absolute and filter out current URL
            const absoluteUrls = paginationUrls.map(url => url.startsWith('http') ? url : `https://dbz-dokkanbattle.fandom.com${url}`);
            return absoluteUrls.filter(url => url !== currentUrl);
        }
        catch (error) {
            await logger.error('Failed to extract pagination URLs:', { currentUrl }, error);
            return [];
        }
    }
    /**
     * Safe element query with timeout
     */
    async querySelector(page, selector, timeout = 5000) {
        try {
            return await page.waitForSelector(selector, { timeout });
        }
        catch (error) {
            await logger.debug(`Selector "${selector}" not found within ${timeout}ms`);
            return null;
        }
    }
    /**
     * Safe multiple element query
     */
    async querySelectorAll(page, selector) {
        try {
            return await page.$$(selector);
        }
        catch (error) {
            await logger.debug(`Selector "${selector}" returned no elements`);
            return [];
        }
    }
    /**
     * Extract text content from element
     */
    async extractText(page, selector, fallback = 'Error') {
        try {
            const element = await page.$(selector);
            if (element) {
                const text = await element.textContent();
                return text?.trim() || fallback;
            }
            return fallback;
        }
        catch (error) {
            return fallback;
        }
    }
    /**
     * Extract text content with Ki sphere replacements
     */
    async extractTextWithKiSpheres(page, selector, fallback = 'Error') {
        try {
            const element = await page.$(selector);
            if (element) {
                // Replace Ki sphere images with text equivalents
                const html = await element.innerHTML();
                const processedHtml = this.replaceKiSphereIcons(html);
                // Create temporary element to extract clean text
                const text = await page.evaluate((htmlContent) => {
                    const div = document.createElement('div');
                    div.innerHTML = htmlContent;
                    return div.textContent || '';
                }, processedHtml);
                return text.trim() || fallback;
            }
            return fallback;
        }
        catch (error) {
            return fallback;
        }
    }
    /**
     * Replace Ki sphere icons with text equivalents
     */
    replaceKiSphereIcons(html) {
        return html
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:PHY"[^>]*>.*?<\/a><\/span>/g, '[PHY]')
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:AGL"[^>]*>.*?<\/a><\/span>/g, '[AGL]')
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:STR"[^>]*>.*?<\/a><\/span>/g, '[STR]')
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:TEQ"[^>]*>.*?<\/a><\/span>/g, '[TEQ]')
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:INT"[^>]*>.*?<\/a><\/span>/g, '[INT]')
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:Rainbow"[^>]*>.*?<\/a><\/span>/g, '[RAINBOW]');
    }
    /**
     * Extract attribute from element
     */
    async extractAttribute(page, selector, attribute, fallback = 'Error') {
        try {
            const element = await page.$(selector);
            if (element) {
                const attr = await element.getAttribute(attribute);
                return attr || fallback;
            }
            return fallback;
        }
        catch (error) {
            return fallback;
        }
    }
    /**
     * Extract array of text content from elements
     */
    async extractTextArray(page, selector) {
        try {
            return await page.$$eval(selector, (elements) => {
                return elements.map(el => el.textContent?.trim() || '');
            });
        }
        catch (error) {
            return ['Error'];
        }
    }
    /**
     * Take screenshot of the page
     */
    async takeScreenshot(page, filename) {
        try {
            if (this.config.screenshotPath) {
                await page.screenshot({
                    path: `${this.config.screenshotPath}/${filename}`,
                    fullPage: true
                });
                await logger.debug(`Screenshot saved: ${filename}`);
            }
        }
        catch (error) {
            await logger.error(`Failed to take screenshot ${filename}:`, {}, error);
        }
    }
    /**
     * Wait for element to be visible
     */
    async waitForElement(page, selector, timeout = 10000) {
        try {
            await page.waitForSelector(selector, { state: 'visible', timeout });
            return true;
        }
        catch (error) {
            await logger.debug(`Element "${selector}" not visible within ${timeout}ms`);
            return false;
        }
    }
    /**
     * Wait for network to be idle
     */
    async waitForNetworkIdle(page, timeout = 30000) {
        try {
            await page.waitForLoadState('networkidle', { timeout });
        }
        catch (error) {
            await logger.debug(`Network idle timeout after ${timeout}ms`);
        }
    }
    /**
     * Close a page and clean up
     */
    async closePage(page) {
        try {
            await page.close();
        }
        catch (error) {
            await logger.error('Failed to close page:', {}, error);
        }
    }
    /**
     * Get current browser statistics
     */
    async getStats() {
        const pagesCount = await Promise.all(this.contexts.map(async (context) => {
            try {
                return context.pages().length;
            }
            catch {
                return 0;
            }
        }));
        return {
            contextsCount: this.contexts.length,
            pagesCount: pagesCount.reduce((sum, count) => sum + count, 0)
        };
    }
    /**
     * Cleanup all resources
     */
    async destroy() {
        try {
            await logger.info('Cleaning up Playwright resources...');
            // Close all contexts
            for (const context of this.contexts) {
                await context.close();
            }
            this.contexts = [];
            // Close the browser
            if (this.browser) {
                await this.browser.close();
                this.browser = null;
            }
            await logger.info('Playwright cleanup completed');
        }
        catch (error) {
            await logger.error('Error during Playwright cleanup:', {}, error);
        }
    }
}
//# sourceMappingURL=playwright-parser.js.map