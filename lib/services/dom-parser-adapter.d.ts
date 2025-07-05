import { Page } from 'playwright';
import { PlaywrightParser } from './playwright-parser.js';
export type DOMSource = Document | Page;
export type ElementSource = Element | any;
export declare class DOMParserAdapter {
    private static playwrightParser;
    /**
     * Initialize Playwright parser for enhanced functionality
     */
    static initializePlaywright(playwrightParser: PlaywrightParser): Promise<void>;
    /**
     * Parse HTML string into DOM Document or Page
     */
    static parseHTML(html: string, usePlaywright?: boolean): Promise<Document | Page | null>;
    /**
     * Extract character page links from category page
     */
    static extractCharacterLinks(source: DOMSource, baseUrl: string): Promise<string[]>;
    /**
     * Detect pagination on category pages and return next page URLs
     */
    static extractPaginationUrls(source: DOMSource, currentUrl: string): Promise<string[]>;
    /**
     * Extract pagination URLs from JSDOM document (legacy method)
     */
    private static extractPaginationUrlsFromDocument;
    /**
     * Safely query a single element
     */
    static querySelector(source: DOMSource, selector: string): Promise<ElementSource | null>;
    /**
     * Safely query multiple elements
     */
    static querySelectorAll(source: DOMSource, selector: string): Promise<ElementSource[] | null>;
    /**
     * Safe text extraction with fallback
     */
    static extractText(source: DOMSource, selectorOrElement: string | any, fallback?: string): Promise<string>;
    /**
     * Enhanced text extraction that replaces Ki sphere icons with text equivalents
     */
    static extractTextWithKiSpheres(source: DOMSource, selector: string, fallback?: string): Promise<string>;
    /**
     * Safe attribute extraction with fallback
     */
    static extractAttribute(source: DOMSource, selector: string, attribute: string, fallback?: string): Promise<string>;
    /**
     * Safe HTML extraction with fallback
     */
    static extractHTML(source: DOMSource, selector: string, fallback?: string): Promise<string>;
    /**
     * Extract array of text content from elements
     */
    static extractTextArray(source: DOMSource, selector: string): Promise<string[]>;
    /**
     * Find element by image data attribute (common pattern in Dokkan wiki)
     */
    static findByImageName(source: DOMSource, imageName: string): Promise<ElementSource | null>;
    /**
     * Find the next sibling element of a given element
     */
    static getNextSibling(element: ElementSource): Promise<ElementSource | null>;
    /**
     * Find closest ancestor element matching selector
     */
    static findClosest(element: ElementSource, selector: string): Promise<ElementSource | null>;
    /**
     * Replace Ki sphere icons with text equivalents
     */
    private static replaceKiSphereIcons;
    /**
     * Type guard to check if source is a Playwright Page
     */
    private static isPlaywrightPage;
    /**
     * Type guard to check if element is a Playwright element handle
     */
    private static isPlaywrightElement;
    /**
     * Wait for element to be visible (Playwright only)
     */
    static waitForElement(source: DOMSource, selector: string, timeout?: number): Promise<boolean>;
    /**
     * Take screenshot (Playwright only)
     */
    static takeScreenshot(source: DOMSource, filename: string): Promise<void>;
    /**
     * Close page if it's a Playwright page
     */
    static closePage(source: DOMSource): Promise<void>;
}
//# sourceMappingURL=dom-parser-adapter.d.ts.map