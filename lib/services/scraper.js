import { DOKKAN_BASE_URL, BASE_CATEGORY_URLS } from '../config/scraper.config.js';
import { PlaywrightClient } from './playwright-client.js';
import { DOMParserAdapter } from './dom-parser-adapter.js';
import { CharacterExtractor } from './character-extractor.js';
import { logger, ScrapingLogger } from '../utils/logger.js';
export class DokkanScraper {
    playwrightClient;
    config;
    scrapingLogger;
    constructor(config) {
        this.config = config;
        this.playwrightClient = new PlaywrightClient(config);
        this.scrapingLogger = new ScrapingLogger();
    }
    /**
     * Initialize the scraper (must be called before scraping)
     */
    async initialize() {
        await this.playwrightClient.initialize();
        // Initialize the DOM parser adapter with Playwright support
        const playwrightParser = this.playwrightClient.playwrightParser;
        await DOMParserAdapter.initializePlaywright(playwrightParser);
        await logger.info('Scraper initialized with Playwright');
    }
    /**
     * Scrape all Dokkan character data
     */
    async scrapeAllCharacters() {
        const startTime = Date.now();
        await logger.info('Starting comprehensive Dokkan character scrape');
        // Ensure http client is initialized
        await this.initialize();
        try {
            // Process all categories with dynamic pagination
            const categoryPromises = BASE_CATEGORY_URLS.map(category => this.scrapeCategoryWithPagination(category));
            const categoryResults = await Promise.all(categoryPromises);
            const allCharacters = categoryResults.flat();
            // Filter out any null results
            const validCharacters = allCharacters.filter((char) => char !== null);
            const processingTime = Date.now() - startTime;
            await this.scrapingLogger.logCompletion();
            const result = {
                characters: validCharacters,
                stats: {
                    totalCharacters: validCharacters.length,
                    processingTime,
                    categoriesProcessed: [...BASE_CATEGORY_URLS],
                    errors: this.playwrightClient.getErrors()
                }
            };
            await logger.info(`Scraping completed successfully! Total characters: ${validCharacters.length}, Processing time: ${(processingTime / 1000).toFixed(2)}s`);
            return result;
        }
        catch (error) {
            await logger.error('Critical error during scraping:', {}, error);
            throw error;
        }
        finally {
            this.playwrightClient.destroy();
        }
    }
    /**
     * Scrape characters from a specific category
     */
    async scrapeCategory(category) {
        await logger.info(`Starting category: ${category}`);
        try {
            const categoryUrl = `${DOKKAN_BASE_URL}/wiki/Category:${category}`;
            const categoryPage = await this.playwrightClient.fetchWithRetry(categoryUrl);
            if (!categoryPage) {
                await logger.error(`Failed to fetch category page: ${category}`);
                return [];
            }
            const characterLinks = await DOMParserAdapter.extractCharacterLinks(categoryPage, DOKKAN_BASE_URL);
            await logger.info(`Found ${characterLinks.length} character links in category ${category}`);
            if (characterLinks.length === 0) {
                await logger.warn(`No character links found in category: ${category}`);
                await DOMParserAdapter.closePage(categoryPage);
                return [];
            }
            // Initialize progress for this category
            await this.scrapingLogger.startScraping(characterLinks.length);
            // Process characters in optimized batches
            const characters = await this.processCharactersBatch(characterLinks);
            await this.scrapingLogger.logProgress(category, characters.length);
            await logger.info(`Completed category ${category}: ${characters.length} characters processed`);
            // Clean up the category page
            await DOMParserAdapter.closePage(categoryPage);
            return characters;
        }
        catch (error) {
            await logger.error(`Error processing category ${category}:`, {}, error);
            return [];
        }
    }
    /**
     * Scrape characters from a category with dynamic pagination support
     */
    async scrapeCategoryWithPagination(category) {
        await logger.info(`Starting category with pagination: ${category}`);
        const allCharacters = [];
        const processedUrls = new Set();
        const urlsToProcess = [`${DOKKAN_BASE_URL}/wiki/Category:${category}`];
        let progressInitialized = false;
        let pageNumber = 1;
        await logger.info(`Initial URL queue: ${urlsToProcess[0]}`);
        while (urlsToProcess.length > 0) {
            const currentUrl = urlsToProcess.shift();
            // Skip if already processed
            if (processedUrls.has(currentUrl)) {
                await logger.debug(`Skipping already processed URL: ${currentUrl}`);
                continue;
            }
            processedUrls.add(currentUrl);
            await logger.info(`Processing page ${pageNumber} for category ${category}: ${currentUrl}`);
            try {
                const categoryPage = await this.playwrightClient.fetchWithRetry(currentUrl);
                if (!categoryPage) {
                    await logger.error(`Failed to fetch category page: ${currentUrl}`);
                    continue;
                }
                // Extract character links from current page
                const characterLinks = await DOMParserAdapter.extractCharacterLinks(categoryPage, DOKKAN_BASE_URL);
                await logger.info(`Page ${pageNumber}: Found ${characterLinks.length} character links`);
                // Look for pagination URLs to add to queue
                await logger.info(`Looking for pagination links on page ${pageNumber}...`);
                const paginationUrls = await DOMParserAdapter.extractPaginationUrls(categoryPage, currentUrl);
                await logger.info(`Page ${pageNumber}: Found ${paginationUrls.length} potential pagination URLs`);
                // Add new pagination URLs to the queue
                let newUrlsAdded = 0;
                for (const paginationUrl of paginationUrls) {
                    if (!processedUrls.has(paginationUrl) && !urlsToProcess.includes(paginationUrl)) {
                        urlsToProcess.push(paginationUrl);
                        newUrlsAdded++;
                        await logger.info(`Found new pagination URL: ${paginationUrl}`);
                    }
                }
                if (newUrlsAdded > 0) {
                    await logger.info(`Added ${newUrlsAdded} new pagination URLs. Queue size: ${urlsToProcess.length}`);
                }
                else if (paginationUrls.length > 0) {
                    await logger.info(`All ${paginationUrls.length} pagination URLs were already processed or in queue`);
                }
                // Initialize progress tracking once we know the scope
                if (!progressInitialized && characterLinks.length > 0) {
                    // Estimate total characters: current page + remaining pages
                    const estimatedTotal = characterLinks.length * (1 + urlsToProcess.length);
                    await this.scrapingLogger.startScraping(estimatedTotal);
                    progressInitialized = true;
                }
                if (characterLinks.length > 0) {
                    // Process characters from this page
                    const pageCharacters = await this.processCharactersBatch(characterLinks);
                    allCharacters.push(...pageCharacters);
                    // Log progress for this page batch
                    await this.scrapingLogger.logProgress(category, pageCharacters.length);
                }
                // If no characters found and no pagination, we're done
                if (characterLinks.length === 0 && paginationUrls.length === 0) {
                    await logger.info(`No more data found on page ${pageNumber}, finishing category ${category}`);
                    await DOMParserAdapter.closePage(categoryPage);
                    break;
                }
                pageNumber++;
                // Debug: Log queue status before next iteration
                await logger.info(`End of page ${pageNumber - 1} processing. URLs in queue: ${urlsToProcess.length}, Processed URLs: ${processedUrls.size}`);
                if (urlsToProcess.length > 0) {
                    await logger.info(`Next URL to process: ${urlsToProcess[0]}`);
                }
                // Clean up the category page before processing next page
                await DOMParserAdapter.closePage(categoryPage);
            }
            catch (error) {
                await logger.error(`Error processing category page ${currentUrl}:`, {}, error);
                continue;
            }
        }
        await logger.info(`Completed category ${category}: ${allCharacters.length} characters processed from ${processedUrls.size} pages`);
        return allCharacters;
    }
    /**
     * Process character links in optimized batches with enhanced progress tracking
     */
    async processCharactersBatch(characterLinks) {
        const allCharacters = [];
        const { batchSize } = this.config;
        const startTime = Date.now();
        let processedCount = 0;
        // Process in batches to manage memory and avoid overwhelming the server
        for (let i = 0; i < characterLinks.length; i += batchSize) {
            const batch = characterLinks.slice(i, i + batchSize);
            const batchNumber = Math.floor(i / batchSize) + 1;
            const totalBatches = Math.ceil(characterLinks.length / batchSize);
            await logger.info(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} characters)`);
            try {
                // Enhanced batch processing with progress tracking using Playwright
                const batchResults = await this.playwrightClient.fetchBatch(batch, (completed, total) => {
                    const batchProgress = Math.round((completed / total) * 100);
                    if (completed % 5 === 0 || completed === total) { // Log every 5 requests or completion
                        logger.info(`Batch ${batchNumber} progress: ${completed}/${total} (${batchProgress}%)`);
                    }
                });
                const batchCharacters = await this.extractCharactersFromBatch(batchResults);
                // Add characters and track progress
                allCharacters.push(...batchCharacters);
                processedCount += batchCharacters.length;
                // Calculate and log performance metrics
                const elapsed = Date.now() - startTime;
                const rate = processedCount / (elapsed / 1000);
                const remaining = characterLinks.length - processedCount;
                const eta = remaining > 0 ? Math.round(remaining / rate) : 0;
                await logger.info(`Batch ${batchNumber} completed: ${batchCharacters.length} characters extracted. Total: ${processedCount}/${characterLinks.length} (${Math.round((processedCount / characterLinks.length) * 100)}%) Rate: ${rate.toFixed(1)}/s ETA: ${eta}s`);
                // Adaptive delay based on performance and error rate
                if (i + batchSize < characterLinks.length) {
                    const errorRate = this.playwrightClient.getStats().totalErrors / (processedCount || 1);
                    const adaptiveDelay = errorRate > 0.1 ? 1000 : 500; // Longer delay if many errors
                    await this.delay(adaptiveDelay);
                }
                // Memory management for large datasets
                if (batchNumber % 10 === 0 && global.gc) {
                    global.gc();
                    await logger.info(`Memory cleanup performed after batch ${batchNumber}`);
                }
            }
            catch (error) {
                await logger.error(`Error processing batch ${batchNumber}:`, {}, error);
                // Continue with next batch instead of failing completely
            }
        }
        return allCharacters;
    }
    /**
     * Extract character data from batch fetch results using Playwright
     */
    async extractCharactersFromBatch(batchResults) {
        const characters = [];
        for (const { url, page } of batchResults) {
            if (!page) {
                await logger.warn(`No page received for URL: ${url}`);
                continue;
            }
            try {
                const character = await CharacterExtractor.extractCharacterData(page);
                if (character) {
                    characters.push(character);
                }
                else {
                    await logger.warn(`Failed to extract character data from URL: ${url}`);
                    // Take screenshot for debugging
                    await DOMParserAdapter.takeScreenshot(page, `failed-extraction-${Date.now()}.png`);
                }
                // Clean up the page
                await DOMParserAdapter.closePage(page);
            }
            catch (error) {
                await logger.error(`Error extracting character from ${url}:`, {}, error);
            }
        }
        return characters;
    }
    /**
     * Get scraping statistics
     */
    getStats() {
        return this.playwrightClient.getStats();
    }
    /**
     * Get detailed browser statistics
     */
    async getBrowserStats() {
        return await this.playwrightClient.getBrowserStats();
    }
    /**
     * Clear accumulated errors
     */
    clearErrors() {
        this.playwrightClient.clearErrors();
    }
    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Cleanup resources
     */
    destroy() {
        this.playwrightClient.destroy();
    }
}
//# sourceMappingURL=scraper.js.map