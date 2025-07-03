import { Router } from 'express';
import { DatabaseService } from '../database-service.js';
import { logger } from '../../utils/logger.js';
const router = Router();
const dbService = new DatabaseService();
// Initialize database connection
dbService.connect().catch(error => {
    logger.error('Failed to connect to database in characters routes:', {}, error);
});
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