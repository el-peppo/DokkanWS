import winston from 'winston';
import { createCorelogClient, CorelogClient } from './corelog-client.js';

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
);

const winstonLogger = winston.createLogger({
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

class HybridLogger {
    private winston: winston.Logger;
    private corelog: CorelogClient | null = null;
    private useCorelog: boolean;

    constructor() {
        this.winston = winstonLogger;
        this.useCorelog = process.env.CORELOG_ENABLED === 'true';
        
        if (this.useCorelog) {
            this.corelog = createCorelogClient('DokkanWS');
            if (process.env.NODE_ENV !== 'production') {
                console.log('Corelog enabled - connecting to:', process.env.CORELOG_REMOTE_HOST + ':' + process.env.CORELOG_REMOTE_PORT);
            }
        }
    }

    private async log(level: string, message: string, context?: Record<string, any>, error?: Error): Promise<void> {
        // If corelog is enabled, only log to corelog
        if (this.useCorelog && this.corelog) {
            try {
                switch (level) {
                    case 'debug':
                        await this.corelog.debug(message, context);
                        break;
                    case 'info':
                        await this.corelog.info(message, context);
                        break;
                    case 'warn':
                        await this.corelog.warn(message, context);
                        break;
                    case 'error':
                        await this.corelog.error(message, context, error);
                        break;
                    case 'critical':
                        await this.corelog.critical(message, context, error);
                        break;
                }
            } catch (err) {
                // Corelog failed, fallback to winston
                console.warn(`Corelog failed: ${err instanceof Error ? err.message : err}`);
                // Fallback to winston when corelog fails
                if (error) {
                    this.winston.log(level, message, { ...context, error: error.message, stack: error.stack });
                } else {
                    this.winston.log(level, message, context);
                }
            }
        } else {
            // If corelog is not enabled, use winston
            if (error) {
                this.winston.log(level, message, { ...context, error: error.message, stack: error.stack });
            } else {
                this.winston.log(level, message, context);
            }
        }
    }

    async info(message: string, context?: Record<string, any>): Promise<void> {
        await this.log('info', message, context);
    }

    async warn(message: string, context?: Record<string, any>): Promise<void> {
        await this.log('warn', message, context);
    }

    async error(message: string, context?: Record<string, any>, error?: Error): Promise<void> {
        await this.log('error', message, context, error);
    }

    async debug(message: string, context?: Record<string, any>): Promise<void> {
        await this.log('debug', message, context);
    }

    async critical(message: string, context?: Record<string, any>, error?: Error): Promise<void> {
        await this.log('critical', message, context, error);
    }

    shutdown(): void {
        if (this.corelog) {
            this.corelog.shutdown();
        }
    }
}

export const logger = new HybridLogger();

export class ScrapingLogger {
    private startTime: number = 0;
    private processed: number = 0;
    private total: number = 0;

    async startScraping(totalCharacters: number): Promise<void> {
        this.startTime = Date.now();
        this.total = totalCharacters;
        this.processed = 0;
        await logger.info(`Starting scrape of ${totalCharacters} characters`, {
            total_characters: totalCharacters,
            start_time: new Date().toISOString()
        });
    }

    async logProgress(category: string, charactersProcessed: number): Promise<void> {
        this.processed += charactersProcessed;
        const elapsed = (Date.now() - this.startTime) / 1000;
        const rate = this.processed / elapsed;
        const eta = this.total > 0 ? (this.total - this.processed) / rate : 0;
        const progressPercent = (this.processed / this.total * 100).toFixed(1);
        
        await logger.info(`Category ${category}: ${charactersProcessed} characters processed. ` +
                   `Total: ${this.processed}/${this.total} (${progressPercent}%) ` +
                   `Rate: ${rate.toFixed(1)}/s ETA: ${eta.toFixed(0)}s`, {
            category,
            characters_processed: charactersProcessed,
            total_processed: this.processed,
            total_characters: this.total,
            progress_percent: parseFloat(progressPercent),
            processing_rate: parseFloat(rate.toFixed(1)),
            eta_seconds: parseFloat(eta.toFixed(0)),
            elapsed_seconds: parseFloat(elapsed.toFixed(2))
        });
    }

    async logCompletion(): Promise<void> {
        const totalTime = (Date.now() - this.startTime) / 1000;
        const avgRate = this.processed / totalTime;
        await logger.info(`Scraping completed! ${this.processed} characters in ${totalTime.toFixed(2)}s (avg ${avgRate.toFixed(1)}/s)`, {
            total_characters: this.processed,
            total_time_seconds: parseFloat(totalTime.toFixed(2)),
            average_rate: parseFloat(avgRate.toFixed(1)),
            completion_time: new Date().toISOString()
        });
    }

    async logError(url: string, error: Error, retryAttempt: number): Promise<void> {
        await logger.error(`Failed to scrape ${url} (attempt ${retryAttempt})`, {
            url,
            retry_attempt: retryAttempt,
            error_type: error.name,
            error_message: error.message
        }, error);
    }

    async logRetry(url: string, attempt: number, maxAttempts: number): Promise<void> {
        await logger.warn(`Retrying ${url} (${attempt}/${maxAttempts})`, {
            url,
            current_attempt: attempt,
            max_attempts: maxAttempts
        });
    }
}