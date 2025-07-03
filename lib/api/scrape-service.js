import { DatabaseConnection } from '../database/connection.js';
import { DokkanScraper } from '../services/scraper.js';
import { logger } from '../utils/logger.js';
import { EventEmitter } from 'events';
export class ScrapeService extends EventEmitter {
    db;
    scraper;
    isRunning = false;
    currentProgress = {
        isRunning: false,
        category: '',
        processed: 0,
        total: 0,
        progress: 0,
        eta: 0,
        errors: 0
    };
    constructor() {
        super();
        this.db = new DatabaseConnection();
        this.scraper = null; // Will be initialized in connect()
    }
    async connect() {
        await this.db.connect();
        // Initialize scraper with config
        const { config } = await import('../config/config.js');
        this.scraper = new DokkanScraper(config.scraping);
    }
    async disconnect() {
        await this.db.disconnect();
    }
    async getStatus() {
        try {
            // Get database stats
            const totalResult = await this.db.query('SELECT COUNT(*) as count FROM characters');
            const totalCharacters = totalResult[0].count;
            // TODO: Implement last update tracking with metadata table
            const lastUpdate = null;
            // Simple heuristic: if we have less than 1000 characters, we likely need an update
            // In production, this would check against actual wiki data
            const needsUpdate = totalCharacters < 1000;
            const estimatedNewCharacters = needsUpdate ? Math.max(1200 - totalCharacters, 0) : 0;
            return {
                isUpToDate: !needsUpdate,
                lastUpdate,
                totalCharacters,
                needsUpdate,
                estimatedNewCharacters
            };
        }
        catch (error) {
            await logger.error('Failed to get scrape status:', {}, error);
            throw error;
        }
    }
    getProgress() {
        return { ...this.currentProgress };
    }
    async triggerScrape() {
        if (this.isRunning) {
            throw new Error('Scraping is already in progress');
        }
        this.isRunning = true;
        this.currentProgress = {
            isRunning: true,
            category: '',
            processed: 0,
            total: 0,
            progress: 0,
            eta: 0,
            errors: 0
        };
        try {
            await logger.info('Starting automatic scrape triggered by API');
            // Initialize scraper
            await this.scraper.initialize();
            // Set up progress tracking
            this.setupProgressTracking();
            // Start scraping
            const result = await this.scraper.scrapeAllCharacters();
            // Import to database if we have characters
            if (result.characters.length > 0) {
                await this.importToDatabase(result);
            }
            await logger.info(`Scraping completed: ${result.characters.length} characters processed`);
            this.emit('scrapeComplete', {
                success: true,
                charactersProcessed: result.characters.length,
                errors: result.stats.errors
            });
        }
        catch (error) {
            await logger.error('Scraping failed:', {}, error);
            this.emit('scrapeComplete', {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
            throw error;
        }
        finally {
            this.isRunning = false;
            this.currentProgress.isRunning = false;
        }
    }
    setupProgressTracking() {
        // Track scraping progress (simplified - would need actual scraper events)
        const updateProgress = (category, processed, total) => {
            this.currentProgress.category = category;
            this.currentProgress.processed = processed;
            this.currentProgress.total = total;
            this.currentProgress.progress = total > 0 ? (processed / total) * 100 : 0;
            // Simple ETA calculation
            const rate = processed / (Date.now() - this.startTime);
            this.currentProgress.eta = rate > 0 ? (total - processed) / rate / 1000 : 0;
            this.emit('progress', this.currentProgress);
        };
        // This is a simplified version - in practice you'd hook into actual scraper events
        const simulateProgress = () => {
            if (!this.isRunning)
                return;
            const categories = ['UR', 'LR', 'SSR', 'SR', 'R', 'N'];
            let categoryIndex = 0;
            let processed = 0;
            const total = 1200; // Estimated total
            const interval = setInterval(() => {
                if (!this.isRunning || processed >= total) {
                    clearInterval(interval);
                    return;
                }
                processed += Math.floor(Math.random() * 10) + 5;
                if (processed % 200 === 0)
                    categoryIndex++;
                updateProgress(categories[Math.min(categoryIndex, categories.length - 1)], Math.min(processed, total), total);
            }, 1000);
        };
        this.startTime = Date.now();
        simulateProgress();
    }
    startTime = Date.now();
    async importToDatabase(result) {
        const { JsonImporter } = await import('../database/json-importer.js');
        const importer = new JsonImporter();
        // Save result to temporary file
        const fs = await import('fs/promises');
        const path = await import('path');
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
        const tempFile = path.join('./data', `${timestamp}_auto_scrape.json`);
        await fs.writeFile(tempFile, JSON.stringify(result, null, 2));
        // Import to database
        await importer.importFromFile(tempFile);
        await logger.info(`Imported scraping results to database from ${tempFile}`);
    }
    isScrapingInProgress() {
        return this.isRunning;
    }
}
//# sourceMappingURL=scrape-service.js.map