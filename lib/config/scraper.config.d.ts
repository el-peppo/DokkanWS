import { ScrapingConfig } from '../types/character.js';
export declare const PERFORMANCE_PROFILES: {
    readonly CONSERVATIVE: {
        readonly maxRetries: 2;
        readonly retryDelay: 2000;
        readonly batchSize: 3;
        readonly concurrentLimit: 2;
        readonly requestTimeout: 20000;
        readonly userAgent: "Mozilla/5.0 (compatible; DokkanScraper/2.0; Pi-Friendly)";
    };
    readonly BALANCED: {
        readonly maxRetries: 3;
        readonly retryDelay: 1000;
        readonly batchSize: 10;
        readonly concurrentLimit: 5;
        readonly requestTimeout: 15000;
        readonly userAgent: "Mozilla/5.0 (compatible; DokkanScraper/2.0)";
    };
    readonly AGGRESSIVE: {
        readonly maxRetries: 4;
        readonly retryDelay: 500;
        readonly batchSize: 20;
        readonly concurrentLimit: 10;
        readonly requestTimeout: 10000;
        readonly userAgent: "Mozilla/5.0 (compatible; DokkanScraper/2.0; Fast)";
    };
};
export declare const DEFAULT_CONFIG: ScrapingConfig;
export declare const DOKKAN_BASE_URL = "https://dbz-dokkanbattle.fandom.com";
export declare const BASE_CATEGORY_URLS: readonly ["N", "R", "SR", "SSR", "UR", "LR"];
export type CategoryUrl = typeof BASE_CATEGORY_URLS[number];
//# sourceMappingURL=scraper.config.d.ts.map