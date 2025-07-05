import { DOMParserAdapter } from '../dom-parser-adapter.js';
import { cleanPassiveText } from '../../utils/text-cleaner.js';
import { logger } from '../../utils/logger.js';
export class SkillsExtractor {
    /**
     * Extract leader skill with enhanced parsing
     */
    static async extractLeaderSkill(source) {
        try {
            const leaderText = await DOMParserAdapter.extractText(source, 'th:contains("Leader Skill") + td', 'Error');
            return cleanPassiveText(leaderText);
        }
        catch (error) {
            await logger.debug('Failed to extract Leader Skill');
            return 'Error';
        }
    }
    static async extractEZALeaderSkill(source) {
        try {
            const ezaLeader = await DOMParserAdapter.extractText(source, 'h3:contains("Extreme Z-Awakened") ~ table th:contains("Leader Skill") + td', 'Error');
            return cleanPassiveText(ezaLeader);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractSEZALeaderSkill(source) {
        try {
            const sezaLeader = await DOMParserAdapter.extractText(source, 'h3:contains("Super Extreme Z-Awakened") ~ table th:contains("Leader Skill") + td', 'Error');
            return cleanPassiveText(sezaLeader);
        }
        catch (error) {
            return 'Error';
        }
    }
    /**
     * Extract super attack information
     */
    static async extractSuperAttack(source) {
        try {
            const saText = await DOMParserAdapter.extractText(source, 'th:contains("Super Attack") + td, th:contains("12 Ki Multiplier") + td', 'Error');
            return cleanPassiveText(saText);
        }
        catch (error) {
            await logger.debug('Failed to extract Super Attack');
            return 'Error';
        }
    }
    static async extractEZASuperAttack(source) {
        try {
            const ezaSA = await DOMParserAdapter.extractText(source, 'h3:contains("Extreme Z-Awakened") ~ table th:contains("Super Attack") + td, h3:contains("Extreme Z-Awakened") ~ table th:contains("12 Ki Multiplier") + td', 'Error');
            return cleanPassiveText(ezaSA);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractSEZASuperAttack(source) {
        try {
            const sezaSA = await DOMParserAdapter.extractText(source, 'h3:contains("Super Extreme Z-Awakened") ~ table th:contains("Super Attack") + td', 'Error');
            return cleanPassiveText(sezaSA);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractUltraSuperAttack(source) {
        try {
            const ultraSA = await DOMParserAdapter.extractText(source, 'th:contains("18 Ki Multiplier") + td, th:contains("Ultra Super Attack") + td', 'Error');
            return cleanPassiveText(ultraSA);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractEZAUltraSuperAttack(source) {
        try {
            const ezaUltraSA = await DOMParserAdapter.extractText(source, 'h3:contains("Extreme Z-Awakened") ~ table th:contains("18 Ki Multiplier") + td', 'Error');
            return cleanPassiveText(ezaUltraSA);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractSEZAUltraSuperAttack(source) {
        try {
            const sezaUltraSA = await DOMParserAdapter.extractText(source, 'h3:contains("Super Extreme Z-Awakened") ~ table th:contains("18 Ki Multiplier") + td', 'Error');
            return cleanPassiveText(sezaUltraSA);
        }
        catch (error) {
            return 'Error';
        }
    }
    /**
     * Extract passive skill information
     */
    static async extractPassive(source) {
        try {
            const passiveText = await DOMParserAdapter.extractText(source, 'th:contains("Passive Skill") + td', 'Error');
            return cleanPassiveText(passiveText);
        }
        catch (error) {
            await logger.debug('Failed to extract Passive Skill');
            return 'Error';
        }
    }
    static async extractEZAPassive(source) {
        try {
            const ezaPassive = await DOMParserAdapter.extractText(source, 'h3:contains("Extreme Z-Awakened") ~ table th:contains("Passive Skill") + td', 'Error');
            return cleanPassiveText(ezaPassive);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractSEZAPassive(source) {
        try {
            const sezaPassive = await DOMParserAdapter.extractText(source, 'h3:contains("Super Extreme Z-Awakened") ~ table th:contains("Passive Skill") + td', 'Error');
            return cleanPassiveText(sezaPassive);
        }
        catch (error) {
            return 'Error';
        }
    }
    /**
     * Extract active skill information
     */
    static async extractActiveSkill(source) {
        try {
            const activeSkillText = await DOMParserAdapter.extractText(source, 'th:contains("Active Skill") + td', 'Error');
            return cleanPassiveText(activeSkillText);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractActiveSkillCondition(source) {
        try {
            const conditionText = await DOMParserAdapter.extractText(source, 'th:contains("Active Skill Condition") + td, th:contains("Condition") + td', 'Error');
            return cleanPassiveText(conditionText);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractEZAActiveSkill(source) {
        try {
            const ezaActiveSkill = await DOMParserAdapter.extractText(source, 'h3:contains("Extreme Z-Awakened") ~ table th:contains("Active Skill") + td', 'Error');
            return cleanPassiveText(ezaActiveSkill);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractEZAActiveSkillCondition(source) {
        try {
            const ezaCondition = await DOMParserAdapter.extractText(source, 'h3:contains("Extreme Z-Awakened") ~ table th:contains("Active Skill Condition") + td', 'Error');
            return cleanPassiveText(ezaCondition);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractSEZAActiveSkill(source) {
        try {
            const sezaActiveSkill = await DOMParserAdapter.extractText(source, 'h3:contains("Super Extreme Z-Awakened") ~ table th:contains("Active Skill") + td', 'Error');
            return cleanPassiveText(sezaActiveSkill);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractSEZAActiveSkillCondition(source) {
        try {
            const sezaCondition = await DOMParserAdapter.extractText(source, 'h3:contains("Super Extreme Z-Awakened") ~ table th:contains("Active Skill Condition") + td', 'Error');
            return cleanPassiveText(sezaCondition);
        }
        catch (error) {
            return 'Error';
        }
    }
    /**
     * Extract standby skill information
     */
    static async extractStandbySkill(source) {
        try {
            const standbyText = await DOMParserAdapter.extractText(source, 'th:contains("Standby Skill") + td', 'Error');
            return cleanPassiveText(standbyText);
        }
        catch (error) {
            return 'Error';
        }
    }
    static async extractStandbySkillCondition(source) {
        try {
            const standbyCondition = await DOMParserAdapter.extractText(source, 'th:contains("Standby Skill Condition") + td, th:contains("Standby Condition") + td', 'Error');
            return cleanPassiveText(standbyCondition);
        }
        catch (error) {
            return 'Error';
        }
    }
    /**
     * Extract transformation condition
     */
    static async extractTransformationCondition(source) {
        try {
            const transformCondition = await DOMParserAdapter.extractText(source, 'th:contains("Transformation Condition") + td, th:contains("Transform Condition") + td', 'Error');
            return cleanPassiveText(transformCondition);
        }
        catch (error) {
            return 'Error';
        }
    }
}
//# sourceMappingURL=skills-extractor.js.map