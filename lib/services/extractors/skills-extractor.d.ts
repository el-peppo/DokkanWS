import { DOMSource } from '../dom-parser-adapter.js';
export declare class SkillsExtractor {
    /**
     * Extract leader skill with enhanced parsing
     */
    static extractLeaderSkill(source: DOMSource): Promise<string>;
    static extractEZALeaderSkill(source: DOMSource): Promise<string>;
    static extractSEZALeaderSkill(source: DOMSource): Promise<string>;
    /**
     * Extract super attack information
     */
    static extractSuperAttack(source: DOMSource): Promise<string>;
    static extractEZASuperAttack(source: DOMSource): Promise<string>;
    static extractSEZASuperAttack(source: DOMSource): Promise<string>;
    static extractUltraSuperAttack(source: DOMSource): Promise<string>;
    static extractEZAUltraSuperAttack(source: DOMSource): Promise<string>;
    static extractSEZAUltraSuperAttack(source: DOMSource): Promise<string>;
    /**
     * Extract passive skill information
     */
    static extractPassive(source: DOMSource): Promise<string>;
    static extractEZAPassive(source: DOMSource): Promise<string>;
    static extractSEZAPassive(source: DOMSource): Promise<string>;
    /**
     * Extract active skill information
     */
    static extractActiveSkill(source: DOMSource): Promise<string>;
    static extractActiveSkillCondition(source: DOMSource): Promise<string>;
    static extractEZAActiveSkill(source: DOMSource): Promise<string>;
    static extractEZAActiveSkillCondition(source: DOMSource): Promise<string>;
    static extractSEZAActiveSkill(source: DOMSource): Promise<string>;
    static extractSEZAActiveSkillCondition(source: DOMSource): Promise<string>;
    /**
     * Extract standby skill information
     */
    static extractStandbySkill(source: DOMSource): Promise<string>;
    static extractStandbySkillCondition(source: DOMSource): Promise<string>;
    /**
     * Extract transformation condition
     */
    static extractTransformationCondition(source: DOMSource): Promise<string>;
}
//# sourceMappingURL=skills-extractor.d.ts.map