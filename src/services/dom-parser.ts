import { JSDOM } from 'jsdom';
import { logger } from '../utils/logger.js';

export class DOMParser {
    /**
     * Parse HTML string into DOM Document
     */
    static async parseHTML(html: string): Promise<Document | null> {
        try {
            const dom = new JSDOM(html);
            return dom.window.document;
        } catch (error) {
            await logger.error('Failed to parse HTML:', {}, error as Error);
            return null;
        }
    }

    /**
     * Extract character page links from category page
     */
    static async extractCharacterLinks(document: Document, baseUrl: string): Promise<string[]> {
        try {
            const linkElements: HTMLAnchorElement[] = Array.from(
                document.querySelectorAll('.category-page__member-link')
            );
            
            return linkElements.map(link => baseUrl + link.href);
        } catch (error) {
            await logger.error('Failed to extract character links:', {}, error as Error);
            return [];
        }
    }

    /**
     * Detect pagination on category pages and return next page URLs
     */
    static async extractPaginationUrls(document: Document, currentUrl: string): Promise<string[]> {
        const paginationUrls: string[] = [];
        
        try {
            // Method 1: Look for "next" pagination links
            const nextLinks = Array.from(document.querySelectorAll('a'))
                .filter(link => {
                    const text = link.textContent?.toLowerCase() || '';
                    return text.includes('next') || text.includes('→') || text.includes('»');
                });

            for (const link of nextLinks) {
                const href = link.getAttribute('href');
                if (href && href.includes('from=')) {
                    paginationUrls.push(href);
                }
            }

            // Method 2: Look for links with "from=" parameter in the same category
            const categoryName = currentUrl.split('/Category:')[1]?.split('?')[0];
            if (categoryName) {
                const fromLinks = Array.from(document.querySelectorAll('a'))
                    .filter(link => {
                        const href = link.getAttribute('href') || '';
                        return href.includes(`Category:${categoryName}?from=`);
                    });

                for (const link of fromLinks) {
                    const href = link.getAttribute('href');
                    if (href) {
                        paginationUrls.push(href);
                    }
                }
            }

            // Method 3: Check if there are exactly 200 characters (wiki page limit) - indicates more pages
            const characterCount = document.querySelectorAll('.category-page__member-link').length;
            if (characterCount >= 200) {
                // Try to find the last character name to build next page URL
                const lastCharacterLink = document.querySelector('.category-page__member:last-child .category-page__member-link');
                if (lastCharacterLink) {
                    const lastCharacterName = lastCharacterLink.textContent?.trim();
                    if (lastCharacterName && categoryName) {
                        const encodedName = encodeURIComponent(lastCharacterName.replace(/ /g, '+'));
                        paginationUrls.push(`/wiki/Category:${categoryName}?from=${encodedName}`);
                    }
                }
            }

            // Remove duplicates and make URLs absolute
            const uniqueUrls = [...new Set(paginationUrls)];
            return uniqueUrls.map(url => url.startsWith('http') ? url : `https://dbz-dokkanbattle.fandom.com${url}`);
            
        } catch (error) {
            await logger.error('Failed to extract pagination URLs:', { currentUrl }, error as Error);
            return [];
        }
    }

    /**
     * Safely query a single element
     */
    static querySelector(element: Document | Element | null, selector: string): Element | null {
        if (!element) return null;
        try {
            return element.querySelector(selector);
        } catch (error) {
            // Note: This should be await logger.warn but that would require making all callers async
            // For now, we'll leave this as a sync call to avoid massive refactoring
            logger.warn(`Invalid selector "${selector}":`, { selector });
            return null;
        }
    }

    /**
     * Safely query multiple elements
     */
    static querySelectorAll(element: Document | Element | null, selector: string): NodeListOf<Element> | null {
        if (!element) return null;
        try {
            return element.querySelectorAll(selector);
        } catch (error) {
            // Note: This should be await logger.warn but that would require making all callers async
            // For now, we'll leave this as a sync call to avoid massive refactoring
            logger.warn(`Invalid selector "${selector}":`, { selector });
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
    static findByImageName(element: Document | Element | null, imageName: string): Element | null {
        return this.querySelector(element, `[data-image-name="${imageName}"]`);
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
            // Note: This should be await logger.warn but that would require making all callers async
            // For now, we'll leave this as a sync call to avoid massive refactoring
            logger.warn(`Invalid closest selector "${selector}":`, { selector });
            return null;
        }
    }
}