import { Character, Transformation } from '../types/character.js';
import { DOMParserAdapter, DOMSource } from './dom-parser-adapter.js';
import { logger } from '../utils/logger.js';

// Import specialized extractors
import { BasicInfoExtractor } from './extractors/basic-info-extractor.js';
import { SkillsExtractor } from './extractors/skills-extractor.js';
import { StatsExtractor } from './extractors/stats-extractor.js';
import { ImageExtractor } from './extractors/image-extractor.js';

export class CharacterExtractor {
    /**
     * Extract complete character data from character page using Playwright
     */
    static async extractCharacterData(source: DOMSource): Promise<Character | null> {
        try {
            // Wait for main content to load
            await DOMParserAdapter.waitForElement(source, '.mw-parser-output table', 10000);
            
            // Check for main character table
            const mainTable = await DOMParserAdapter.querySelector(source, '.mw-parser-output table');
            if (!mainTable) {
                await logger.warn('Main character table not found');
                await DOMParserAdapter.takeScreenshot(source, `missing-main-table-${Date.now()}.png`);
                return null;
            }

            await logger.info('Extracting character data with comprehensive game mechanics support');

            const character: Character = {
                // Basic character information
                name: await BasicInfoExtractor.extractName(source),
                title: await BasicInfoExtractor.extractTitle(source),
                maxLevel: await StatsExtractor.extractMaxLevel(source),
                maxSALevel: await StatsExtractor.extractMaxSALevel(source),
                rarity: await BasicInfoExtractor.extractRarity(source),
                class: await BasicInfoExtractor.extractClass(source),
                type: await BasicInfoExtractor.extractType(source),
                cost: await BasicInfoExtractor.extractCost(source),
                id: await BasicInfoExtractor.extractId(source),
                
                // Character images and quotes
                imageURL: await ImageExtractor.extractImageURL(source),
                fullImageURL: await ImageExtractor.extractFullImageURL(source),
                
                // Leader skills (including EZA and SEZA variations)
                leaderSkill: await SkillsExtractor.extractLeaderSkill(source),
                ezaLeaderSkill: await SkillsExtractor.extractEZALeaderSkill(source),
                sezaLeaderSkill: await SkillsExtractor.extractSEZALeaderSkill(source),
                
                // Super attacks (all variations)
                superAttack: await SkillsExtractor.extractSuperAttack(source),
                ezaSuperAttack: await SkillsExtractor.extractEZASuperAttack(source),
                sezaSuperAttack: await SkillsExtractor.extractSEZASuperAttack(source),
                ultraSuperAttack: await SkillsExtractor.extractUltraSuperAttack(source),
                ezaUltraSuperAttack: await SkillsExtractor.extractEZAUltraSuperAttack(source),
                sezaUltraSuperAttack: await SkillsExtractor.extractSEZAUltraSuperAttack(source),
                
                // Passive skills (including EZA and SEZA)
                passive: await SkillsExtractor.extractPassive(source),
                ezaPassive: await SkillsExtractor.extractEZAPassive(source),
                sezaPassive: await SkillsExtractor.extractSEZAPassive(source),
                
                // Active skills (including EZA and SEZA)
                activeSkill: await SkillsExtractor.extractActiveSkill(source),
                activeSkillCondition: await SkillsExtractor.extractActiveSkillCondition(source),
                ezaActiveSkill: await SkillsExtractor.extractEZAActiveSkill(source),
                ezaActiveSkillCondition: await SkillsExtractor.extractEZAActiveSkillCondition(source),
                sezaActiveSkill: await SkillsExtractor.extractSEZAActiveSkill(source),
                sezaActiveSkillCondition: await SkillsExtractor.extractSEZAActiveSkillCondition(source),
                
                // Advanced game mechanics
                standbySkill: await SkillsExtractor.extractStandbySkill(source),
                standbySkillCondition: await SkillsExtractor.extractStandbySkillCondition(source),
                transformationCondition: await SkillsExtractor.extractTransformationCondition(source),
                
                // Links and categories
                links: await StatsExtractor.extractLinks(source),
                categories: await StatsExtractor.extractCategories(source),
                
                // Ki system with full LR support
                kiMeter: await StatsExtractor.extractKiMeter(source),
                kiMultiplier: await StatsExtractor.extractKiMultiplier(source),
                ki12Multiplier: await StatsExtractor.extractKi12Multiplier(source),
                ki18Multiplier: await StatsExtractor.extractKi18Multiplier(source),
                ki24Multiplier: await StatsExtractor.extractKi24Multiplier(source),
                
                // Character statistics (all variations)
                baseHP: await StatsExtractor.extractBaseStat(source, 'HP', 2),
                maxLevelHP: await StatsExtractor.extractBaseStat(source, 'HP', 3),
                freeDupeHP: await StatsExtractor.extractBaseStat(source, 'HP', 4),
                rainbowHP: await StatsExtractor.extractBaseStat(source, 'HP', 5),
                baseAttack: await StatsExtractor.extractBaseStat(source, 'Attack', 2),
                maxLevelAttack: await StatsExtractor.extractBaseStat(source, 'Attack', 3),
                freeDupeAttack: await StatsExtractor.extractBaseStat(source, 'Attack', 4),
                rainbowAttack: await StatsExtractor.extractBaseStat(source, 'Attack', 5),
                baseDefence: await StatsExtractor.extractBaseStat(source, 'Defence', 2),
                maxDefence: await StatsExtractor.extractBaseStat(source, 'Defence', 3),
                freeDupeDefence: await StatsExtractor.extractBaseStat(source, 'Defence', 4),
                rainbowDefence: await StatsExtractor.extractBaseStat(source, 'Defence', 5),
                
                // Transformation system
                transformations: await this.extractTransformations(source)
            };

            // Verify image URLs
            const imageValid = await ImageExtractor.verifyImageURL(character.imageURL);
            const fullImageValid = await ImageExtractor.verifyImageURL(character.fullImageURL);
            
            if (!imageValid) {
                await logger.warn(`Invalid image URL for character ${character.name}`);
            }
            if (!fullImageValid) {
                await logger.warn(`Invalid full image URL for character ${character.name}`);
            }

            // Log character extraction summary
            await logger.info(`Successfully extracted character: ${character.name} (${character.rarity} ${character.type} ${character.class})`);
            
            return character;
        } catch (error) {
            await logger.error('Error extracting character data:', {}, error as Error);
            return null;
        }
    }

    /**
     * Extract character quote (if available)
     */
    static async extractQuote(source: DOMSource): Promise<string> {
        return await ImageExtractor.extractQuote(source);
    }

    /**
     * Extract transformation data (placeholder for now)
     */
    private static async extractTransformations(source: DOMSource): Promise<Transformation[]> {
        try {
            // Look for transformation sections
            const transformSections = await DOMParserAdapter.querySelectorAll(source, 
                'h3:contains("Transformation"), h3:contains("Transform"), .transformation-section');

            if (!transformSections || transformSections.length === 0) {
                return [];
            }

            // This would need complex implementation to handle all transformation types
            // For now, return empty array - this is a major feature that needs dedicated implementation
            await logger.debug(`Found ${transformSections.length} potential transformation sections`);
            return [];
        } catch (error) {
            await logger.debug('Failed to extract transformations');
            return [];
        }
    }

    /**
     * Check if character has EZA
     */
    static async hasEZA(source: DOMSource): Promise<boolean> {
        try {
            const ezaSection = await DOMParserAdapter.querySelector(source, 'h3:contains("Extreme Z-Awakened")');
            return ezaSection !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if character has SEZA
     */
    static async hasSEZA(source: DOMSource): Promise<boolean> {
        try {
            const sezaSection = await DOMParserAdapter.querySelector(source, 'h3:contains("Super Extreme Z-Awakened")');
            return sezaSection !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if character is LR (Legendary Rare)
     */
    static async isLR(source: DOMSource): Promise<boolean> {
        try {
            const rarity = await BasicInfoExtractor.extractRarity(source);
            return rarity === 'LR';
        } catch (error) {
            return false;
        }
    }
}