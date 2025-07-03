import { Router, Request, Response } from 'express';
import { CharacterSearchQuery } from '../types.js';
import { logger } from '../../utils/logger.js';
import { getSharedDatabaseService } from '../shared-db.js';

const router = Router();

/**
 * GET /api/characters
 * Search and filter characters
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const query: CharacterSearchQuery = {
            search: req.query.search as string,
            rarity: req.query.rarity as string,
            type: req.query.type as string,
            class: req.query.class as string,
            category: req.query.category as string,
            link: req.query.link as string,
            page: req.query.page ? parseInt(req.query.page as string) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            sortBy: req.query.sortBy as 'name' | 'rarity' | 'maxLevel' | 'cost',
            sortOrder: req.query.sortOrder as 'asc' | 'desc'
        };

        const result = await getSharedDatabaseService().searchCharacters(query);
        
        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        await logger.error('Error searching characters:', {}, error as Error);
        res.status(500).json({
            success: false,
            error: 'Failed to search characters'
        });
    }
});

/**
 * GET /api/characters/:id
 * Get character by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const character = await getSharedDatabaseService().getCharacterById(id);

        if (!character) {
            res.status(404).json({
                success: false,
                error: 'Character not found'
            });
            return;
        }

        res.json({
            success: true,
            data: character
        });

    } catch (error) {
        await logger.error(`Error getting character ${req.params.id}:`, {}, error as Error);
        res.status(500).json({
            success: false,
            error: 'Failed to get character'
        });
    }
});

/**
 * GET /api/characters/stats/summary
 * Get database statistics
 */
router.get('/stats/summary', async (_req: Request, res: Response) => {
    try {
        const stats = await getSharedDatabaseService().getDatabaseStats();
        
        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        await logger.error('Error getting database stats:', {}, error as Error);
        res.status(500).json({
            success: false,
            error: 'Failed to get database statistics'
        });
    }
});

export default router;