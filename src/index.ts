import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DokkanScraper } from './services/scraper.js';
import { DEFAULT_CONFIG } from './config/scraper.config.js';
import { ScrapingResult } from './types/character.js';
import { logger } from './utils/logger.js';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DokkanScraperApp {
    private readonly scraper: DokkanScraper;

    constructor() {
        this.scraper = new DokkanScraper(DEFAULT_CONFIG);
        this.ensureDirectories();
    }

    /**
     * Run the complete scraping process
     */
    async run(): Promise<void> {
        const startTime = Date.now();
        
        try {
            logger.info('🚀 Starting Dokkan character data scraper');
            logger.info(`Configuration: ${JSON.stringify(DEFAULT_CONFIG, null, 2)}`);

            const result = await this.scraper.scrapeAllCharacters();
            
            const fileName = this.generateFileName();
            await this.saveResults(fileName, result);
            
            const totalTime = (Date.now() - startTime) / 1000;
            this.logFinalResults(result, fileName, totalTime);

        } catch (error) {
            logger.error('❌ Scraping failed with critical error:', error);
            process.exit(1);
        } finally {
            this.scraper.destroy();
        }
    }

    /**
     * Save scraping results to JSON file
     */
    private async saveResults(fileName: string, result: ScrapingResult): Promise<void> {
        const filePath = resolve(__dirname, '../data', `${fileName}.json`);
        
        try {
            // Save full result with metadata
            await writeFile(
                filePath,
                JSON.stringify(result, null, 2),
                { encoding: 'utf8' }
            );

            // Also save characters-only file for backward compatibility
            const charactersOnlyPath = resolve(__dirname, '../data', `${fileName}_characters_only.json`);
            await writeFile(
                charactersOnlyPath,
                JSON.stringify(result.characters, null, 2),
                { encoding: 'utf8' }
            );

            logger.info(`💾 Data saved to: ${filePath}`);
            logger.info(`💾 Characters-only data saved to: ${charactersOnlyPath}`);

        } catch (error) {
            logger.error('Failed to save results:', error);
            throw error;
        }
    }

    /**
     * Generate timestamped filename
     */
    private generateFileName(): string {
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
    private ensureDirectories(): void {
        const directories = [
            resolve(__dirname, '../data'),
            resolve(__dirname, '../logs')
        ];

        for (const dir of directories) {
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
                logger.info(`📁 Created directory: ${dir}`);
            }
        }
    }

    /**
     * Log final results and statistics
     */
    private logFinalResults(result: ScrapingResult, fileName: string, totalTime: number): void {
        const { stats } = result;
        const avgRate = stats.totalCharacters / totalTime;

        logger.info('✅ Scraping completed successfully!');
        logger.info(`📊 Results:`);
        logger.info(`   • Total characters: ${stats.totalCharacters}`);
        logger.info(`   • Categories processed: ${stats.categoriesProcessed.length}`);
        logger.info(`   • Processing time: ${totalTime.toFixed(2)}s`);
        logger.info(`   • Average rate: ${avgRate.toFixed(1)} characters/second`);
        logger.info(`   • Total errors: ${stats.errors.length}`);
        logger.info(`📁 Saved as: ${fileName}.json`);

        if (stats.errors.length > 0) {
            logger.warn(`⚠️  ${stats.errors.length} errors occurred during scraping`);
            logger.info('Check error.log for details');
        }

        // Log performance metrics
        const httpStats = this.scraper.getStats();
        logger.info(`🌐 HTTP Statistics:`);
        logger.info(`   • Success rate: ${httpStats.successRate.toFixed(1)}%`);
        logger.info(`   • Failed requests: ${httpStats.totalErrors}`);
    }
}

// Self-executing when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const app = new DokkanScraperApp();
    app.run().catch(error => {
        logger.error('Application failed:', error);
        process.exit(1);
    });
}

export default DokkanScraperApp;