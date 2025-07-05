import { DOMSource } from '../dom-parser-adapter.js';
import { Transformation } from '../../types/character.js';
export declare class TransformationExtractor {
    /**
     * Extract all transformations from a character page
     * Based on Dragon Ball Dokkan Battle Complete Mechanics Guide
     */
    static extractTransformations(source: DOMSource): Promise<Transformation[]>;
    /**
     * Find transformation sections in the DOM
     */
    private static findTransformationSections;
    /**
     * Extract a single transformation from the page
     */
    private static extractSingleTransformation;
    /**
     * Extract transformation name
     */
    private static extractTransformationName;
    /**
     * Extract transformation condition using Dragon Ball Dokkan Battle mechanics
     */
    private static extractTransformationCondition;
    /**
     * Parse transformation condition based on Dokkan Battle mechanics
     */
    private static parseTransformationCondition;
    /**
     * Extract transformation passive skill
     */
    private static extractTransformationPassive;
    /**
     * Extract transformation super attack
     */
    private static extractTransformationSuperAttack;
    /**
     * Extract transformation Ki multiplier
     */
    private static extractTransformationKiMultiplier;
    /**
     * Extract transformation links
     */
    private static extractTransformationLinks;
    /**
     * Extract transformation categories
     */
    private static extractTransformationCategories;
    /**
     * Detect specific transformation types from Dokkan Battle mechanics
     */
    static detectTransformationType(source: DOMSource): Promise<string>;
}
//# sourceMappingURL=transformation-extractor.d.ts.map