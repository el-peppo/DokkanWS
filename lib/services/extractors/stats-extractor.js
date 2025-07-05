import { DOMParserAdapter } from '../dom-parser-adapter.js';
import { safeParseInt } from '../../utils/text-cleaner.js';
import { logger } from '../../utils/logger.js';
export class StatsExtractor {
    /**
     * Extract character level information with EZA detection
     */
    static async extractMaxLevel(source) {
        try {
            // Look for max level in character stats table
            const levelText = await DOMParserAdapter.extractText(source, 'th:contains("Max Lv") + td, th:contains("Max Level") + td, th:contains("Level") + td', '120');
            const level = safeParseInt(levelText, 120);
            // EZA characters have level 140, SEZA have 150
            if (level >= 140) {
                await logger.info(`EZA/SEZA character detected with max level ${level}`);
            }
            return level;
        }
        catch (error) {
            await logger.warn('Failed to extract max level, defaulting to 120');
            return 120;
        }
    }
    /**
     * Extract Super Attack level with EZA detection
     */
    static async extractMaxSALevel(source) {
        try {
            // Check for SA level information
            const saLevelText = await DOMParserAdapter.extractText(source, 'th:contains("SA Lv") + td, th:contains("Super Attack Level") + td', '10');
            const saLevel = safeParseInt(saLevelText, 10);
            // Determine if this is EZA or LR based on SA level
            if (saLevel >= 20) {
                return saLevel >= 25 ? '25' : '20'; // LR EZA vs regular LR
            }
            else if (saLevel >= 15) {
                return '15'; // Regular EZA
            }
            else {
                return '10'; // Standard
            }
        }
        catch (error) {
            return '10';
        }
    }
    /**
     * Extract character statistics from stats table
     */
    static async extractBaseStat(source, statType, column) {
        try {
            // Look for stats table with HP, ATK, DEF columns
            const statValue = await DOMParserAdapter.extractText(source, `table tr:contains("${statType}") td:nth-child(${column}), table th:contains("${statType}") + td:nth-child(${column - 1})`, '0');
            // Clean the stat value (remove commas, etc.)
            const cleanedValue = statValue.replace(/[,\s]/g, '');
            return safeParseInt(cleanedValue, 0);
        }
        catch (error) {
            await logger.debug(`Failed to extract ${statType} stat from column ${column}`);
            return 0;
        }
    }
    /**
     * Extract Ki multiplier information for LR characters
     */
    static async extractKiMultiplier(source) {
        try {
            // Standard 12 Ki multiplier
            const kiMultText = await DOMParserAdapter.extractText(source, 'th:contains("12 Ki Multiplier") + td, th:contains("Ki Multiplier") + td', 'Error');
            // Clean and format the multiplier
            if (kiMultText !== 'Error') {
                return kiMultText.trim();
            }
            return 'Error';
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractKi12Multiplier(source) {
        try {
            const ki12Text = await DOMParserAdapter.extractText(source, 'th:contains("12 Ki Multiplier") + td', 'Error');
            return ki12Text.trim();
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractKi18Multiplier(source) {
        try {
            const ki18Text = await DOMParserAdapter.extractText(source, 'th:contains("18 Ki Multiplier") + td', 'Error');
            return ki18Text.trim();
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractKi24Multiplier(source) {
        try {
            const ki24Text = await DOMParserAdapter.extractText(source, 'th:contains("24 Ki Multiplier") + td', 'Error');
            return ki24Text.trim();
        }
        catch (error) {
            return 'Error';
        }
    }
    /**
     * Extract links and categories
     */
    static async extractLinks(source) {
        try {
            // Look for link skills section
            const linkElements = await DOMParserAdapter.extractTextArray(source, 'th:contains("Link Skill") + td a, .link-skills a, table tr:contains("Link") td a');
            if (linkElements && linkElements.length > 0 && linkElements[0] !== 'Error') {
                return linkElements.filter(link => link.trim().length > 0);
            }
            // Fallback: try different selectors
            const linkText = await DOMParserAdapter.extractText(source, 'th:contains("Link Skill") + td, th:contains("Links") + td', 'Error');
            if (linkText !== 'Error') {
                // Split by common delimiters
                return linkText.split(/[,\n]/).map(link => link.trim()).filter(link => link.length > 0);
            }
            return [];
        }
        catch (error) {
            await logger.debug('Failed to extract link skills');
            return [];
        }
    }
    static async extractCategories(source) {
        try {
            // Look for categories section
            const categoryElements = await DOMParserAdapter.extractTextArray(source, 'th:contains("Categories") + td a, .categories a, table tr:contains("Category") td a');
            if (categoryElements && categoryElements.length > 0 && categoryElements[0] !== 'Error') {
                return categoryElements.filter(cat => cat.trim().length > 0);
            }
            // Fallback: try text-based extraction
            const categoryText = await DOMParserAdapter.extractText(source, 'th:contains("Categories") + td, th:contains("Category") + td', 'Error');
            if (categoryText !== 'Error') {
                return categoryText.split(/[,\n]/).map(cat => cat.trim()).filter(cat => cat.length > 0);
            }
            return [];
        }
        catch (error) {
            await logger.debug('Failed to extract categories');
            return [];
        }
    }
    /**
     * Extract Ki meter information
     */
    static async extractKiMeter(source) {
        try {
            // Look for Ki meter or Ki path information
            const kiMeterElements = await DOMParserAdapter.extractTextArray(source, 'th:contains("Ki Meter") + td span, .ki-meter span, table tr:contains("Ki") td span');
            if (kiMeterElements && kiMeterElements.length > 0 && kiMeterElements[0] !== 'Error') {
                return kiMeterElements.filter(ki => ki.trim().length > 0);
            }
            // Fallback: extract Ki path as text
            const kiMeterText = await DOMParserAdapter.extractText(source, 'th:contains("Ki Meter") + td, th:contains("Ki Path") + td', 'Error');
            if (kiMeterText !== 'Error') {
                // Parse Ki path (like "PHY, AGL, STR, TEQ, INT, Rainbow")
                return kiMeterText.split(/[,\s]+/).map(ki => ki.trim()).filter(ki => ki.length > 0);
            }
            return [];
        }
        catch (error) {
            await logger.debug('Failed to extract Ki meter');
            return [];
        }
    }
}
//# sourceMappingURL=stats-extractor.js.map