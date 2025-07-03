import { ScrapeStatus, ScrapeProgress } from './types.js';
import { EventEmitter } from 'events';
export declare class ScrapeService extends EventEmitter {
    private db;
    private scraper;
    private isRunning;
    private currentProgress;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getStatus(): Promise<ScrapeStatus>;
    getProgress(): ScrapeProgress;
    triggerScrape(): Promise<void>;
    private setupProgressTracking;
    private startTime;
    private importToDatabase;
    isScrapingInProgress(): boolean;
}
//# sourceMappingURL=scrape-service.d.ts.map