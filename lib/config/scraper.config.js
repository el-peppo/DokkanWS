import dotenv from 'dotenv';
dotenv.config();
export const DEFAULT_CONFIG = {
    maxRetries: parseInt(process.env.MAX_RETRIES ?? '3'),
    retryDelay: parseInt(process.env.RETRY_DELAY ?? '1000'),
    batchSize: parseInt(process.env.BATCH_SIZE ?? '10'),
    concurrentLimit: parseInt(process.env.CONCURRENT_LIMIT ?? '5'),
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT ?? '15000'),
    userAgent: process.env.USER_AGENT ?? 'Mozilla/5.0 (compatible; DokkanScraper/2.0)'
};
export const DOKKAN_BASE_URL = 'https://dbz-dokkanbattle.fandom.com';
export const CATEGORY_URLS = [
    'N',
    'R',
    'SR',
    'SSR',
    'UR',
    'UR?from=Evil+Pride+Frieza+(Final+Form)+(Angel)',
    'UR?from=Next-Level+Strike+Super+Saiyan+God+SS+Goku',
    'UR?from=Training+and+Refreshment+Goku',
    'LR'
];
//# sourceMappingURL=scraper.config.js.map