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
            const categoryName = currentUrl.split('/Category:')[1]?.split('?')[0];
            if (!categoryName) return [];

            // Look for alphabetical pagination links that Fandom uses
            const allLinks = Array.from(document.querySelectorAll('a'));
            await logger.debug(`Found ${allLinks.length} total links on page`);
            
            const candidateLinks: Array<{text: string, href: string}> = [];
            
            // Look for all potential pagination links
            for (const link of allLinks) {
                const text = link.textContent?.trim() || '';
                const href = link.getAttribute('href') || '';
                
                // Collect all category links with "from" parameter for debugging
                if (href.includes(`Category:${categoryName}`) && href.includes('from=')) {
                    candidateLinks.push({text, href});
                    
                    // Accept any link with "from" parameter to this category
                    if (!paginationUrls.includes(href)) {
                        paginationUrls.push(href);
                    }
                }
                
                // Also look for "next 200" style links
                const lowerText = text.toLowerCase();
                if ((lowerText.includes('next') || lowerText.includes('200')) && 
                    href.includes(`Category:${categoryName}`)) {
                    if (!paginationUrls.includes(href)) {
                        paginationUrls.push(href);
                        candidateLinks.push({text, href});
                    }
                }
            }
            
            // Debug logging
            if (candidateLinks.length > 0) {
                await logger.info(`Found ${candidateLinks.length} pagination candidates for ${categoryName}:`, candidateLinks.slice(0, 10));
            }

            // Make URLs absolute and filter out current URL
            const absoluteUrls = paginationUrls.map(url => 
                url.startsWith('http') ? url : `https://dbz-dokkanbattle.fandom.com${url}`
            );

            const filteredUrls = absoluteUrls.filter(url => url !== currentUrl);
            
            if (filteredUrls.length > 0) {
                await logger.info(`Extracted ${filteredUrls.length} pagination URLs for ${categoryName}`);
            }

            return filteredUrls;
            
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
     * Replace Ki sphere icons with text equivalents
     */
    private static replaceKiSphereIcons(html: string): string {
        return html
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:PHY"[^>]*>.*?<\/a><\/span>/g, '[PHY]')
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:AGL"[^>]*>.*?<\/a><\/span>/g, '[AGL]')
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:STR"[^>]*>.*?<\/a><\/span>/g, '[STR]')
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:TEQ"[^>]*>.*?<\/a><\/span>/g, '[TEQ]')
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:INT"[^>]*>.*?<\/a><\/span>/g, '[INT]')
            .replace(/<span typeof="mw:File"><a href="\/wiki\/Category:Rainbow"[^>]*>.*?<\/a><\/span>/g, '[RAINBOW]');
    }

    /**
     * Safe text extraction with fallback
     */
    static extractText(element: Element | null, fallback: string = 'Error'): string {
        return element?.textContent?.trim() ?? fallback;
    }

    /**
     * Enhanced text extraction that replaces Ki sphere icons with text equivalents
     */
    static extractTextWithKiSpheres(element: Element | null, fallback: string = 'Error'): string {
        if (!element) return fallback;
        
        const html = element.innerHTML;
        const processedHtml = this.replaceKiSphereIcons(html);
        
        // Create a temporary element to extract clean text
        const tempDiv = element.ownerDocument!.createElement('div');
        tempDiv.innerHTML = processedHtml;
        
        return tempDiv.textContent?.trim() ?? fallback;
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