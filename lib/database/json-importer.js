import { readFile } from 'fs/promises';
import { DatabaseConnection } from './connection.js';
import { logger } from '../utils/logger.js';
export class JsonImporter {
    db;
    constructor() {
        this.db = new DatabaseConnection();
    }
    async importFromFile(filePath) {
        try {
            await logger.info(`Starting import from file: ${filePath}`);
            await this.db.connect();
            const fileContent = await readFile(filePath, 'utf-8');
            const data = JSON.parse(fileContent);
            // Handle both full scraping result and characters-only arrays
            const characters = Array.isArray(data) ? data : data.characters;
            if (!characters || !Array.isArray(characters)) {
                throw new Error('Invalid JSON format: expected characters array');
            }
            await this.importCharacters(characters);
            await logger.info(`Successfully imported ${characters.length} characters`);
        }
        catch (error) {
            await logger.error('Import failed:', {}, error);
            throw error;
        }
        finally {
            await this.db.disconnect();
        }
    }
    async importCharacters(characters) {
        let imported = 0;
        let skipped = 0;
        let errors = 0;
        for (const character of characters) {
            try {
                await this.db.beginTransaction();
                // Check if character already exists
                const exists = await this.characterExists(character.id);
                if (exists) {
                    await logger.debug(`Character ${character.id} already exists, skipping`);
                    skipped++;
                    await this.db.rollback();
                    continue;
                }
                // Insert main character data
                await this.insertCharacter(character);
                // Insert related data
                await this.insertCharacterLinks(character.id, character.links);
                await this.insertCharacterCategories(character.id, character.categories);
                await this.insertCharacterKiMeter(character.id, character.kiMeter);
                // Insert transformations if they exist
                if (character.transformations) {
                    await this.insertTransformations(character.id, character.transformations);
                }
                await this.db.commit();
                imported++;
                if (imported % 100 === 0) {
                    await logger.info(`Imported ${imported} characters...`);
                }
            }
            catch (error) {
                await this.db.rollback();
                await logger.error(`Failed to import character ${character.id}:`, {}, error);
                errors++;
            }
        }
        await logger.info(`Import summary: ${imported} imported, ${skipped} skipped, ${errors} errors`);
    }
    async characterExists(characterId) {
        const result = await this.db.query('SELECT COUNT(*) as count FROM characters WHERE id = ?', [characterId]);
        return result[0].count > 0;
    }
    async insertCharacter(character) {
        const sql = `
            INSERT INTO characters (
                id, name, title, max_level, max_sa_level, rarity, class, type, cost,
                image_url, leader_skill, eza_leader_skill, seza_leader_skill, super_attack, eza_super_attack, seza_super_attack,
                ultra_super_attack, eza_ultra_super_attack, seza_ultra_super_attack, passive, eza_passive, seza_passive,
                active_skill, active_skill_condition, eza_active_skill, eza_active_skill_condition, seza_active_skill, seza_active_skill_condition,
                transformation_condition, ki_multiplier, base_hp, max_level_hp, free_dupe_hp,
                rainbow_hp, base_attack, max_level_attack, free_dupe_attack, rainbow_attack,
                base_defence, max_defence, free_dupe_defence, rainbow_defence
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            character.id,
            character.name,
            character.title,
            character.maxLevel,
            character.maxSALevel,
            character.rarity,
            character.class,
            character.type,
            character.cost,
            character.imageURL !== 'Error' ? character.imageURL : null,
            character.leaderSkill !== 'Error' ? character.leaderSkill : null,
            character.ezaLeaderSkill || null,
            character.sezaLeaderSkill || null,
            character.superAttack !== 'Error' ? character.superAttack : null,
            character.ezaSuperAttack || null,
            character.sezaSuperAttack || null,
            character.ultraSuperAttack || null,
            character.ezaUltraSuperAttack || null,
            character.sezaUltraSuperAttack || null,
            character.passive !== 'Error' ? character.passive : null,
            character.ezaPassive || null,
            character.sezaPassive || null,
            character.activeSkill || null,
            character.activeSkillCondition || null,
            character.ezaActiveSkill || null,
            character.ezaActiveSkillCondition || null,
            character.sezaActiveSkill || null,
            character.sezaActiveSkillCondition || null,
            character.transformationCondition || null,
            character.kiMultiplier !== 'Error' ? character.kiMultiplier : null,
            character.baseHP,
            character.maxLevelHP,
            character.freeDupeHP,
            character.rainbowHP,
            character.baseAttack,
            character.maxLevelAttack,
            character.freeDupeAttack,
            character.rainbowAttack,
            character.baseDefence,
            character.maxDefence,
            character.freeDupeDefence,
            character.rainbowDefence
        ];
        await this.db.query(sql, values);
    }
    async insertCharacterLinks(characterId, links) {
        if (!links || links.length === 0 || (links.length === 1 && links[0] === 'Error')) {
            return;
        }
        for (const link of links) {
            if (link !== 'Error') {
                await this.db.query('INSERT IGNORE INTO character_links (character_id, link_name) VALUES (?, ?)', [characterId, link]);
            }
        }
    }
    async insertCharacterCategories(characterId, categories) {
        if (!categories || categories.length === 0 || (categories.length === 1 && categories[0] === 'Error')) {
            return;
        }
        for (const category of categories) {
            if (category !== 'Error') {
                await this.db.query('INSERT IGNORE INTO character_categories (character_id, category_name) VALUES (?, ?)', [characterId, category]);
            }
        }
    }
    async insertCharacterKiMeter(characterId, kiMeter) {
        if (!kiMeter || kiMeter.length === 0 || (kiMeter.length === 1 && kiMeter[0] === 'Error')) {
            return;
        }
        for (let i = 0; i < kiMeter.length; i++) {
            if (kiMeter[i] !== 'Error') {
                await this.db.query('INSERT IGNORE INTO character_ki_meter (character_id, ki_value, position) VALUES (?, ?, ?)', [characterId, kiMeter[i], i]);
            }
        }
    }
    async insertTransformations(characterId, transformations) {
        for (let i = 0; i < transformations.length; i++) {
            const transformation = transformations[i];
            const sql = `
                INSERT INTO character_transformations (
                    character_id, transformation_order, transformed_name, transformed_id,
                    transformed_class, transformed_type, transformed_super_attack,
                    transformed_eza_super_attack, transformed_seza_super_attack, transformed_ultra_super_attack,
                    transformed_eza_ultra_super_attack, transformed_seza_ultra_super_attack, transformed_passive,
                    transformed_eza_passive, transformed_seza_passive, transformed_active_skill,
                    transformed_active_skill_condition, transformed_image_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                characterId,
                i + 1,
                transformation.transformedName,
                transformation.transformedID,
                transformation.transformedClass,
                transformation.transformedType,
                transformation.transformedSuperAttack !== 'Error' ? transformation.transformedSuperAttack : null,
                transformation.transformedEZASuperAttack || null,
                transformation.transformedSEZASuperAttack || null,
                transformation.transformedUltraSuperAttack || null,
                transformation.transformedEZAUltraSuperAttack || null,
                transformation.transformedSEZAUltraSuperAttack || null,
                transformation.transformedPassive !== 'Error' ? transformation.transformedPassive : null,
                transformation.transformedEZAPassive || null,
                transformation.transformedSEZAPassive || null,
                transformation.transformedActiveSkill || null,
                transformation.transformedActiveSkillCondition || null,
                transformation.transformedImageURL !== 'Error' ? transformation.transformedImageURL : null
            ];
            const result = await this.db.query(sql, values);
            const transformationId = result.insertId;
            // Insert transformation links
            if (transformation.transformedLinks && Array.isArray(transformation.transformedLinks)) {
                for (const link of transformation.transformedLinks) {
                    if (link !== 'Error') {
                        await this.db.query('INSERT IGNORE INTO transformation_links (transformation_id, link_name) VALUES (?, ?)', [transformationId, link]);
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=json-importer.js.map