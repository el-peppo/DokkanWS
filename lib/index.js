import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DokkanScraper } from './services/scraper.js';
import { DEFAULT_CONFIG, BASE_CATEGORY_URLS } from './config/scraper.config.js';
import { logger } from './utils/logger.js';
// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class DokkanScraperApp {
    scraper;
    constructor() {
        this.scraper = new DokkanScraper(DEFAULT_CONFIG);
    }
    /**
     * Run the complete scraping process
     */
    async run(targetCategory) {
        const startTime = Date.now();
        try {
            await this.ensureDirectories();
            await logger.info('Starting Dokkan character data scraper');
            await logger.info(`Configuration: ${JSON.stringify(DEFAULT_CONFIG, null, 2)}`);
            let result;
            if (targetCategory) {
                await logger.info(`Scraping single category: ${targetCategory}`);
                const characters = await this.scraper.scrapeCategoryWithPagination(targetCategory);
                result = {
                    characters,
                    stats: {
                        totalCharacters: characters.length,
                        processingTime: Date.now() - startTime,
                        categoriesProcessed: [targetCategory],
                        errors: []
                    }
                };
            }
            else {
                result = await this.scraper.scrapeAllCharacters();
            }
            const fileName = this.generateFileName();
            await this.saveResults(fileName, result);
            const totalTime = (Date.now() - startTime) / 1000;
            await this.logFinalResults(result, fileName, totalTime);
        }
        catch (error) {
            await logger.error('Scraping failed with critical error:', {}, error);
            process.exit(1);
        }
        finally {
            this.scraper.destroy();
        }
    }
    /**
     * Save scraping results to JSON file
     */
    async saveResults(fileName, result) {
        const filePath = resolve(__dirname, '../data', `${fileName}.json`);
        try {
            // Save full result with metadata
            await writeFile(filePath, JSON.stringify(result, null, 2), { encoding: 'utf8' });
            // Also save characters-only file for backward compatibility
            const charactersOnlyPath = resolve(__dirname, '../data', `${fileName}_characters_only.json`);
            await writeFile(charactersOnlyPath, JSON.stringify(result.characters, null, 2), { encoding: 'utf8' });
            await logger.info(`Data saved to: ${filePath}`);
            await logger.info(`Characters-only data saved to: ${charactersOnlyPath}`);
        }
        catch (error) {
            await logger.error('Failed to save results:', {}, error);
            throw error;
        }
    }
    /**
     * Generate timestamped filename
     */
    generateFileName() {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hour = String(now.getUTCHours()).padStart(2, '0');
        const minute = String(now.getUTCMinutes()).padStart(2, '0');
        return `${year}${month}${day}_${hour}${minute}_DokkanCharacterData`;
    }
    /**
     * Ensure required directories exist
     */
    async ensureDirectories() {
        const directories = [
            resolve(__dirname, '../data'),
            resolve(__dirname, '../logs')
        ];
        for (const dir of directories) {
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
                await logger.info(`Created directory: ${dir}`);
            }
        }
    }
    /**
     * Log final results and statistics
     */
    async logFinalResults(result, fileName, totalTime) {
        const { stats } = result;
        const avgRate = stats.totalCharacters / totalTime;
        await logger.info('Scraping completed successfully!');
        await logger.info(`Results:`);
        await logger.info(`   • Total characters: ${stats.totalCharacters}`);
        await logger.info(`   • Categories processed: ${stats.categoriesProcessed.length}`);
        await logger.info(`   • Processing time: ${totalTime.toFixed(2)}s`);
        await logger.info(`   • Average rate: ${avgRate.toFixed(1)} characters/second`);
        await logger.info(`   • Total errors: ${stats.errors.length}`);
        await logger.info(`Saved as: ${fileName}.json`);
        if (stats.errors.length > 0) {
            await logger.warn(`${stats.errors.length} errors occurred during scraping`);
            await logger.info('Check error.log for details');
        }
        // Log performance metrics
        const httpStats = this.scraper.getStats();
        await logger.info(`HTTP Statistics:`);
        await logger.info(`   • Success rate: ${httpStats.successRate.toFixed(1)}%`);
        await logger.info(`   • Failed requests: ${httpStats.totalErrors}`);
    }
}
/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    // Check for --category flag
    const categoryIndex = args.findIndex(arg => arg === '--category');
    if (categoryIndex !== -1 && categoryIndex + 1 < args.length) {
        const category = args[categoryIndex + 1];
        if (BASE_CATEGORY_URLS.includes(category)) {
            return { category };
        }
        else {
            console.error(`Invalid category: ${category}. Valid categories: ${BASE_CATEGORY_URLS.join(', ')}`);
            process.exit(1);
        }
    }
    // Also support direct category name as first argument (e.g., npm run run SR)
    if (args.length > 0 && BASE_CATEGORY_URLS.includes(args[0])) {
        return { category: args[0] };
    }
    return {};
}
// Self-executing when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const { category } = parseArgs();
    const app = new DokkanScraperApp();
    app.run(category).catch(async (error) => {
        await logger.error('Application failed:', {}, error);
        process.exit(1);
    });
}
export default DokkanScraperApp;
//# sourceMappingURL=index.js.map