import { Classes, Types, Rarities } from '../../types/character.js';
import { DOMSource } from '../dom-parser-adapter.js';
export declare class BasicInfoExtractor {
    /**
     * Extract character name with enhanced parsing
     */
    static extractName(source: DOMSource): Promise<string>;
    /**
     * Extract character title with enhanced parsing
     */
    static extractTitle(source: DOMSource): Promise<string>;
    /**
     * Extract character ID from page URL or data
     */
    static extractId(source: DOMSource): Promise<string>;
    /**
     * Extract character cost
     */
    static extractCost(source: DOMSource): Promise<number>;
    /**
     * Extract character rarity with enhanced detection
     */
    static extractRarity(source: DOMSource): Promise<Rarities>;
    /**
     * Extract character class (Super/Extreme) with enhanced detection
     */
    static extractClass(source: DOMSource): Promise<Classes>;
    /**
     * Extract character type (PHY/STR/AGL/TEQ/INT) with enhanced detection
     */
    static extractType(source: DOMSource): Promise<Types>;
}
//# sourceMappingURL=basic-info-extractor.d.ts.map