import { JSDOM } from 'jsdom';
import { Page } from 'playwright';
import { logger } from '../utils/logger.js';
import { PlaywrightParser } from './playwright-parser.js';

export type DOMSource = Document | Page;
export type ElementSource = Element | any; // Playwright element handle

export class DOMParserAdapter {
    private static playwrightParser: PlaywrightParser | null = null;

    /**
     * Initialize Playwright parser for enhanced functionality
     */
    static async initializePlaywright(playwrightParser: PlaywrightParser): Promise<void> {
        this.playwrightParser = playwrightParser;
    }

    /**
     * Parse HTML string into DOM Document or Page
     */
    static async parseHTML(html: string, usePlaywright: boolean = false): Promise<Document | Page | null> {
        try {
            if (usePlaywright && this.playwrightParser) {
                return await this.playwrightParser.parseHTML(html);
            } else {
                const dom = new JSDOM(html);
                return dom.window.document;
            }
        } catch (error) {
            await logger.error('Failed to parse HTML:', {}, error as Error);
            return null;
        }
    }

    /**
     * Extract character page links from category page
     */
    static async extractCharacterLinks(source: DOMSource, baseUrl: string): Promise<string[]> {
        try {
            if (this.isPlaywrightPage(source)) {
                return await this.playwrightParser!.extractCharacterLinks(source, baseUrl);
            } else {
                const linkElements: HTMLAnchorElement[] = Array.from(
                    source.querySelectorAll('.category-page__member-link')
                );
                return linkElements.map(link => baseUrl + link.href);
            }
        } catch (error) {
            await logger.error('Failed to extract character links:', {}, error as Error);
            return [];
        }
    }

    /**
     * Detect pagination on category pages and return next page URLs
     */
    static async extractPaginationUrls(source: DOMSource, currentUrl: string): Promise<string[]> {
        try {
            if (this.isPlaywrightPage(source)) {
                return await this.playwrightParser!.extractPaginationUrls(source, currentUrl);
            } else {
                return await this.extractPaginationUrlsFromDocument(source as Document, currentUrl);
            }
        } catch (error) {
            await logger.error('Failed to extract pagination URLs:', { currentUrl }, error as Error);
            return [];
        }
    }

    /**
     * Extract pagination URLs from JSDOM document (legacy method)
     */
    private static async extractPaginationUrlsFromDocument(document: Document, currentUrl: string): Promise<string[]> {
        const paginationUrls: string[] = [];
        
        try {
            const categoryName = currentUrl.split('/Category:')[1]?.split('?')[0];
            if (!categoryName) return [];

            const allLinks = Array.from(document.querySelectorAll('a'));
            const candidateLinks: Array<{text: string, href: string}> = [];
            
            for (const link of allLinks) {
                const text = link.textContent?.trim() || '';
                const href = link.getAttribute('href') || '';
                
                if (href.includes(`Category:${categoryName}`) && href.includes('from=')) {
                    candidateLinks.push({text, href});
                    
                    if (!paginationUrls.includes(href)) {
                        paginationUrls.push(href);
                    }
                }
                
                const lowerText = text.toLowerCase();
                if ((lowerText.includes('next') || lowerText.includes('200')) && 
                    href.includes(`Category:${categoryName}`)) {
                    if (!paginationUrls.includes(href)) {
                        paginationUrls.push(href);
                        candidateLinks.push({text, href});
                    }
                }
            }
            
            if (candidateLinks.length > 0) {
                await logger.info(`Found ${candidateLinks.length} pagination candidates for ${categoryName}:`, candidateLinks.slice(0, 10));
            }

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
    static async querySelector(source: DOMSource, selector: string): Promise<ElementSource | null> {
        if (!source) return null;
        
        try {
            if (this.isPlaywrightPage(source)) {
                return await this.playwrightParser!.querySelector(source, selector);
            } else {
                return source.querySelector(selector);
            }
        } catch (error) {
            await logger.warn(`Invalid selector "${selector}":`, { selector });
            return null;
        }
    }

    /**
     * Safely query multiple elements
     */
    static async querySelectorAll(source: DOMSource, selector: string): Promise<ElementSource[] | null> {
        if (!source) return null;
        
        try {
            if (this.isPlaywrightPage(source)) {
                return await this.playwrightParser!.querySelectorAll(source, selector);
            } else {
                return Array.from(source.querySelectorAll(selector));
            }
        } catch (error) {
            await logger.warn(`Invalid selector "${selector}":`, { selector });
            return null;
        }
    }

    /**
     * Safe text extraction with fallback
     */
    static async extractText(source: DOMSource, selectorOrElement: string | any, fallback: string = 'Error'): Promise<string> {
        try {
            if (this.isPlaywrightPage(source)) {
                // For Playwright, we expect a selector string
                if (typeof selectorOrElement === 'string') {
                    return await this.playwrightParser!.extractText(source, selectorOrElement, fallback);
                } else {
                    // If it's an element handle, extract text from it
                    const text = await selectorOrElement.textContent();
                    return text?.trim() || fallback;
                }
            } else {
                // For JSDOM, handle both selector strings and elements
                if (typeof selectorOrElement === 'string') {
                    const element = source.querySelector(selectorOrElement);
                    return element?.textContent?.trim() ?? fallback;
                } else {
                    return selectorOrElement?.textContent?.trim() ?? fallback;
                }
            }
        } catch (error) {
            return fallback;
        }
    }

    /**
     * Enhanced text extraction that replaces Ki sphere icons with text equivalents
     */
    static async extractTextWithKiSpheres(source: DOMSource, selector: string, fallback: string = 'Error'): Promise<string> {
        try {
            if (this.isPlaywrightPage(source)) {
                return await this.playwrightParser!.extractTextWithKiSpheres(source, selector, fallback);
            } else {
                const element = source.querySelector(selector);
                if (!element) return fallback;
                
                const html = element.innerHTML;
                const processedHtml = this.replaceKiSphereIcons(html);
                
                const tempDiv = source.createElement('div');
                tempDiv.innerHTML = processedHtml;
                
                return tempDiv.textContent?.trim() ?? fallback;
            }
        } catch (error) {
            return fallback;
        }
    }

    /**
     * Safe attribute extraction with fallback
     */
    static async extractAttribute(source: DOMSource, selector: string, attribute: string, fallback: string = 'Error'): Promise<string> {
        try {
            if (this.isPlaywrightPage(source)) {
                return await this.playwrightParser!.extractAttribute(source, selector, attribute, fallback);
            } else {
                const element = source.querySelector(selector);
                return element?.getAttribute(attribute) ?? fallback;
            }
        } catch (error) {
            return fallback;
        }
    }

    /**
     * Safe HTML extraction with fallback
     */
    static async extractHTML(source: DOMSource, selector: string, fallback: string = 'Error'): Promise<string> {
        try {
            if (this.isPlaywrightPage(source)) {
                const element = await source.$(selector);
                if (element) {
                    return await element.innerHTML() || fallback;
                }
                return fallback;
            } else {
                const element = source.querySelector(selector);
                return element?.innerHTML ?? fallback;
            }
        } catch (error) {
            return fallback;
        }
    }

    /**
     * Extract array of text content from elements
     */
    static async extractTextArray(source: DOMSource, selector: string): Promise<string[]> {
        try {
            if (this.isPlaywrightPage(source)) {
                return await this.playwrightParser!.extractTextArray(source, selector);
            } else {
                const elements = Array.from(source.querySelectorAll(selector));
                return elements.map(el => el.textContent?.trim() || '');
            }
        } catch (error) {
            return ['Error'];
        }
    }

    /**
     * Find element by image data attribute (common pattern in Dokkan wiki)
     */
    static async findByImageName(source: DOMSource, imageName: string): Promise<ElementSource | null> {
        return await this.querySelector(source, `[data-image-name="${imageName}"]`);
    }

    /**
     * Find the next sibling element of a given element
     */
    static async getNextSibling(element: ElementSource): Promise<ElementSource | null> {
        try {
            if (this.isPlaywrightElement(element)) {
                // For Playwright elements, we need to navigate differently
                return await element.evaluateHandle((el: Element) => el.nextElementSibling);
            } else {
                return element?.nextElementSibling ?? null;
            }
        } catch (error) {
            return null;
        }
    }

    /**
     * Find closest ancestor element matching selector
     */
    static async findClosest(element: ElementSource, selector: string): Promise<ElementSource | null> {
        try {
            if (this.isPlaywrightElement(element)) {
                return await element.evaluateHandle((el: Element, sel: string) => el.closest(sel), selector);
            } else {
                return element?.closest(selector) ?? null;
            }
        } catch (error) {
            await logger.warn(`Invalid closest selector "${selector}":`, { selector });
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
     * Type guard to check if source is a Playwright Page
     */
    private static isPlaywrightPage(source: any): source is Page {
        return source && typeof source.goto === 'function' && typeof source.$ === 'function';
    }

    /**
     * Type guard to check if element is a Playwright element handle
     */
    private static isPlaywrightElement(element: any): boolean {
        return element && typeof element.evaluateHandle === 'function';
    }

    /**
     * Wait for element to be visible (Playwright only)
     */
    static async waitForElement(source: DOMSource, selector: string, timeout: number = 10000): Promise<boolean> {
        if (this.isPlaywrightPage(source) && this.playwrightParser) {
            return await this.playwrightParser.waitForElement(source, selector, timeout);
        }
        return true; // For JSDOM, elements are immediately available
    }

    /**
     * Take screenshot (Playwright only)
     */
    static async takeScreenshot(source: DOMSource, filename: string): Promise<void> {
        if (this.isPlaywrightPage(source) && this.playwrightParser) {
            await this.playwrightParser.takeScreenshot(source, filename);
        }
    }

    /**
     * Close page if it's a Playwright page
     */
    static async closePage(source: DOMSource): Promise<void> {
        if (this.isPlaywrightPage(source) && this.playwrightParser) {
            await this.playwrightParser.closePage(source);
        }
    }
}