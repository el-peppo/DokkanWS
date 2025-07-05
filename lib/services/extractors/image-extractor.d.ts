import { DOMSource } from '../dom-parser-adapter.js';
export declare class ImageExtractor {
    /**
     * Extract character image URL (thumbnail)
     */
    static extractImageURL(source: DOMSource): Promise<string>;
    /**
     * Extract full-size character image URL
     */
    static extractFullImageURL(source: DOMSource): Promise<string>;
    /**
     * Extract character quote/flavor text (usually in title attribute or tooltip)
     */
    static extractQuote(source: DOMSource): Promise<string>;
    /**
     * Verify that image URLs are accessible
     */
    static verifyImageURL(imageUrl: string): Promise<boolean>;
}
//# sourceMappingURL=image-extractor.d.ts.map