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
            // Look for alphabetical pagination links that Fandom uses
            const allLinks = Array.from(document.querySelectorAll('a'));
            await logger.debug(`Found ${allLinks.length} total links on page`);
            const candidateLinks = [];
            // Look for all potential pagination links
            for (const link of allLinks) {
                const text = link.textContent?.trim() || '';
                const href = link.getAttribute('href') || '';
                // Collect all category links with "from" parameter for debugging
                if (href.includes(`Category:${categoryName}`) && href.includes('from=')) {
                    candidateLinks.push({ text, href });
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
                        candidateLinks.push({ text, href });
                    }
                }
            }
            // Debug logging
            if (candidateLinks.length > 0) {
                await logger.info(`Found ${candidateLinks.length} pagination candidates for ${categoryName}:`, candidateLinks.slice(0, 10));
            }
            // Make URLs absolute and filter out current URL
            const absoluteUrls = paginationUrls.map(url => url.startsWith('http') ? url : `https://dbz-dokkanbattle.fandom.com${url}`);
            const filteredUrls = absoluteUrls.filter(url => url !== currentUrl);
            if (filteredUrls.length > 0) {
                await logger.info(`Extracted ${filteredUrls.length} pagination URLs for ${categoryName}`);
            }
            return filteredUrls;
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
     * Replace Ki sphere icons with text equivalents
     */
    static replaceKiSphereIcons(html) {
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
    static extractText(element, fallback = 'Error') {
        return element?.textContent?.trim() ?? fallback;
    }
    /**
     * Enhanced text extraction that replaces Ki sphere icons with text equivalents
     */
    static extractTextWithKiSpheres(element, fallback = 'Error') {
        if (!element)
            return fallback;
        const html = element.innerHTML;
        const processedHtml = this.replaceKiSphereIcons(html);
        // Create a temporary element to extract clean text
        const tempDiv = element.ownerDocument.createElement('div');
        tempDiv.innerHTML = processedHtml;
        return tempDiv.textContent?.trim() ?? fallback;
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