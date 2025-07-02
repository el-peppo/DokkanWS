import { JSDOM } from 'jsdom';
import { logger } from '../utils/logger.js';

export class DOMParser {
    /**
     * Parse HTML string into DOM Document
     */
    static parseHTML(html: string): Document | null {
        try {
            const dom = new JSDOM(html);
            return dom.window.document;
        } catch (error) {
            logger.error('Failed to parse HTML:', error);
            return null;
        }
    }

    /**
     * Extract character page links from category page
     */
    static extractCharacterLinks(document: Document, baseUrl: string): string[] {
        try {
            const linkElements: HTMLAnchorElement[] = Array.from(
                document.querySelectorAll('.category-page__member-link')
            );
            
            return linkElements.map(link => baseUrl + link.href);
        } catch (error) {
            logger.error('Failed to extract character links:', error);
            return [];
        }
    }

    /**
     * Safely query a single element
     */
    static querySelector(document: Document, selector: string): Element | null {
        try {
            return document.querySelector(selector);
        } catch (error) {
            logger.warn(`Invalid selector "${selector}":`, error);
            return null;
        }
    }

    /**
     * Safely query multiple elements
     */
    static querySelectorAll(document: Document, selector: string): NodeListOf<Element> | null {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            logger.warn(`Invalid selector "${selector}":`, error);
            return null;
        }
    }

    /**
     * Safe text extraction with fallback
     */
    static extractText(element: Element | null, fallback: string = 'Error'): string {
        return element?.textContent?.trim() ?? fallback;
    }

    /**
     * Safe attribute extraction with fallback
     */
    static extractAttribute(element: Element | null, attribute: string, fallback: string = 'Error'): string {
        return element?.getAttribute(attribute) ?? fallback;
    }

    /**
     * Safe HTML extraction with fallback
     */
    static extractHTML(element: Element | null, fallback: string = 'Error'): string {
        return element?.innerHTML ?? fallback;
    }

    /**
     * Extract array of text content from elements
     */
    static extractTextArray(elements: NodeListOf<Element> | Element[] | null): string[] {
        if (!elements) return ['Error'];
        
        const elementArray = Array.isArray(elements) ? elements : Array.from(elements);
        return elementArray.map(el => this.extractText(el));
    }

    /**
     * Find element by image data attribute (common pattern in Dokkan wiki)
     */
    static findByImageName(document: Document, imageName: string): Element | null {
        return this.querySelector(document, `[data-image-name="${imageName}"]`);
    }

    /**
     * Find the next sibling element of a given element
     */
    static getNextSibling(element: Element | null): Element | null {
        return element?.nextElementSibling ?? null;
    }

    /**
     * Find closest ancestor element matching selector
     */
    static findClosest(element: Element | null, selector: string): Element | null {
        try {
            return element?.closest(selector) ?? null;
        } catch (error) {
            logger.warn(`Invalid closest selector "${selector}":`, error);
            return null;
        }
    }
}