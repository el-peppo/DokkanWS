import { Character } from '../types/character.js';
import { DOMSource } from './dom-parser-adapter.js';
export declare class CharacterExtractor {
    /**
     * Extract complete character data from character page using Playwright
     */
    static extractCharacterData(source: DOMSource): Promise<Character | null>;
    /**
     * Extract character name with enhanced parsing
     */
    private static extractName;
    /**
     * Extract character title with enhanced parsing
     */
    private static extractTitle;
    /**
     * Extract max level with EZA support (120 -> 140)
     */
    private static extractMaxLevel;
    /**
     * Extract max SA level with enhanced EZA detection
     */
    private static extractMaxSALevel;
    /**
     * Extract character rarity with enhanced detection
     */
    private static extractRarity;
    /**
     * Extract character class (Super/Extreme)
     */
    private static extractClass;
    /**
     * Extract character type with enhanced detection
     */
    private static extractType;
    /**
     * Extract character cost (historical data)
     */
    private static extractCost;
    /**
     * Extract character ID
     */
    private static extractId;
    /**
     * Extract character image URL (thumbnail)
     */
    private static extractImageURL;
    /**
     * Extract full-size character image URL
     */
    private static extractFullImageURL;
    /**
     * Extract leader skill with enhanced parsing
     */
    private static extractLeaderSkill;
    /**
     * Extract EZA leader skill
     */
    private static extractEZALeaderSkill;
    /**
     * Extract SEZA leader skill
     */
    private static extractSEZALeaderSkill;
    private static extractSuperAttack;
    private static extractEZASuperAttack;
    private static extractSEZASuperAttack;
    private static extractUltraSuperAttack;
    private static extractEZAUltraSuperAttack;
    private static extractSEZAUltraSuperAttack;
    private static extractPassive;
    private static extractEZAPassive;
    private static extractSEZAPassive;
    private static extractActiveSkill;
    private static extractActiveSkillCondition;
    private static extractEZAActiveSkill;
    private static extractEZAActiveSkillCondition;
    private static extractSEZAActiveSkill;
    private static extractSEZAActiveSkillCondition;
    private static extractStandbySkill;
    private static extractStandbySkillCondition;
    private static extractTransformationCondition;
    private static extractLinks;
    private static extractCategories;
    private static extractKiMeter;
    private static extractBaseStat;
    private static extractKiMultiplier;
    private static extractKi12Multiplier;
    private static extractKi18Multiplier;
    private static extractKi24Multiplier;
    private static extractTransformations;
}
//# sourceMappingURL=character-extractor.d.ts.map