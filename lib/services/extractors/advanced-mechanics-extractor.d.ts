import { DOMSource } from '../dom-parser-adapter.js';
export interface AdvancedMechanics {
    hasRevival: boolean;
    revivalCondition: string;
    hasRageMode: boolean;
    rageModeCondition: string;
    hasGiantForm: boolean;
    giantFormCondition: string;
    hasStandbySkill: boolean;
    standbySkillType: 'charge' | 'fixed' | '';
    standbyCondition: string;
    hasExchange: boolean;
    exchangeType: 'traditional' | 'reversible' | 'timed' | '';
    exchangeCondition: string;
    hasFusion: boolean;
    fusionType: 'potara' | 'dance' | '';
    fusionCondition: string;
}
/**
 * Extractor for advanced Dragon Ball Dokkan Battle mechanics
 * Based on the comprehensive mechanics guide
 */
export declare class AdvancedMechanicsExtractor {
    /**
     * Extract all advanced mechanics from a character page
     */
    static extractAdvancedMechanics(source: DOMSource): Promise<AdvancedMechanics>;
    /**
     * Detect Revival mechanics
     * Revival: Auto-resurrection when KO'd with HP below 50%
     */
    private static detectRevival;
    /**
     * Parse revival condition from text
     */
    private static parseRevivalCondition;
    /**
     * Detect Rage Mode mechanics
     * Rage: Complete damage immunity for 1 turn when receiving fatal damage
     */
    private static detectRageMode;
    /**
     * Parse rage mode condition from text
     */
    private static parseRageModeCondition;
    /**
     * Detect Giant Form mechanics
     * Giant Form: Complete transformation breaking normal battle rules
     */
    private static detectGiantForm;
    /**
     * Parse Giant Form condition from text
     */
    private static parseGiantFormCondition;
    /**
     * Detect Standby Skill mechanics
     * Standby: Character temporarily leaves rotation for enhanced return
     */
    private static detectStandbySkill;
    /**
     * Parse standby skill type (charge vs fixed)
     */
    private static parseStandbyType;
    /**
     * Parse standby condition from text
     */
    private static parseStandbyCondition;
    /**
     * Detect Exchange mechanics
     * Exchange: Switch between different character forms
     */
    private static detectExchange;
    /**
     * Parse exchange type
     */
    private static parseExchangeType;
    /**
     * Parse exchange condition from text
     */
    private static parseExchangeCondition;
    /**
     * Detect Fusion mechanics
     * Fusion: Permanent character combination
     */
    private static detectFusion;
    /**
     * Parse fusion type from text
     */
    private static parseFusionType;
    /**
     * Parse fusion type from character name
     */
    private static parseFusionTypeFromName;
    /**
     * Parse fusion condition from text
     */
    private static parseFusionCondition;
}
//# sourceMappingURL=advanced-mechanics-extractor.d.ts.map