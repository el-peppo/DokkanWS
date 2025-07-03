import { Character, ScrapingConfig, ScrapingResult } from '../types/character.js';
import { DOKKAN_BASE_URL, BASE_CATEGORY_URLS, CategoryUrl } from '../config/scraper.config.js';
import { HttpClient } from './http-client.js';
import { DOMParser } from './dom-parser.js';
import { CharacterExtractor } from './character-extractor.js';
import { logger, ScrapingLogger } from '../utils/logger.js';

export class DokkanScraper {
    private readonly httpClient: HttpClient;
    private readonly config: ScrapingConfig;
    private readonly scrapingLogger: ScrapingLogger;

    constructor(config: ScrapingConfig) {
        this.config = config;
        this.httpClient = new HttpClient(config);
        this.scrapingLogger = new ScrapingLogger();
    }

    /**
     * Initialize the scraper (must be called before scraping)
     */
    async initialize(): Promise<void> {
        await this.httpClient.initialize();
    }

    /**
     * Scrape all Dokkan character data
     */
    async scrapeAllCharacters(): Promise<ScrapingResult> {
        const startTime = Date.now();
        await logger.info('Starting comprehensive Dokkan character scrape');

        // Ensure http client is initialized
        await this.initialize();

        try {
            // Process all categories with dynamic pagination
            const categoryPromises = BASE_CATEGORY_URLS.map(category => 
                this.scrapeCategoryWithPagination(category)
            );

            const categoryResults = await Promise.all(categoryPromises);
            const allCharacters = categoryResults.flat();

            // Filter out any null results
            const validCharacters = allCharacters.filter((char): char is Character => char !== null);

            const processingTime = Date.now() - startTime;
            await this.scrapingLogger.logCompletion();

            const result: ScrapingResult = {
                characters: validCharacters,
                stats: {
                    totalCharacters: validCharacters.length,
                    processingTime,
                    categoriesProcessed: [...BASE_CATEGORY_URLS],
                    errors: this.httpClient.getErrors()
                }
            };

            await logger.info(`Scraping completed successfully! Total characters: ${validCharacters.length}, Processing time: ${(processingTime / 1000).toFixed(2)}s`);
            return result;

        } catch (error) {
            await logger.error('Critical error during scraping:', {}, error as Error);
            throw error;
        } finally {
            this.httpClient.destroy();
        }
    }

    /**
     * Scrape characters from a specific category
     */
    async scrapeCategory(category: CategoryUrl): Promise<Character[]> {
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

        } catch (error) {
            await logger.error(`Error processing category ${category}:`, {}, error as Error);
            return [];
        }
    }

    /**
     * Scrape characters from a category with dynamic pagination support
     */
    async scrapeCategoryWithPagination(category: CategoryUrl): Promise<Character[]> {
        await logger.info(`Starting category: ${category}`);
        
        const allCharacters: Character[] = [];
        const processedUrls = new Set<string>();
        const urlsToProcess = [`${DOKKAN_BASE_URL}/wiki/Category:${category}`];
        
        while (urlsToProcess.length > 0) {
            const currentUrl = urlsToProcess.shift()!;
            
            // Skip if already processed
            if (processedUrls.has(currentUrl)) {
                continue;
            }
            
            processedUrls.add(currentUrl);
            
            try {
                const categoryHtml = await this.httpClient.fetchWithRetry(currentUrl);
                
                if (!categoryHtml) {
                    await logger.error(`Failed to fetch category page: ${currentUrl}`);
                    continue;
                }

                const categoryDocument = await DOMParser.parseHTML(categoryHtml);
                if (!categoryDocument) {
                    await logger.error(`Failed to parse category page: ${currentUrl}`);
                    continue;
                }

                // Extract character links from current page
                const characterLinks = await DOMParser.extractCharacterLinks(categoryDocument, DOKKAN_BASE_URL);
                await logger.info(`Found ${characterLinks.length} character links in category ${category} (page: ${currentUrl})`);

                if (characterLinks.length > 0) {
                    // Initialize progress tracking for first page
                    if (allCharacters.length === 0) {
                        await this.scrapingLogger.startScraping(characterLinks.length);
                    }

                    // Process characters from this page
                    const pageCharacters = await this.processCharactersBatch(characterLinks);
                    allCharacters.push(...pageCharacters);
                    
                    await this.scrapingLogger.logProgress(category, pageCharacters.length);
                }

                // Look for pagination URLs to continue processing
                const paginationUrls = await DOMParser.extractPaginationUrls(categoryDocument, currentUrl);
                
                // Add new pagination URLs to the queue
                for (const paginationUrl of paginationUrls) {
                    if (!processedUrls.has(paginationUrl) && !urlsToProcess.includes(paginationUrl)) {
                        urlsToProcess.push(paginationUrl);
                        await logger.info(`Found pagination URL: ${paginationUrl}`);
                    }
                }

                // If no characters found and no pagination, we're done
                if (characterLinks.length === 0 && paginationUrls.length === 0) {
                    break;
                }

            } catch (error) {
                await logger.error(`Error processing category page ${currentUrl}:`, {}, error as Error);
                continue;
            }
        }
        
        await logger.info(`Completed category ${category}: ${allCharacters.length} characters processed from ${processedUrls.size} pages`);
        return allCharacters;
    }

    /**
     * Process character links in optimized batches with controlled concurrency
     */
    private async processCharactersBatch(characterLinks: string[]): Promise<Character[]> {
        const allCharacters: Character[] = [];
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

            } catch (error) {
                await logger.error(`Error processing batch ${batchNumber}:`, {}, error as Error);
                // Continue with next batch instead of failing completely
            }
        }

        return allCharacters;
    }

    /**
     * Extract character data from batch fetch results
     */
    private async extractCharactersFromBatch(batchResults: Array<{ url: string; data: string | null }>): Promise<Character[]> {
        const characters: Character[] = [];

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
                } else {
                    await logger.warn(`Failed to extract character data from URL: ${url}`);
                }

            } catch (error) {
                await logger.error(`Error extracting character from ${url}:`, {}, error as Error);
            }
        }

        return characters;
    }

    /**
     * Get scraping statistics
     */
    getStats(): { successRate: number; totalErrors: number } {
        return this.httpClient.getStats();
    }

    /**
     * Clear accumulated errors
     */
    clearErrors(): void {
        this.httpClient.clearErrors();
    }

    /**
     * Utility delay function
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Cleanup resources
     */
    destroy(): void {
        this.httpClient.destroy();
    }
}