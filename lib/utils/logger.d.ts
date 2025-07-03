declare class HybridLogger {
    private winston;
    private corelog;
    private useCorelog;
    constructor();
    private log;
    info(message: string, context?: Record<string, any>): Promise<void>;
    warn(message: string, context?: Record<string, any>): Promise<void>;
    error(message: string, context?: Record<string, any>, error?: Error): Promise<void>;
    debug(message: string, context?: Record<string, any>): Promise<void>;
    critical(message: string, context?: Record<string, any>, error?: Error): Promise<void>;
    shutdown(): void;
}
export declare const logger: HybridLogger;
export declare class ScrapingLogger {
    private startTime;
    private processed;
    private total;
    startScraping(totalCharacters: number): Promise<void>;
    logProgress(category: string, charactersProcessed: number): Promise<void>;
    logCompletion(): Promise<void>;
    logError(url: string, error: Error, retryAttempt: number): Promise<void>;
    logRetry(url: string, attempt: number, maxAttempts: number): Promise<void>;
}
export {};
//# sourceMappingURL=logger.d.ts.map