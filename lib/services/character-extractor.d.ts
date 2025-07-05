import { Character } from '../types/character.js';
import { DOMSource } from './dom-parser-adapter.js';
export declare class CharacterExtractor {
    /**
     * Extract complete character data from character page using Playwright
     */
    static extractCharacterData(source: DOMSource): Promise<Character | null>;
    /**
     * Extract character quote (if available)
     */
    static extractQuote(source: DOMSource): Promise<string>;
    /**
     * Extract transformation data (placeholder for now)
     */
    private static extractTransformations;
    /**
     * Check if character has EZA
     */
    static hasEZA(source: DOMSource): Promise<boolean>;
    /**
     * Check if character has SEZA
     */
    static hasSEZA(source: DOMSource): Promise<boolean>;
    /**
     * Check if character is LR (Legendary Rare)
     */
    static isLR(source: DOMSource): Promise<boolean>;
}
//# sourceMappingURL=character-extractor.d.ts.map