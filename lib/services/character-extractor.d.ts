import { Character } from '../types/character.js';
export declare class CharacterExtractor {
    /**
     * Extract complete character data from character page DOM
     */
    static extractCharacterData(document: Document): Promise<Character | null>;
    private static extractName;
    private static extractTitle;
    private static extractMaxLevel;
    private static extractMaxSALevel;
    private static extractRarity;
    private static extractClass;
    private static extractType;
    private static extractCost;
    private static extractId;
    private static extractImageURL;
    private static extractSkillByImage;
    private static extractLeaderSkill;
    private static extractEZALeaderSkill;
    private static extractSuperAttack;
    private static extractEZASuperAttack;
    private static extractUltraSuperAttack;
    private static extractEZAUltraSuperAttack;
    private static extractPassive;
    private static extractEZAPassive;
    private static extractActiveSkill;
    private static extractActiveSkillCondition;
    private static extractEZAActiveSkill;
    private static extractEZAActiveSkillCondition;
    private static extractTransformationCondition;
    private static extractLinks;
    private static extractCategories;
    private static extractKiMeter;
    private static extractBaseStat;
    private static extractKiMultiplier;
    private static extractTransformations;
    private static extractSingleTransformation;
    private static extractTransformationName;
    private static extractTransformationId;
    private static extractTransformationClass;
    private static extractTransformationType;
    private static extractTransformationSuperAttack;
    private static extractTransformationEZASuperAttack;
    private static extractTransformationUltraSuperAttack;
    private static extractTransformationEZAUltraSuperAttack;
    private static extractTransformationPassive;
    private static extractTransformationEZAPassive;
    private static extractTransformationActiveSkill;
    private static extractTransformationActiveSkillCondition;
    private static extractTransformationLinks;
    private static extractTransformationImageURL;
}
//# sourceMappingURL=character-extractor.d.ts.map