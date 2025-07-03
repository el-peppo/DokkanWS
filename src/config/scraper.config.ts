import dotenv from 'dotenv';
import { ScrapingConfig } from '../types/character.js';

dotenv.config();

// Performance profiles for different environments
export const PERFORMANCE_PROFILES = {
    CONSERVATIVE: {
        maxRetries: 2,
        retryDelay: 2000,
        batchSize: 3,
        concurrentLimit: 2,
        requestTimeout: 20000,
        userAgent: 'Mozilla/5.0 (compatible; DokkanScraper/2.0; Pi-Friendly)'
    },
    BALANCED: {
        maxRetries: 3,
        retryDelay: 1000,
        batchSize: 10,
        concurrentLimit: 5,
        requestTimeout: 15000,
        userAgent: 'Mozilla/5.0 (compatible; DokkanScraper/2.0)'
    },
    AGGRESSIVE: {
        maxRetries: 4,
        retryDelay: 500,
        batchSize: 20,
        concurrentLimit: 10,
        requestTimeout: 10000,
        userAgent: 'Mozilla/5.0 (compatible; DokkanScraper/2.0; Fast)'
    }
} as const;

// Auto-detect performance profile or use environment override
function getPerformanceProfile(): ScrapingConfig {
    const profile = process.env.PERFORMANCE_PROFILE as keyof typeof PERFORMANCE_PROFILES;
    
    if (profile && PERFORMANCE_PROFILES[profile]) {
        return PERFORMANCE_PROFILES[profile];
    }
    
    // Auto-detect based on system
    const platform = process.platform;
    const arch = process.arch;
    
    // Use conservative settings for Raspberry Pi or ARM devices
    if (arch === 'arm' || arch === 'arm64' || platform === 'linux') {
        return PERFORMANCE_PROFILES.CONSERVATIVE;
    }
    
    return PERFORMANCE_PROFILES.BALANCED;
}

export const DEFAULT_CONFIG: ScrapingConfig = {
    maxRetries: parseInt(process.env.MAX_RETRIES ?? getPerformanceProfile().maxRetries.toString()),
    retryDelay: parseInt(process.env.RETRY_DELAY ?? getPerformanceProfile().retryDelay.toString()),
    batchSize: parseInt(process.env.BATCH_SIZE ?? getPerformanceProfile().batchSize.toString()),
    concurrentLimit: parseInt(process.env.CONCURRENT_LIMIT ?? getPerformanceProfile().concurrentLimit.toString()),
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT ?? getPerformanceProfile().requestTimeout.toString()),
    userAgent: process.env.USER_AGENT ?? getPerformanceProfile().userAgent
};

export const DOKKAN_BASE_URL = 'https://dbz-dokkanbattle.fandom.com';

export const BASE_CATEGORY_URLS = [
    'N',
    'R',
    'SR',
    'SSR',
    'UR',
    'LR'
] as const;

export type CategoryUrl = typeof BASE_CATEGORY_URLS[number];