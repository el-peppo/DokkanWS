import { Router, Request, Response } from 'express';
import { ScrapeService } from '../scrape-service.js';
import { logger } from '../../utils/logger.js';

const router = Router();
const scrapeService = new ScrapeService();

// Initialize scrape service
scrapeService.connect().catch(error => {
    logger.error('Failed to connect to database in scrape routes:', {}, error);
});

/**
 * GET /api/scrape/status
 * Get current scraping status
 */
router.get('/status', async (_req: Request, res: Response) => {
    try {
        const status = await scrapeService.getStatus();
        
        res.json({
            success: true,
            data: status
        });

    } catch (error) {
        await logger.error('Error getting scrape status:', {}, error as Error);
        res.status(500).json({
            success: false,
            error: 'Failed to get scrape status'
        });
    }
});

/**
 * GET /api/scrape/progress
 * Get current scraping progress
 */
router.get('/progress', async (_req: Request, res: Response) => {
    try {
        const progress = scrapeService.getProgress();
        
        res.json({
            success: true,
            data: progress
        });

    } catch (error) {
        await logger.error('Error getting scrape progress:', {}, error as Error);
        res.status(500).json({
            success: false,
            error: 'Failed to get scrape progress'
        });
    }
});

/**
 * POST /api/scrape/trigger
 * Trigger a new scraping operation
 */
router.post('/trigger', async (_req: Request, res: Response): Promise<void> => {
    try {
        if (scrapeService.isScrapingInProgress()) {
            res.status(409).json({
                success: false,
                error: 'Scraping is already in progress'
            });
            return;
        }

        // Start scraping asynchronously
        scrapeService.triggerScrape().catch(error => {
            logger.error('Background scraping failed:', {}, error);
        });

        res.json({
            success: true,
            message: 'Scraping started successfully'
        });

    } catch (error) {
        await logger.error('Error triggering scrape:', {}, error as Error);
        res.status(500).json({
            success: false,
            error: 'Failed to trigger scraping'
        });
    }
});

export default router;