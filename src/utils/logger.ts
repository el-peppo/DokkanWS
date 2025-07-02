import winston from 'winston';

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
);

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: logFormat
        }),
        new winston.transports.File({
            filename: 'logs/scraper.log',
            format: logFormat
        })
    ]
});

export class ScrapingLogger {
    private startTime: number = 0;
    private processed: number = 0;
    private total: number = 0;

    startScraping(totalCharacters: number): void {
        this.startTime = Date.now();
        this.total = totalCharacters;
        this.processed = 0;
        logger.info(`Starting scrape of ${totalCharacters} characters`);
    }

    logProgress(category: string, charactersProcessed: number): void {
        this.processed += charactersProcessed;
        const elapsed = (Date.now() - this.startTime) / 1000;
        const rate = this.processed / elapsed;
        const eta = this.total > 0 ? (this.total - this.processed) / rate : 0;
        
        logger.info(`Category ${category}: ${charactersProcessed} characters processed. ` +
                   `Total: ${this.processed}/${this.total} (${(this.processed/this.total*100).toFixed(1)}%) ` +
                   `Rate: ${rate.toFixed(1)}/s ETA: ${eta.toFixed(0)}s`);
    }

    logCompletion(): void {
        const totalTime = (Date.now() - this.startTime) / 1000;
        const avgRate = this.processed / totalTime;
        logger.info(`Scraping completed! ${this.processed} characters in ${totalTime.toFixed(2)}s (avg ${avgRate.toFixed(1)}/s)`);
    }

    logError(url: string, error: Error, retryAttempt: number): void {
        logger.error(`Failed to scrape ${url} (attempt ${retryAttempt}):`, error);
    }

    logRetry(url: string, attempt: number, maxAttempts: number): void {
        logger.warn(`Retrying ${url} (${attempt}/${maxAttempts})`);
    }
}