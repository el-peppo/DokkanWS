export declare class DOMParser {
    /**
     * Parse HTML string into DOM Document
     */
    static parseHTML(html: string): Promise<Document | null>;
    /**
     * Extract character page links from category page
     */
    static extractCharacterLinks(document: Document, baseUrl: string): Promise<string[]>;
    /**
     * Detect pagination on category pages and return next page URLs
     */
    static extractPaginationUrls(document: Document, currentUrl: string): Promise<string[]>;
    /**
     * Safely query a single element
     */
    static querySelector(element: Document | Element | null, selector: string): Element | null;
    /**
     * Safely query multiple elements
     */
    static querySelectorAll(element: Document | Element | null, selector: string): NodeListOf<Element> | null;
    /**
     * Replace Ki sphere icons with text equivalents
     */
    private static replaceKiSphereIcons;
    /**
     * Safe text extraction with fallback
     */
    static extractText(element: Element | null, fallback?: string): string;
    /**
     * Enhanced text extraction that replaces Ki sphere icons with text equivalents
     */
    static extractTextWithKiSpheres(element: Element | null, fallback?: string): string;
    /**
     * Safe attribute extraction with fallback
     */
    static extractAttribute(element: Element | null, attribute: string, fallback?: string): string;
    /**
     * Safe HTML extraction with fallback
     */
    static extractHTML(element: Element | null, fallback?: string): string;
    /**
     * Extract array of text content from elements
     */
    static extractTextArray(elements: NodeListOf<Element> | Element[] | null): string[];
    /**
     * Find element by image data attribute (common pattern in Dokkan wiki)
     */
    static findByImageName(element: Document | Element | null, imageName: string): Element | null;
    /**
     * Find the next sibling element of a given element
     */
    static getNextSibling(element: Element | null): Element | null;
    /**
     * Find closest ancestor element matching selector
     */
    static findClosest(element: Element | null, selector: string): Element | null;
}
//# sourceMappingURL=dom-parser.d.ts.map