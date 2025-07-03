import { DatabaseConnection } from '../database/connection.js';
import { CharacterSearchQuery, CharacterSearchResult, DatabaseStats } from './types.js';
import { logger } from '../utils/logger.js';

export class DatabaseService {
    private db: DatabaseConnection;

    constructor() {
        this.db = new DatabaseConnection();
    }

    async connect(): Promise<void> {
        await this.db.connect();
    }

    async disconnect(): Promise<void> {
        await this.db.disconnect();
    }

    async searchCharacters(query: CharacterSearchQuery): Promise<CharacterSearchResult> {
        try {
            const page = query.page || 1;
            const limit = Math.min(query.limit || 20, 100); // Max 100 per page
            const offset = (page - 1) * limit;

            // Build WHERE clause
            const conditions: string[] = [];
            const params: any[] = [];

            if (query.search) {
                conditions.push('(c.name LIKE ? OR c.title LIKE ?)');
                params.push(`%${query.search}%`, `%${query.search}%`);
            }

            if (query.rarity) {
                conditions.push('c.rarity = ?');
                params.push(query.rarity);
            }

            if (query.type) {
                conditions.push('c.type = ?');
                params.push(query.type);
            }

            if (query.class) {
                conditions.push('c.class = ?');
                params.push(query.class);
            }

            if (query.category) {
                conditions.push('EXISTS (SELECT 1 FROM character_categories cc WHERE cc.character_id = c.id AND cc.category_name = ?)');
                params.push(query.category);
            }

            if (query.link) {
                conditions.push('EXISTS (SELECT 1 FROM character_links cl WHERE cl.character_id = c.id AND cl.link_name = ?)');
                params.push(query.link);
            }

            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

            // Build ORDER BY clause
            const sortBy = query.sortBy || 'name';
            const sortOrder = query.sortOrder || 'asc';
            const orderClause = `ORDER BY c.${sortBy} ${sortOrder.toUpperCase()}`;

            // Get total count
            const countQuery = `
                SELECT COUNT(*) as total 
                FROM characters c 
                ${whereClause}
            `;
            const countResult = await this.db.query(countQuery, params);
            const total = countResult[0].total;

            // Get characters with pagination
            const charactersQuery = `
                SELECT 
                    c.id, c.name, c.title, c.max_level, c.max_sa_level, c.rarity, 
                    c.class, c.type, c.cost, c.image_url, c.full_image_url, c.leader_skill, 
                    c.super_attack, c.passive, c.active_skill, c.transformation_condition,
                    c.base_hp, c.max_level_hp, c.rainbow_hp,
                    c.base_attack, c.max_level_attack, c.rainbow_attack,
                    c.base_defence, c.max_defence, c.rainbow_defence
                FROM characters c 
                ${whereClause}
                ${orderClause}
                LIMIT ? OFFSET ?
            `;

            const characters = await this.db.query(charactersQuery, [...params, limit, offset]);

            // Enhance characters with links, categories, and transformations
            for (const character of characters) {
                character.links = await this.getCharacterLinks(character.id);
                character.categories = await this.getCharacterCategories(character.id);
                character.kiMeter = await this.getCharacterKiMeter(character.id);
                character.transformations = await this.getCharacterTransformations(character.id);
            }

            // Get available filters
            const filters = await this.getAvailableFilters();

            const totalPages = Math.ceil(total / limit);

            return {
                characters,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                },
                filters
            };

        } catch (error) {
            await logger.error('Failed to search characters:', {}, error as Error);
            throw error;
        }
    }

    async getCharacterById(id: string): Promise<any | null> {
        try {
            const characters = await this.db.query(
                'SELECT * FROM characters WHERE id = ?',
                [id]
            );

            if (characters.length === 0) {
                return null;
            }

            const character = characters[0];
            character.links = await this.getCharacterLinks(id);
            character.categories = await this.getCharacterCategories(id);
            character.kiMeter = await this.getCharacterKiMeter(id);
            character.transformations = await this.getCharacterTransformations(id);

            return character;
        } catch (error) {
            await logger.error(`Failed to get character ${id}:`, {}, error as Error);
            throw error;
        }
    }

    private async getCharacterLinks(characterId: string): Promise<string[]> {
        const result = await this.db.query(
            'SELECT link_name FROM character_links WHERE character_id = ? ORDER BY link_name',
            [characterId]
        );
        return result.map((row: any) => row.link_name);
    }

    private async getCharacterCategories(characterId: string): Promise<string[]> {
        const result = await this.db.query(
            'SELECT category_name FROM character_categories WHERE character_id = ? ORDER BY category_name',
            [characterId]
        );
        return result.map((row: any) => row.category_name);
    }

    private async getCharacterKiMeter(characterId: string): Promise<string[]> {
        const result = await this.db.query(
            'SELECT ki_value FROM character_ki_meter WHERE character_id = ? ORDER BY position',
            [characterId]
        );
        return result.map((row: any) => row.ki_value);
    }

    private async getCharacterTransformations(characterId: string): Promise<any[]> {
        const transformations = await this.db.query(
            `SELECT * FROM character_transformations 
             WHERE character_id = ? 
             ORDER BY transformation_order`,
            [characterId]
        );

        // Get links for each transformation
        for (const transformation of transformations) {
            const links = await this.db.query(
                'SELECT link_name FROM transformation_links WHERE transformation_id = ?',
                [transformation.id]
            );
            transformation.transformedLinks = links.map((row: any) => row.link_name);
        }

        return transformations;
    }

    private async getAvailableFilters(): Promise<any> {
        const [rarities, types, classes, categories, links] = await Promise.all([
            this.db.query('SELECT DISTINCT rarity FROM characters WHERE rarity IS NOT NULL ORDER BY rarity'),
            this.db.query('SELECT DISTINCT type FROM characters WHERE type IS NOT NULL ORDER BY type'),
            this.db.query('SELECT DISTINCT class FROM characters WHERE class IS NOT NULL ORDER BY class'),
            this.db.query('SELECT DISTINCT category_name FROM character_categories ORDER BY category_name'),
            this.db.query('SELECT DISTINCT link_name FROM character_links ORDER BY link_name')
        ]);

        return {
            rarities: rarities.map((row: any) => row.rarity),
            types: types.map((row: any) => row.type),
            classes: classes.map((row: any) => row.class),
            categories: categories.map((row: any) => row.category_name),
            links: links.map((row: any) => row.link_name)
        };
    }

    async getDatabaseStats(): Promise<DatabaseStats> {
        try {
            const [
                totalResult,
                rarityResult,
                typeResult,
                classResult,
                categoryResult,
                linkResult,
                transformationResult
            ] = await Promise.all([
                this.db.query('SELECT COUNT(*) as count FROM characters'),
                this.db.query('SELECT rarity, COUNT(*) as count FROM characters GROUP BY rarity'),
                this.db.query('SELECT type, COUNT(*) as count FROM characters GROUP BY type'),
                this.db.query('SELECT class, COUNT(*) as count FROM characters GROUP BY class'),
                this.db.query('SELECT COUNT(DISTINCT category_name) as count FROM character_categories'),
                this.db.query('SELECT COUNT(DISTINCT link_name) as count FROM character_links'),
                this.db.query('SELECT COUNT(*) as count FROM character_transformations')
            ]);

            const charactersByRarity: Record<string, number> = {};
            rarityResult.forEach((row: any) => {
                charactersByRarity[row.rarity] = row.count;
            });

            const charactersByType: Record<string, number> = {};
            typeResult.forEach((row: any) => {
                charactersByType[row.type] = row.count;
            });

            const charactersByClass: Record<string, number> = {};
            classResult.forEach((row: any) => {
                charactersByClass[row.class] = row.count;
            });

            return {
                totalCharacters: totalResult[0].count,
                charactersByRarity,
                charactersByType,
                charactersByClass,
                lastUpdate: null, // Will be implemented with metadata table
                totalCategories: categoryResult[0].count,
                totalLinks: linkResult[0].count,
                totalTransformations: transformationResult[0].count
            };

        } catch (error) {
            await logger.error('Failed to get database stats:', {}, error as Error);
            throw error;
        }
    }
}