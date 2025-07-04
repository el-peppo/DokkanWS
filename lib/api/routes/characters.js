import { Router } from 'express';
import { logger } from '../../utils/logger.js';
import { getSharedDatabaseService } from '../shared-db.js';
const router = Router();
/**
 * GET /api/characters
 * Search and filter characters
 */
router.get('/', async (req, res) => {
    try {
        const query = {
            search: req.query.search,
            rarity: req.query.rarity,
            type: req.query.type,
            class: req.query.class,
            category: req.query.category,
            link: req.query.link,
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };
        const dbService = getSharedDatabaseService();
        const result = await dbService.searchCharacters(query);
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        await logger.error('Error searching characters:', {}, error);
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
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dbService = getSharedDatabaseService();
        const character = await dbService.getCharacterById(id);
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
    }
    catch (error) {
        await logger.error(`Error getting character ${req.params.id}:`, {}, error);
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
router.get('/stats/summary', async (_req, res) => {
    try {
        const dbService = getSharedDatabaseService();
        const stats = await dbService.getDatabaseStats();
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        await logger.error('Error getting database stats:', {}, error);
        res.status(500).json({
            success: false,
            error: 'Failed to get database statistics'
        });
    }
});
export default router;
//# sourceMappingURL=characters.js.map