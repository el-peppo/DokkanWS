import { DOKKAN_BASE_URL, CATEGORY_URLS } from '../config/scraper.config.js';
import { HttpClient } from './http-client.js';
import { DOMParser } from './dom-parser.js';
import { CharacterExtractor } from './character-extractor.js';
import { logger, ScrapingLogger } from '../utils/logger.js';
export class DokkanScraper {
    httpClient;
    config;
    scrapingLogger;
    constructor(config) {
        this.config = config;
        this.httpClient = new HttpClient(config);
        this.scrapingLogger = new ScrapingLogger();
    }
    /**
     * Initialize the scraper (must be called before scraping)
     */
    async initialize() {
        await this.httpClient.initialize();
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
            // Process all categories in parallel
            const categoryPromises = CATEGORY_URLS.map(category => this.scrapeCategory(category));
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
                    categoriesProcessed: [...CATEGORY_URLS],
                    errors: this.httpClient.getErrors()
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
            this.httpClient.destroy();
        }
    }
    /**
     * Scrape characters from a specific category
     */
    async scrapeCategory(category) {
        await logger.info(`Starting category: ${category}`);
        try {
            const categoryUrl = `${DOKKAN_BASE_URL}/wiki/Category:${category}`;
            const categoryHtml = await this.httpClient.fetchWithRetry(categoryUrl);
            if (!categoryHtml) {
                await logger.error(`Failed to fetch category page: ${category}`);
                return [];
            }
            const categoryDocument = await DOMParser.parseHTML(categoryHtml);
            if (!categoryDocument) {
                await logger.error(`Failed to parse category page: ${category}`);
                return [];
            }
            const characterLinks = await DOMParser.extractCharacterLinks(categoryDocument, DOKKAN_BASE_URL);
            await logger.info(`Found ${characterLinks.length} character links in category ${category}`);
            if (characterLinks.length === 0) {
                await logger.warn(`No character links found in category: ${category}`);
                return [];
            }
            // Initialize progress for this category
            await this.scrapingLogger.startScraping(characterLinks.length);
            // Process characters in optimized batches
            const characters = await this.processCharactersBatch(characterLinks);
            await this.scrapingLogger.logProgress(category, characters.length);
            await logger.info(`Completed category ${category}: ${characters.length} characters processed`);
            return characters;
        }
        catch (error) {
            await logger.error(`Error processing category ${category}:`, {}, error);
            return [];
        }
    }
    /**
     * Process character links in optimized batches with controlled concurrency
     */
    async processCharactersBatch(characterLinks) {
        const allCharacters = [];
        const { batchSize } = this.config;
        // Process in batches to manage memory and avoid overwhelming the server
        for (let i = 0; i < characterLinks.length; i += batchSize) {
            const batch = characterLinks.slice(i, i + batchSize);
            const batchNumber = Math.floor(i / batchSize) + 1;
            const totalBatches = Math.ceil(characterLinks.length / batchSize);
            await logger.info(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} characters)`);
            try {
                const batchResults = await this.httpClient.fetchBatch(batch);
                const batchCharacters = await this.extractCharactersFromBatch(batchResults);
                allCharacters.push(...batchCharacters);
                // Small delay between batches to be respectful to the server
                if (i + batchSize < characterLinks.length) {
                    await this.delay(500);
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
     * Extract character data from batch fetch results
     */
    async extractCharactersFromBatch(batchResults) {
        const characters = [];
        for (const { url, data } of batchResults) {
            if (!data) {
                await logger.warn(`No data received for URL: ${url}`);
                continue;
            }
            try {
                const document = await DOMParser.parseHTML(data);
                if (!document) {
                    await logger.warn(`Failed to parse HTML for URL: ${url}`);
                    continue;
                }
                const character = await CharacterExtractor.extractCharacterData(document);
                if (character) {
                    characters.push(character);
                }
                else {
                    await logger.warn(`Failed to extract character data from URL: ${url}`);
                }
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
        return this.httpClient.getStats();
    }
    /**
     * Clear accumulated errors
     */
    clearErrors() {
        this.httpClient.clearErrors();
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
        this.httpClient.destroy();
    }
}
//# sourceMappingURL=scraper.js.map