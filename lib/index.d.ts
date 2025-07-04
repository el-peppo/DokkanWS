import { CategoryUrl } from './config/scraper.config.js';
export declare class DokkanScraperApp {
    private readonly scraper;
    constructor();
    /**
     * Run the complete scraping process
     */
    run(targetCategory?: CategoryUrl): Promise<void>;
    /**
     * Save scraping results to JSON file
     */
    private saveResults;
    /**
     * Generate timestamped filename
     */
    private generateFileName;
    /**
     * Ensure required directories exist
     */
    private ensureDirectories;
    /**
     * Log final results and statistics
     */
    private logFinalResults;
}
export default DokkanScraperApp;
//# sourceMappingURL=index.d.ts.map