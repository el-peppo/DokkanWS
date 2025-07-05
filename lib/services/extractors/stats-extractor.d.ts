import { DOMSource } from '../dom-parser-adapter.js';
export declare class StatsExtractor {
    /**
     * Extract character level information with EZA detection
     */
    static extractMaxLevel(source: DOMSource): Promise<number>;
    /**
     * Extract Super Attack level with EZA detection
     */
    static extractMaxSALevel(source: DOMSource): Promise<string>;
    /**
     * Extract character statistics from stats table
     */
    static extractBaseStat(source: DOMSource, statType: string, column: number): Promise<number>;
    /**
     * Extract Ki multiplier information for LR characters
     */
    static extractKiMultiplier(source: DOMSource): Promise<string>;
    static extractKi12Multiplier(source: DOMSource): Promise<string>;
    static extractKi18Multiplier(source: DOMSource): Promise<string>;
    static extractKi24Multiplier(source: DOMSource): Promise<string>;
    /**
     * Extract links and categories
     */
    static extractLinks(source: DOMSource): Promise<string[]>;
    static extractCategories(source: DOMSource): Promise<string[]>;
    /**
     * Extract Ki meter information
     */
    static extractKiMeter(source: DOMSource): Promise<string[]>;
}
//# sourceMappingURL=stats-extractor.d.ts.map