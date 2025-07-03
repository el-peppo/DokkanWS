// Default scraping configuration
export const config = {
    scraping: {
        maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
        retryDelay: parseInt(process.env.RETRY_DELAY || '1000'),
        batchSize: parseInt(process.env.BATCH_SIZE || '10'),
        concurrentLimit: parseInt(process.env.CONCURRENT_LIMIT || '5'),
        requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '15000'),
        userAgent: process.env.USER_AGENT || 'Mozilla/5.0 (compatible; DokkanScraper/2.0)'
    }
};
//# sourceMappingURL=config.js.map