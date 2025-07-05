import { Classes, Types, Rarities } from '../../types/character.js';
import { DOMParserAdapter } from '../dom-parser-adapter.js';
import { extractCharacterName, extractCharacterTitle, safeParseInt } from '../../utils/text-cleaner.js';
import { logger } from '../../utils/logger.js';
export class BasicInfoExtractor {
    /**
     * Extract character name with enhanced parsing
     */
    static async extractName(source) {
        try {
            // First check page title
            const title = await DOMParserAdapter.extractText(source, 'h1.page-header__title', '');
            if (title && title !== 'Error') {
                return extractCharacterName(title);
            }
            // Fallback to table-based extraction
            const nameFromTable = await DOMParserAdapter.extractText(source, '.mw-parser-output table tr:first-child th', '');
            if (nameFromTable && nameFromTable !== 'Error') {
                return extractCharacterName(nameFromTable);
            }
            await logger.warn('Character name not found');
            return 'Error';
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
            // Extract from page title or character table
            const title = await DOMParserAdapter.extractText(source, 'h1.page-header__title', '');
            if (title && title !== 'Error') {
                return extractCharacterTitle(title);
            }
            // Fallback extraction
            const titleFromTable = await DOMParserAdapter.extractText(source, '.mw-parser-output table tr:first-child th', '');
            if (titleFromTable && titleFromTable !== 'Error') {
                return extractCharacterTitle(titleFromTable);
            }
            return 'Error';
        }
        catch (error) {
            return 'Error';
        }
    }
    /**
     * Extract character ID from page URL or data
     */
    static async extractId(source) {
        try {
            // Try to extract from URL or page data
            const idText = await DOMParserAdapter.extractText(source, 'th:contains("ID") + td, .character-id', '');
            if (idText && idText !== 'Error' && idText.trim()) {
                return idText.trim();
            }
            // Generate fallback ID from current timestamp
            return `char_${Date.now()}`;
        }
        catch (error) {
            return `char_${Date.now()}`;
        }
    }
    /**
     * Extract character cost
     */
    static async extractCost(source) {
        try {
            const costText = await DOMParserAdapter.extractText(source, 'th:contains("Cost") + td', '0');
            return safeParseInt(costText, 0);
        }
        catch (error) {
            return 0;
        }
    }
    /**
     * Extract character rarity with enhanced detection
     */
    static async extractRarity(source) {
        try {
            // Check for rarity in character info table
            const rarityText = await DOMParserAdapter.extractText(source, 'th:contains("Rarity") + td', '');
            if (rarityText.includes('LR'))
                return Rarities.LR;
            if (rarityText.includes('UR'))
                return Rarities.UR;
            if (rarityText.includes('SSR'))
                return Rarities.SSR;
            if (rarityText.includes('SR'))
                return Rarities.SR;
            if (rarityText.includes('R'))
                return Rarities.R;
            if (rarityText.includes('N'))
                return Rarities.N;
            // Fallback: check page title or URL for rarity indicators
            const pageTitle = await DOMParserAdapter.extractText(source, 'h1.page-header__title', '');
            if (pageTitle.includes('LR'))
                return Rarities.LR;
            if (pageTitle.includes('UR'))
                return Rarities.UR;
            if (pageTitle.includes('SSR'))
                return Rarities.SSR;
            await logger.warn('Could not determine character rarity, defaulting to SSR');
            return Rarities.SSR;
        }
        catch (error) {
            return Rarities.SSR;
        }
    }
    /**
     * Extract character class (Super/Extreme) with enhanced detection
     */
    static async extractClass(source) {
        try {
            const classText = await DOMParserAdapter.extractText(source, 'th:contains("Class") + td, th:contains("Alignment") + td', '');
            if (classText.toLowerCase().includes('super'))
                return Classes.Super;
            if (classText.toLowerCase().includes('extreme'))
                return Classes.Extreme;
            // Fallback: check for class indicators in page content
            const pageContent = await DOMParserAdapter.extractText(source, '.mw-parser-output', '');
            if (pageContent.toLowerCase().includes('super class'))
                return Classes.Super;
            if (pageContent.toLowerCase().includes('extreme class'))
                return Classes.Extreme;
            await logger.warn('Could not determine character class, defaulting to Super');
            return Classes.Super;
        }
        catch (error) {
            return Classes.Super;
        }
    }
    /**
     * Extract character type (PHY/STR/AGL/TEQ/INT) with enhanced detection
     */
    static async extractType(source) {
        try {
            const typeText = await DOMParserAdapter.extractText(source, 'th:contains("Type") + td', '');
            if (typeText.includes('PHY'))
                return Types.PHY;
            if (typeText.includes('STR'))
                return Types.STR;
            if (typeText.includes('AGL'))
                return Types.AGL;
            if (typeText.includes('TEQ'))
                return Types.TEQ;
            if (typeText.includes('INT'))
                return Types.INT;
            // Fallback: check for type-specific styling or icons
            const hasTypeIcon = await DOMParserAdapter.querySelector(source, 'img[src*="Type_"], .type-phy, .type-str, .type-agl, .type-teq, .type-int');
            if (hasTypeIcon) {
                const iconSrc = await DOMParserAdapter.extractAttribute(source, hasTypeIcon, 'src', '');
                if (iconSrc.includes('PHY'))
                    return Types.PHY;
                if (iconSrc.includes('STR'))
                    return Types.STR;
                if (iconSrc.includes('AGL'))
                    return Types.AGL;
                if (iconSrc.includes('TEQ'))
                    return Types.TEQ;
                if (iconSrc.includes('INT'))
                    return Types.INT;
            }
            await logger.warn('Could not determine character type, defaulting to PHY');
            return Types.PHY;
        }
        catch (error) {
            return Types.PHY;
        }
    }
}
//# sourceMappingURL=basic-info-extractor.js.map