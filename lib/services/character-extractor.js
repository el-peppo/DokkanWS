import { Classes, Types, Rarities } from '../types/character.js';
import { DOMParserAdapter } from './dom-parser-adapter.js';
import { cleanPassiveText, extractCharacterName, extractCharacterTitle, safeParseInt } from '../utils/text-cleaner.js';
import { logger } from '../utils/logger.js';
export class CharacterExtractor {
    /**
     * Extract complete character data from character page using Playwright
     */
    static async extractCharacterData(source) {
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
            await logger.info('Extracting character data with enhanced game mechanics support');
            const character = {
                // Basic character information
                name: await this.extractName(source),
                title: await this.extractTitle(source),
                maxLevel: await this.extractMaxLevel(source),
                maxSALevel: await this.extractMaxSALevel(source),
                rarity: await this.extractRarity(source),
                class: await this.extractClass(source),
                type: await this.extractType(source),
                cost: await this.extractCost(source),
                id: await this.extractId(source),
                // Character images
                imageURL: await this.extractImageURL(source),
                fullImageURL: await this.extractFullImageURL(source),
                // Leader skills (including EZA and SEZA variations)
                leaderSkill: await this.extractLeaderSkill(source),
                ezaLeaderSkill: await this.extractEZALeaderSkill(source),
                sezaLeaderSkill: await this.extractSEZALeaderSkill(source),
                // Super attacks (all variations)
                superAttack: await this.extractSuperAttack(source),
                ezaSuperAttack: await this.extractEZASuperAttack(source),
                sezaSuperAttack: await this.extractSEZASuperAttack(source),
                ultraSuperAttack: await this.extractUltraSuperAttack(source),
                ezaUltraSuperAttack: await this.extractEZAUltraSuperAttack(source),
                sezaUltraSuperAttack: await this.extractSEZAUltraSuperAttack(source),
                // Passive skills (including EZA and SEZA)
                passive: await this.extractPassive(source),
                ezaPassive: await this.extractEZAPassive(source),
                sezaPassive: await this.extractSEZAPassive(source),
                // Active skills (including EZA and SEZA)
                activeSkill: await this.extractActiveSkill(source),
                activeSkillCondition: await this.extractActiveSkillCondition(source),
                ezaActiveSkill: await this.extractEZAActiveSkill(source),
                ezaActiveSkillCondition: await this.extractEZAActiveSkillCondition(source),
                sezaActiveSkill: await this.extractSEZAActiveSkill(source),
                sezaActiveSkillCondition: await this.extractSEZAActiveSkillCondition(source),
                // Advanced game mechanics
                standbySkill: await this.extractStandbySkill(source),
                standbySkillCondition: await this.extractStandbySkillCondition(source),
                transformationCondition: await this.extractTransformationCondition(source),
                // Links and categories
                links: await this.extractLinks(source),
                categories: await this.extractCategories(source),
                // Ki system
                kiMeter: await this.extractKiMeter(source),
                kiMultiplier: await this.extractKiMultiplier(source),
                ki12Multiplier: await this.extractKi12Multiplier(source),
                ki18Multiplier: await this.extractKi18Multiplier(source),
                ki24Multiplier: await this.extractKi24Multiplier(source),
                // Character statistics
                baseHP: await this.extractBaseStat(source, 'HP', 2),
                maxLevelHP: await this.extractBaseStat(source, 'HP', 3),
                freeDupeHP: await this.extractBaseStat(source, 'HP', 4),
                rainbowHP: await this.extractBaseStat(source, 'HP', 5),
                baseAttack: await this.extractBaseStat(source, 'Attack', 2),
                maxLevelAttack: await this.extractBaseStat(source, 'Attack', 3),
                freeDupeAttack: await this.extractBaseStat(source, 'Attack', 4),
                rainbowAttack: await this.extractBaseStat(source, 'Attack', 5),
                baseDefence: await this.extractBaseStat(source, 'Defence', 2),
                maxDefence: await this.extractBaseStat(source, 'Defence', 3),
                freeDupeDefence: await this.extractBaseStat(source, 'Defence', 4),
                rainbowDefence: await this.extractBaseStat(source, 'Defence', 5),
                // Transformation system
                transformations: await this.extractTransformations(source)
            };
            await logger.info(`Successfully extracted character: ${character.name} - ${character.title}`);
            return character;
        }
        catch (error) {
            await logger.error('Error extracting character data:', {}, error);
            await DOMParserAdapter.takeScreenshot(source, `extraction-error-${Date.now()}.png`);
            return null;
        }
    }
    /**
     * Extract character name with enhanced parsing
     */
    static async extractName(source) {
        try {
            const html = await DOMParserAdapter.extractHTML(source, '.mw-parser-output table > tbody > tr > td:nth-child(2)');
            const name = extractCharacterName(html);
            await logger.debug(`Extracted character name: ${name}`);
            return name;
        }
        catch (error) {
            await logger.warn('Failed to extract character name');
            return 'Error';
        }
    }
    /**
     * Extract character title with enhanced parsing
     */
    static async extractTitle(source) {
        try {
            const html = await DOMParserAdapter.extractHTML(source, '.mw-parser-output table > tbody > tr > td:nth-child(2)');
            const title = extractCharacterTitle(html);
            await logger.debug(`Extracted character title: ${title}`);
            return title;
        }
        catch (error) {
            await logger.warn('Failed to extract character title');
            return 'Error';
        }
    }
    /**
     * Extract max level with EZA support (120 -> 140)
     */
    static async extractMaxLevel(source) {
        try {
            const text = await DOMParserAdapter.extractText(source, '.mw-parser-output table > tbody > tr:nth-child(3) > td');
            const levelText = text.split('/')[1] || text.split('/')[0];
            const level = safeParseInt(levelText);
            // Validate level caps based on game mechanics
            if (level === 140) {
                await logger.debug('Detected EZA character (Level 140)');
            }
            else if (level === 150) {
                await logger.debug('Detected LR character (Level 150)');
            }
            else if (level === 120) {
                await logger.debug('Detected TUR character (Level 120)');
            }
            return level;
        }
        catch (error) {
            await logger.warn('Failed to extract max level');
            return 0;
        }
    }
    /**
     * Extract max SA level with enhanced EZA detection
     */
    static async extractMaxSALevel(source) {
        try {
            // Check for EZA SA levels (10 -> 15 for regular, 20 -> 25 for LR)
            const saElements = await DOMParserAdapter.querySelectorAll(source, 'table td:contains("SA"), table td:contains("Super Attack")');
            for (const element of saElements || []) {
                const text = await DOMParserAdapter.extractText(source, element);
                if (text.includes('15') || text.includes('25')) {
                    await logger.debug(`Detected EZA Super Attack level: ${text}`);
                    return text.includes('25') ? '25' : '15';
                }
            }
            // Fallback to standard detection
            const element = await DOMParserAdapter.querySelector(source, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(2) > center');
            const text = await DOMParserAdapter.extractText(source, element, '10');
            return text;
        }
        catch (error) {
            await logger.warn('Failed to extract max SA level');
            return '10';
        }
    }
    /**
     * Extract character rarity with enhanced detection
     */
    static async extractRarity(source) {
        try {
            // Look for rarity indicators in multiple locations
            const selectors = [
                '.mw-parser-output table > tbody > tr:nth-child(2) > td:nth-child(2)',
                'table td img[alt*="rarity"]',
                'table td:contains("LR")',
                'table td:contains("UR")',
                'table td:contains("SSR")'
            ];
            for (const selector of selectors) {
                const text = await DOMParserAdapter.extractText(source, selector);
                if (text.includes('LR'))
                    return Rarities.LR;
                if (text.includes('UR'))
                    return Rarities.UR;
                if (text.includes('SSR'))
                    return Rarities.SSR;
                if (text.includes('SR'))
                    return Rarities.SR;
                if (text.includes('R'))
                    return Rarities.R;
                if (text.includes('N'))
                    return Rarities.N;
            }
            return Rarities.SSR; // Default fallback
        }
        catch (error) {
            await logger.warn('Failed to extract rarity');
            return Rarities.N;
        }
    }
    /**
     * Extract character class (Super/Extreme)
     */
    static async extractClass(source) {
        try {
            const classElements = await DOMParserAdapter.querySelectorAll(source, 'table td img[alt*="Class"], table td:contains("Super"), table td:contains("Extreme")');
            for (const element of classElements || []) {
                const text = await DOMParserAdapter.extractText(source, element);
                if (text.toLowerCase().includes('extreme'))
                    return Classes.Extreme;
                if (text.toLowerCase().includes('super'))
                    return Classes.Super;
            }
            return Classes.Super; // Default fallback
        }
        catch (error) {
            await logger.warn('Failed to extract class');
            return Classes.Super;
        }
    }
    /**
     * Extract character type with enhanced detection
     */
    static async extractType(source) {
        try {
            const typeElements = await DOMParserAdapter.querySelectorAll(source, 'table td img[alt*="Type"], table td:contains("AGL"), table td:contains("STR")');
            for (const element of typeElements || []) {
                const text = await DOMParserAdapter.extractText(source, element);
                if (text.includes('AGL'))
                    return Types.AGL;
                if (text.includes('STR'))
                    return Types.STR;
                if (text.includes('PHY'))
                    return Types.PHY;
                if (text.includes('INT'))
                    return Types.INT;
                if (text.includes('TEQ'))
                    return Types.TEQ;
            }
            return Types.AGL; // Default fallback
        }
        catch (error) {
            await logger.warn('Failed to extract type');
            return Types.AGL;
        }
    }
    /**
     * Extract character cost (historical data)
     */
    static async extractCost(source) {
        try {
            const text = await DOMParserAdapter.extractText(source, 'table td:contains("Cost") + td');
            return safeParseInt(text);
        }
        catch (error) {
            await logger.warn('Failed to extract cost');
            return 0;
        }
    }
    /**
     * Extract character ID
     */
    static async extractId(source) {
        try {
            const text = await DOMParserAdapter.extractText(source, 'table td:contains("ID") + td');
            return text.trim() || 'Error';
        }
        catch (error) {
            await logger.warn('Failed to extract ID');
            return 'Error';
        }
    }
    /**
     * Extract character image URL (thumbnail)
     */
    static async extractImageURL(source) {
        try {
            const img = await DOMParserAdapter.querySelector(source, '.mw-parser-output table img');
            return await DOMParserAdapter.extractAttribute(source, img, 'src', 'Error');
        }
        catch (error) {
            await logger.warn('Failed to extract image URL');
            return 'Error';
        }
    }
    /**
     * Extract full-size character image URL
     */
    static async extractFullImageURL(source) {
        try {
            const img = await DOMParserAdapter.querySelector(source, '.mw-parser-output table img');
            const src = await DOMParserAdapter.extractAttribute(source, img, 'src', 'Error');
            // Convert thumbnail to full-size URL
            if (src && src !== 'Error') {
                return src.replace('/thumb/', '/').replace(/\/\d+px-.*$/, '');
            }
            return 'Error';
        }
        catch (error) {
            await logger.warn('Failed to extract full image URL');
            return 'Error';
        }
    }
    /**
     * Extract leader skill with enhanced parsing
     */
    static async extractLeaderSkill(source) {
        try {
            // Look for leader skill in multiple potential locations
            const selectors = [
                'table td:contains("Leader Skill") + td',
                'table tr:has(td:contains("Leader")) td:nth-child(2)',
                '.leader-skill'
            ];
            for (const selector of selectors) {
                const text = await DOMParserAdapter.extractTextWithKiSpheres(source, selector);
                if (text && text !== 'Error' && text.length > 5) {
                    await logger.debug(`Extracted leader skill: ${text.substring(0, 50)}...`);
                    return cleanPassiveText(text);
                }
            }
            return 'Error';
        }
        catch (error) {
            await logger.warn('Failed to extract leader skill');
            return 'Error';
        }
    }
    /**
     * Extract EZA leader skill
     */
    static async extractEZALeaderSkill(source) {
        try {
            // Look for EZA-specific leader skill sections
            const ezaSelectors = [
                'table td:contains("EZA Leader") + td',
                'table td:contains("Extreme Z-Awakened Leader") + td',
                '.eza-leader-skill'
            ];
            for (const selector of ezaSelectors) {
                const text = await DOMParserAdapter.extractTextWithKiSpheres(source, selector);
                if (text && text !== 'Error' && text.length > 5) {
                    await logger.debug('Found EZA leader skill');
                    return cleanPassiveText(text);
                }
            }
            return 'Error';
        }
        catch (error) {
            return 'Error';
        }
    }
    /**
     * Extract SEZA leader skill
     */
    static async extractSEZALeaderSkill(source) {
        try {
            // Look for SEZA-specific leader skill sections
            const sezaSelectors = [
                'table td:contains("SEZA Leader") + td',
                'table td:contains("Super EZA Leader") + td',
                '.seza-leader-skill'
            ];
            for (const selector of sezaSelectors) {
                const text = await DOMParserAdapter.extractTextWithKiSpheres(source, selector);
                if (text && text !== 'Error' && text.length > 5) {
                    await logger.debug('Found SEZA leader skill');
                    return cleanPassiveText(text);
                }
            }
            return 'Error';
        }
        catch (error) {
            return 'Error';
        }
    }
    // Continue with placeholder implementations for all other methods...
    static async extractSuperAttack(_source) { return 'Error'; }
    static async extractEZASuperAttack(_source) { return 'Error'; }
    static async extractSEZASuperAttack(_source) { return 'Error'; }
    static async extractUltraSuperAttack(_source) { return 'Error'; }
    static async extractEZAUltraSuperAttack(_source) { return 'Error'; }
    static async extractSEZAUltraSuperAttack(_source) { return 'Error'; }
    static async extractPassive(_source) { return 'Error'; }
    static async extractEZAPassive(_source) { return 'Error'; }
    static async extractSEZAPassive(_source) { return 'Error'; }
    static async extractActiveSkill(_source) { return 'Error'; }
    static async extractActiveSkillCondition(_source) { return 'Error'; }
    static async extractEZAActiveSkill(_source) { return 'Error'; }
    static async extractEZAActiveSkillCondition(_source) { return 'Error'; }
    static async extractSEZAActiveSkill(_source) { return 'Error'; }
    static async extractSEZAActiveSkillCondition(_source) { return 'Error'; }
    static async extractStandbySkill(_source) { return 'Error'; }
    static async extractStandbySkillCondition(_source) { return 'Error'; }
    static async extractTransformationCondition(_source) { return 'Error'; }
    static async extractLinks(_source) { return ['Error']; }
    static async extractCategories(_source) { return ['Error']; }
    static async extractKiMeter(_source) { return ['Error']; }
    static async extractBaseStat(_source, _statType, _column) { return 0; }
    static async extractKiMultiplier(_source) { return 'Error'; }
    static async extractKi12Multiplier(_source) { return 'Error'; }
    static async extractKi18Multiplier(_source) { return 'Error'; }
    static async extractKi24Multiplier(_source) { return 'Error'; }
    static async extractTransformations(_source) { return []; }
}
//# sourceMappingURL=character-extractor.js.map