import dotenv from 'dotenv';
import { ScrapingConfig } from '../types/character.js';

dotenv.config();

export const DEFAULT_CONFIG: ScrapingConfig = {
    maxRetries: parseInt(process.env.MAX_RETRIES ?? '3'),
    retryDelay: parseInt(process.env.RETRY_DELAY ?? '1000'),
    batchSize: parseInt(process.env.BATCH_SIZE ?? '10'),
    concurrentLimit: parseInt(process.env.CONCURRENT_LIMIT ?? '5'),
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT ?? '15000'),
    userAgent: process.env.USER_AGENT ?? 'Mozilla/5.0 (compatible; DokkanScraper/2.0)'
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