import { Character, ScrapingConfig, ScrapingResult } from '../types/character.js';
import { CategoryUrl } from '../config/scraper.config.js';
export declare class DokkanScraper {
    private readonly httpClient;
    private readonly config;
    private readonly scrapingLogger;
    constructor(config: ScrapingConfig);
    /**
     * Initialize the scraper (must be called before scraping)
     */
    initialize(): Promise<void>;
    /**
     * Scrape all Dokkan character data
     */
    scrapeAllCharacters(): Promise<ScrapingResult>;
    /**
     * Scrape characters from a specific category
     */
    scrapeCategory(category: CategoryUrl): Promise<Character[]>;
    /**
     * Process character links in optimized batches with controlled concurrency
     */
    private processCharactersBatch;
    /**
     * Extract character data from batch fetch results
     */
    private extractCharactersFromBatch;
    /**
     * Get scraping statistics
     */
    getStats(): {
        successRate: number;
        totalErrors: number;
    };
    /**
     * Clear accumulated errors
     */
    clearErrors(): void;
    /**
     * Utility delay function
     */
    private delay;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
//# sourceMappingURL=scraper.d.ts.map