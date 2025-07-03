import winston from 'winston';
export declare const logger: winston.Logger;
export declare class ScrapingLogger {
    private startTime;
    private processed;
    private total;
    startScraping(totalCharacters: number): void;
    logProgress(category: string, charactersProcessed: number): void;
    logCompletion(): void;
    logError(url: string, error: Error, retryAttempt: number): void;
    logRetry(url: string, attempt: number, maxAttempts: number): void;
}
//# sourceMappingURL=logger.d.ts.map