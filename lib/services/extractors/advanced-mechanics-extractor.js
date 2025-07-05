import { DOMParserAdapter } from '../dom-parser-adapter.js';
import { logger } from '../../utils/logger.js';
/**
 * Extractor for advanced Dragon Ball Dokkan Battle mechanics
 * Based on the comprehensive mechanics guide
 */
export class AdvancedMechanicsExtractor {
    /**
     * Extract all advanced mechanics from a character page
     */
    static async extractAdvancedMechanics(source) {
        try {
            const mechanics = {
                hasRevival: false,
                revivalCondition: '',
                hasRageMode: false,
                rageModeCondition: '',
                hasGiantForm: false,
                giantFormCondition: '',
                hasStandbySkill: false,
                standbySkillType: '',
                standbyCondition: '',
                hasExchange: false,
                exchangeType: '',
                exchangeCondition: '',
                hasFusion: false,
                fusionType: '',
                fusionCondition: ''
            };
            // Extract each advanced mechanic
            await this.detectRevival(source, mechanics);
            await this.detectRageMode(source, mechanics);
            await this.detectGiantForm(source, mechanics);
            await this.detectStandbySkill(source, mechanics);
            await this.detectExchange(source, mechanics);
            await this.detectFusion(source, mechanics);
            return mechanics;
        }
        catch (error) {
            await logger.debug(`Failed to extract advanced mechanics: ${error}`);
            return {
                hasRevival: false, revivalCondition: '',
                hasRageMode: false, rageModeCondition: '',
                hasGiantForm: false, giantFormCondition: '',
                hasStandbySkill: false, standbySkillType: '', standbyCondition: '',
                hasExchange: false, exchangeType: '', exchangeCondition: '',
                hasFusion: false, fusionType: '', fusionCondition: ''
            };
        }
    }
    /**
     * Detect Revival mechanics
     * Revival: Auto-resurrection when KO'd with HP below 50%
     */
    static async detectRevival(source, mechanics) {
        const revivalSelectors = [
            'th:contains("Revival"), td:contains("Revival")',
            'th:contains("Revive"), td:contains("Revive")',
            'th:contains("Resurrection"), td:contains("Resurrection")',
            'passive:contains("revive"), passive:contains("revival")',
            'passive:contains("HP below"), passive:contains("when KO")'
        ];
        for (const selector of revivalSelectors) {
            const revivalText = await DOMParserAdapter.extractText(source, selector, '');
            if (revivalText && revivalText.toLowerCase().includes('revival')) {
                mechanics.hasRevival = true;
                mechanics.revivalCondition = this.parseRevivalCondition(revivalText);
                break;
            }
        }
        // Check passive skills for revival indicators
        const passiveText = await DOMParserAdapter.extractText(source, 'th:contains("Passive") + td', '');
        if (passiveText.toLowerCase().includes('revival') ||
            passiveText.toLowerCase().includes('revive') ||
            passiveText.toLowerCase().includes('when ko')) {
            mechanics.hasRevival = true;
            mechanics.revivalCondition = this.parseRevivalCondition(passiveText);
        }
    }
    /**
     * Parse revival condition from text
     */
    static parseRevivalCondition(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('hp below 50%') || lowerText.includes('hp is 50% or below')) {
            return 'When KO\'d with HP below 50% (once per battle)';
        }
        if (lowerText.includes('hp below 70%')) {
            return 'When KO\'d with HP below 70% (once per battle)';
        }
        if (lowerText.includes('once per battle')) {
            return 'Revival condition with once per battle restriction';
        }
        return 'Revival mechanic available';
    }
    /**
     * Detect Rage Mode mechanics
     * Rage: Complete damage immunity for 1 turn when receiving fatal damage
     */
    static async detectRageMode(source, mechanics) {
        const rageModeSelectors = [
            'th:contains("Rage"), td:contains("Rage")',
            'th:contains("Rage Mode"), td:contains("Rage Mode")',
            'passive:contains("rage"), passive:contains("invincible")',
            'passive:contains("immune"), passive:contains("damage immunity")'
        ];
        for (const selector of rageModeSelectors) {
            const rageText = await DOMParserAdapter.extractText(source, selector, '');
            if (rageText && rageText.toLowerCase().includes('rage')) {
                mechanics.hasRageMode = true;
                mechanics.rageModeCondition = this.parseRageModeCondition(rageText);
                break;
            }
        }
        // Check passive skills for rage mode indicators
        const passiveText = await DOMParserAdapter.extractText(source, 'th:contains("Passive") + td', '');
        if (passiveText.toLowerCase().includes('rage') ||
            passiveText.toLowerCase().includes('immune') ||
            passiveText.toLowerCase().includes('invincible')) {
            mechanics.hasRageMode = true;
            mechanics.rageModeCondition = this.parseRageModeCondition(passiveText);
        }
    }
    /**
     * Parse rage mode condition from text
     */
    static parseRageModeCondition(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('fatal damage') || lowerText.includes('when receiving damage')) {
            return 'Rage Mode when receiving fatal damage (1 turn immunity)';
        }
        if (lowerText.includes('guaranteed')) {
            return 'Guaranteed Rage Mode activation';
        }
        if (lowerText.includes('%') && lowerText.includes('chance')) {
            const chanceMatch = text.match(/(\d+)%/);
            if (chanceMatch) {
                return `${chanceMatch[1]}% chance for Rage Mode activation`;
            }
        }
        return 'Rage Mode mechanic available';
    }
    /**
     * Detect Giant Form mechanics
     * Giant Form: Complete transformation breaking normal battle rules
     */
    static async detectGiantForm(source, mechanics) {
        const giantFormSelectors = [
            'th:contains("Giant"), td:contains("Giant")',
            'th:contains("Giant Form"), td:contains("Giant Form")',
            'th:contains("Great Ape"), td:contains("Great Ape")',
            'passive:contains("giant"), passive:contains("great ape")'
        ];
        for (const selector of giantFormSelectors) {
            const giantText = await DOMParserAdapter.extractText(source, selector, '');
            if (giantText && (giantText.toLowerCase().includes('giant') ||
                giantText.toLowerCase().includes('great ape'))) {
                mechanics.hasGiantForm = true;
                mechanics.giantFormCondition = this.parseGiantFormCondition(giantText);
                break;
            }
        }
        // Check character name for Giant Form indicators
        const characterName = await DOMParserAdapter.extractText(source, 'h1.page-header__title', '');
        if (characterName.toLowerCase().includes('giant') ||
            characterName.toLowerCase().includes('great ape')) {
            mechanics.hasGiantForm = true;
            mechanics.giantFormCondition = 'Giant Form character';
        }
    }
    /**
     * Parse Giant Form condition from text
     */
    static parseGiantFormCondition(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('active skill')) {
            return 'Giant Form via Active Skill';
        }
        if (lowerText.includes('random') || lowerText.includes('chance')) {
            const chanceMatch = text.match(/(\d+)%/);
            if (chanceMatch) {
                return `${chanceMatch[1]}% random chance for Giant Form per turn`;
            }
            return 'Random chance for Giant Form transformation';
        }
        if (lowerText.includes('hp below')) {
            const hpMatch = text.match(/(\d+)%/);
            if (hpMatch) {
                return `Giant Form when HP is ${hpMatch[1]}% or below`;
            }
        }
        return 'Giant Form transformation available';
    }
    /**
     * Detect Standby Skill mechanics
     * Standby: Character temporarily leaves rotation for enhanced return
     */
    static async detectStandbySkill(source, mechanics) {
        const standbySelectors = [
            'th:contains("Standby"), td:contains("Standby")',
            'th:contains("Standby Skill"), td:contains("Standby Skill")',
            'active:contains("standby"), passive:contains("standby")'
        ];
        for (const selector of standbySelectors) {
            const standbyText = await DOMParserAdapter.extractText(source, selector, '');
            if (standbyText && standbyText.toLowerCase().includes('standby')) {
                mechanics.hasStandbySkill = true;
                mechanics.standbySkillType = this.parseStandbyType(standbyText);
                mechanics.standbyCondition = this.parseStandbyCondition(standbyText);
                break;
            }
        }
    }
    /**
     * Parse standby skill type (charge vs fixed)
     */
    static parseStandbyType(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('accumulate') || lowerText.includes('charge') || lowerText.includes('ki')) {
            return 'charge';
        }
        if (lowerText.includes('fixed') || lowerText.includes('predetermined')) {
            return 'fixed';
        }
        return '';
    }
    /**
     * Parse standby condition from text
     */
    static parseStandbyCondition(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('turn')) {
            const turnMatch = text.match(/(\d+)\s*turn/);
            if (turnMatch) {
                return `Standby for ${turnMatch[1]} turn(s)`;
            }
        }
        if (lowerText.includes('active skill')) {
            return 'Standby via Active Skill';
        }
        return 'Standby Skill available';
    }
    /**
     * Detect Exchange mechanics
     * Exchange: Switch between different character forms
     */
    static async detectExchange(source, mechanics) {
        const exchangeSelectors = [
            'th:contains("Exchange"), td:contains("Exchange")',
            'th:contains("Switch"), td:contains("Switch")',
            'active:contains("exchange"), active:contains("switch")'
        ];
        for (const selector of exchangeSelectors) {
            const exchangeText = await DOMParserAdapter.extractText(source, selector, '');
            if (exchangeText && (exchangeText.toLowerCase().includes('exchange') ||
                exchangeText.toLowerCase().includes('switch'))) {
                mechanics.hasExchange = true;
                mechanics.exchangeType = this.parseExchangeType(exchangeText);
                mechanics.exchangeCondition = this.parseExchangeCondition(exchangeText);
                break;
            }
        }
        // Check character name for exchange indicators
        const characterName = await DOMParserAdapter.extractText(source, 'h1.page-header__title', '');
        if (characterName.includes('&') || characterName.includes('/')) {
            mechanics.hasExchange = true;
            mechanics.exchangeType = 'traditional';
            mechanics.exchangeCondition = 'Exchange mechanic detected from character name';
        }
    }
    /**
     * Parse exchange type
     */
    static parseExchangeType(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('reversible') || lowerText.includes('back and forth')) {
            return 'reversible';
        }
        if (lowerText.includes('3 turns') || lowerText.includes('timed')) {
            return 'timed';
        }
        if (lowerText.includes('one-way') || lowerText.includes('permanent')) {
            return 'traditional';
        }
        return 'traditional'; // Default to traditional exchange
    }
    /**
     * Parse exchange condition from text
     */
    static parseExchangeCondition(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('active skill')) {
            return 'Exchange via Active Skill';
        }
        if (lowerText.includes('turn')) {
            const turnMatch = text.match(/turn\s*(\d+)/);
            if (turnMatch) {
                return `Exchange available starting from turn ${turnMatch[1]}`;
            }
        }
        return 'Exchange mechanic available';
    }
    /**
     * Detect Fusion mechanics
     * Fusion: Permanent character combination
     */
    static async detectFusion(source, mechanics) {
        const fusionSelectors = [
            'th:contains("Fusion"), td:contains("Fusion")',
            'th:contains("Potara"), td:contains("Potara")',
            'th:contains("Dance"), td:contains("Dance")',
            'active:contains("fusion"), active:contains("fuse")'
        ];
        for (const selector of fusionSelectors) {
            const fusionText = await DOMParserAdapter.extractText(source, selector, '');
            if (fusionText && fusionText.toLowerCase().includes('fusion')) {
                mechanics.hasFusion = true;
                mechanics.fusionType = this.parseFusionType(fusionText);
                mechanics.fusionCondition = this.parseFusionCondition(fusionText);
                break;
            }
        }
        // Check character name for fusion indicators
        const characterName = await DOMParserAdapter.extractText(source, 'h1.page-header__title', '');
        if (characterName.toLowerCase().includes('fusion') ||
            characterName.toLowerCase().includes('potara') ||
            characterName.toLowerCase().includes('gogeta') ||
            characterName.toLowerCase().includes('vegito')) {
            mechanics.hasFusion = true;
            mechanics.fusionType = this.parseFusionTypeFromName(characterName);
            mechanics.fusionCondition = 'Fusion character detected';
        }
    }
    /**
     * Parse fusion type from text
     */
    static parseFusionType(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('potara') || lowerText.includes('vegito')) {
            return 'potara';
        }
        if (lowerText.includes('dance') || lowerText.includes('gogeta')) {
            return 'dance';
        }
        return '';
    }
    /**
     * Parse fusion type from character name
     */
    static parseFusionTypeFromName(name) {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('vegito')) {
            return 'potara';
        }
        if (lowerName.includes('gogeta')) {
            return 'dance';
        }
        return '';
    }
    /**
     * Parse fusion condition from text
     */
    static parseFusionCondition(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('turn') && lowerText.includes('hp')) {
            const turnMatch = text.match(/turn\s*(\d+)/);
            const hpMatch = text.match(/(\d+)%/);
            if (turnMatch && hpMatch) {
                return `Fusion starting from turn ${turnMatch[1]} when HP is ${hpMatch[1]}% or below`;
            }
        }
        if (lowerText.includes('active skill')) {
            return 'Fusion via Active Skill';
        }
        return 'Fusion mechanic available';
    }
}
//# sourceMappingURL=advanced-mechanics-extractor.js.map