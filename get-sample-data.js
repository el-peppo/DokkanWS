import { DokkanScraper } from './lib/services/scraper.js';
import { logger } from './lib/utils/logger.js';
import { writeFile, mkdir } from 'fs/promises';
import { DEFAULT_CONFIG } from './lib/config/scraper.config.js';

async function getSampleData() {
    try {
        logger.info('Getting 100 sample characters from LR category');
        
        const scraper = new DokkanScraper(DEFAULT_CONFIG);
        
        // Just scrape LR characters (should be around 164 characters)
        const lrCharacters = await scraper.scrapeCategory('LR');
        
        // Take first 100 characters
        const limitedCharacters = lrCharacters.slice(0, 100);
        
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
                totalCharacters: limitedCharacters.length,
                processingTime: 0,
                categoriesProcessed: ['LR'],
                errors: []
            }
        };
        
        await writeFile(filename, JSON.stringify(outputData, null, 2));
        await writeFile(`./data/${timestamp}_DokkanCharacterData_sample100_characters_only.json`, 
                       JSON.stringify(limitedCharacters, null, 2));
        
        logger.info(`Scraping completed successfully!`);
        logger.info(`Scraped ${limitedCharacters.length} characters`);
        logger.info(`Output saved to: ${filename}`);
        
        return filename;
        
    } catch (error) {
        logger.error('Scraping failed:', error);
        throw error;
    }
}

getSampleData().then(filename => {
    console.log(`Sample data ready: ${filename}`);
    process.exit(0);
}).catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
});