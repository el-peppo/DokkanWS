import { JSDOM } from 'jsdom';
import { logger } from '../utils/logger.js';
export class DOMParser {
    /**
     * Parse HTML string into DOM Document
     */
    static async parseHTML(html) {
        try {
            const dom = new JSDOM(html);
            return dom.window.document;
        }
        catch (error) {
            await logger.error('Failed to parse HTML:', {}, error);
            return null;
        }
    }
    /**
     * Extract character page links from category page
     */
    static async extractCharacterLinks(document, baseUrl) {
        try {
            const linkElements = Array.from(document.querySelectorAll('.category-page__member-link'));
            return linkElements.map(link => baseUrl + link.href);
        }
        catch (error) {
            await logger.error('Failed to extract character links:', {}, error);
            return [];
        }
    }
    /**
     * Detect pagination on category pages and return next page URLs
     */
    static async extractPaginationUrls(document, currentUrl) {
        const paginationUrls = [];
        try {
            const categoryName = currentUrl.split('/Category:')[1]?.split('?')[0];
            if (!categoryName)
                return [];
            // Method 1: Fandom alphabetical navigation - look for alphabet links
            const alphabetLinks = Array.from(document.querySelectorAll('a'))
                .filter(link => {
                const href = link.getAttribute('href') || '';
                const text = link.textContent?.trim() || '';
                // Look for single letter links or numeric pagination that belong to this category
                return (href.includes(`Category:${categoryName}`) &&
                    href.includes('from=') &&
                    (text.length <= 3 || text.match(/^[A-Z0-9]$/)) // Single letters/numbers
                );
            });
            for (const link of alphabetLinks) {
                const href = link.getAttribute('href');
                if (href) {
                    paginationUrls.push(href);
                }
            }
            // Method 2: Look for "next" or continuation pagination links
            const nextLinks = Array.from(document.querySelectorAll('a'))
                .filter(link => {
                const text = link.textContent?.toLowerCase() || '';
                const href = link.getAttribute('href') || '';
                return (href.includes(`Category:${categoryName}`) &&
                    href.includes('from=') &&
                    (text.includes('next') || text.includes('→') || text.includes('»')));
            });
            for (const link of nextLinks) {
                const href = link.getAttribute('href');
                if (href) {
                    paginationUrls.push(href);
                }
            }
            // Method 3: Extract all category continuation links with from= parameter
            const fromLinks = Array.from(document.querySelectorAll('a'))
                .filter(link => {
                const href = link.getAttribute('href') || '';
                return href.includes(`Category:${categoryName}?from=`) ||
                    href.includes(`Category:${categoryName}&from=`);
            });
            for (const link of fromLinks) {
                const href = link.getAttribute('href');
                if (href) {
                    paginationUrls.push(href);
                }
            }
            // Method 4: If page has many characters but is likely incomplete, generate continuation URL
            const characterCount = document.querySelectorAll('.category-page__member-link').length;
            // For large categories like UR, generate alphabet-based pagination
            if (characterCount >= 50 && categoryName === 'UR') {
                const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
                for (const letter of alphabet) {
                    const alphabetUrl = `/wiki/Category:${categoryName}?from=${letter}`;
                    if (!paginationUrls.some(url => url.includes(`from=${letter}`))) {
                        paginationUrls.push(alphabetUrl);
                    }
                }
            }
            // Remove duplicates and make URLs absolute
            const uniqueUrls = [...new Set(paginationUrls)];
            const absoluteUrls = uniqueUrls.map(url => url.startsWith('http') ? url : `https://dbz-dokkanbattle.fandom.com${url}`);
            // Filter out the current URL to avoid infinite loops
            return absoluteUrls.filter(url => url !== currentUrl);
        }
        catch (error) {
            await logger.error('Failed to extract pagination URLs:', { currentUrl }, error);
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
            // Note: This should be await logger.warn but that would require making all callers async
            // For now, we'll leave this as a sync call to avoid massive refactoring
            logger.warn(`Invalid selector "${selector}":`, { selector });
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
            // Note: This should be await logger.warn but that would require making all callers async
            // For now, we'll leave this as a sync call to avoid massive refactoring
            logger.warn(`Invalid selector "${selector}":`, { selector });
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
            // Note: This should be await logger.warn but that would require making all callers async
            // For now, we'll leave this as a sync call to avoid massive refactoring
            logger.warn(`Invalid closest selector "${selector}":`, { selector });
            return null;
        }
    }
}
//# sourceMappingURL=dom-parser.js.map