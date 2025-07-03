import { JSDOM } from 'jsdom';
import { logger } from '../utils/logger.js';
export class DOMParser {
    /**
     * Parse HTML string into DOM Document
     */
    static parseHTML(html) {
        try {
            const dom = new JSDOM(html);
            return dom.window.document;
        }
        catch (error) {
            logger.error('Failed to parse HTML:', error);
            return null;
        }
    }
    /**
     * Extract character page links from category page
     */
    static extractCharacterLinks(document, baseUrl) {
        try {
            const linkElements = Array.from(document.querySelectorAll('.category-page__member-link'));
            return linkElements.map(link => baseUrl + link.href);
        }
        catch (error) {
            logger.error('Failed to extract character links:', error);
            return [];
        }
    }
    /**
     * Safely query a single element
     */
    static querySelector(element, selector) {
        if (!element)
            return null;
        try {
            return element.querySelector(selector);
        }
        catch (error) {
            logger.warn(`Invalid selector "${selector}":`, error);
            return null;
        }
    }
    /**
     * Safely query multiple elements
     */
    static querySelectorAll(element, selector) {
        if (!element)
            return null;
        try {
            return element.querySelectorAll(selector);
        }
        catch (error) {
            logger.warn(`Invalid selector "${selector}":`, error);
            return null;
        }
    }
    /**
     * Safe text extraction with fallback
     */
    static extractText(element, fallback = 'Error') {
        return element?.textContent?.trim() ?? fallback;
    }
    /**
     * Safe attribute extraction with fallback
     */
    static extractAttribute(element, attribute, fallback = 'Error') {
        return element?.getAttribute(attribute) ?? fallback;
    }
    /**
     * Safe HTML extraction with fallback
     */
    static extractHTML(element, fallback = 'Error') {
        return element?.innerHTML ?? fallback;
    }
    /**
     * Extract array of text content from elements
     */
    static extractTextArray(elements) {
        if (!elements)
            return ['Error'];
        const elementArray = Array.isArray(elements) ? elements : Array.from(elements);
        return elementArray.map(el => this.extractText(el));
    }
    /**
     * Find element by image data attribute (common pattern in Dokkan wiki)
     */
    static findByImageName(element, imageName) {
        return this.querySelector(element, `[data-image-name="${imageName}"]`);
    }
    /**
     * Find the next sibling element of a given element
     */
    static getNextSibling(element) {
        return element?.nextElementSibling ?? null;
    }
    /**
     * Find closest ancestor element matching selector
     */
    static findClosest(element, selector) {
        try {
            return element?.closest(selector) ?? null;
        }
        catch (error) {
            logger.warn(`Invalid closest selector "${selector}":`, error);
            return null;
        }
    }
}
//# sourceMappingURL=dom-parser.js.map