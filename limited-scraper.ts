import { ScraperService } from './src/services/scraper.js';
import { logger } from './src/utils/logger.js';
import { writeFile, mkdir } from 'fs/promises';
import { DEFAULT_CONFIG } from './src/config/scraper.config.js';

async function runLimitedScraper() {
    try {
        logger.info('Starting limited Dokkan scraper for ~100 characters');
        
        const scraper = new ScraperService(DEFAULT_CONFIG);
        
        // Just scrape LR characters (should be around 164 characters)
        const categories = ['LR'];
        
        const results = await scraper.scrapeCategories(categories);
        
        // Take first 100 characters
        const limitedCharacters = results.characters.slice(0, 100);
        
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        
        // Ensure data directory exists
        try {
            await mkdir('./data', { recursive: true });
        } catch (error) {
            // Directory might already exist
        }
        
        const filename = `./data/${timestamp}_DokkanCharacterData_sample100.json`;
        
        const outputData = {
            characters: limitedCharacters,
            stats: {
                ...results.stats,
                totalCharacters: limitedCharacters.length,
                categoriesProcessed: categories
            }
        };
        
        await writeFile(filename, JSON.stringify(outputData, null, 2));
        await writeFile(`./data/${timestamp}_DokkanCharacterData_sample100_characters_only.json`, 
                       JSON.stringify(limitedCharacters, null, 2));
        
        logger.info(`Scraping completed successfully!`);
        logger.info(`Scraped ${limitedCharacters.length} characters`);
        logger.info(`Output saved to: ${filename}`);
        
    } catch (error) {
        logger.error('Scraping failed:', error);
        process.exit(1);
    }
}

runLimitedScraper();