/**
 * Cleans passive text from the Dokkan wiki format
 * Removes wiki formatting artifacts and normalizes text
 */
export declare function cleanPassiveText(text: string | null | undefined): string;
/**
 * Extracts and cleans character name from HTML
 */
export declare function extractCharacterName(html: string | undefined): string;
/**
 * Extracts and cleans character title from HTML
 */
export declare function extractCharacterTitle(html: string | undefined): string;
/**
 * Safely parses integer values with fallback
 */
export declare function safeParseInt(value: string | null | undefined, fallback?: number): number;
/**
 * Safely extracts text content with fallback
 */
export declare function safeExtractText(element: Element | null, fallback?: string): string;
/**
 * Extracts array of text content from NodeList
 */
export declare function extractTextArray(elements: NodeListOf<Element> | null): string[];
//# sourceMappingURL=text-cleaner.d.ts.map