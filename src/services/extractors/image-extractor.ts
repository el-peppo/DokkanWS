import { DOMParserAdapter, DOMSource } from '../dom-parser-adapter.js';
import { logger } from '../../utils/logger.js';

export class ImageExtractor {
    /**
     * Extract character image URL (thumbnail)
     */
    static async extractImageURL(source: DOMSource): Promise<string> {
        try {
            // Look for character image in the main table
            const img = await DOMParserAdapter.querySelector(source, '.mw-parser-output table img, .character-image img, .infobox img');
            if (img) {
                const src = await DOMParserAdapter.extractAttribute(source, img, 'src', 'Error');
                if (src !== 'Error') {
                    return src;
                }
            }

            // Fallback: look for any image in the character section
            const fallbackSrc = await DOMParserAdapter.extractAttribute(source, 
                '.mw-parser-output img', 'src', 'Error');
            
            return fallbackSrc;
        } catch (error) {
            await logger.warn('Failed to extract image URL');
            return 'Error';
        }
    }

    /**
     * Extract full-size character image URL
     */
    static async extractFullImageURL(source: DOMSource): Promise<string> {
        try {
            const img = await DOMParserAdapter.querySelector(source, '.mw-parser-output table img, .character-image img, .infobox img');
            if (img) {
                const src = await DOMParserAdapter.extractAttribute(source, img, 'src', 'Error');
                
                // Convert thumbnail to full-size URL
                if (src && src !== 'Error') {
                    // Fandom wiki thumbnail to full-size conversion
                    let fullSizeUrl = src;
                    
                    // Remove thumbnail path and dimensions
                    fullSizeUrl = fullSizeUrl.replace('/thumb/', '/');
                    fullSizeUrl = fullSizeUrl.replace(/\/\d+px-.*$/, '');
                    
                    // Remove revision and scale parameters
                    fullSizeUrl = fullSizeUrl.split('?')[0];
                    
                    return fullSizeUrl;
                }
            }
            
            return 'Error';
        } catch (error) {
            await logger.warn('Failed to extract full image URL');
            return 'Error';
        }
    }

    /**
     * Extract character quote/flavor text (usually in title attribute or tooltip)
     */
    static async extractQuote(source: DOMSource): Promise<string> {
        try {
            // Look for quote in various locations
            const quoteSelectors = [
                'img[title]',  // Image title attribute
                '.character-quote',  // Dedicated quote element
                '.flavor-text',  // Flavor text section
                'span[title*="quote" i]',  // Elements with quote in title
                '.tooltip-content'  // Tooltip content
            ];

            for (const selector of quoteSelectors) {
                const element = await DOMParserAdapter.querySelector(source, selector);
                if (element) {
                    // Try title attribute first
                    const titleText = await DOMParserAdapter.extractAttribute(source, element, 'title', '');
                    if (titleText && titleText.length > 10) {  // Reasonable quote length
                        return titleText.trim();
                    }

                    // Try text content
                    const textContent = await DOMParserAdapter.extractText(source, selector, '');
                    if (textContent && textContent.length > 10) {
                        return textContent.trim();
                    }
                }
            }

            // Look for quote in page content sections
            const quoteText = await DOMParserAdapter.extractText(source,
                'h3:contains("Quote") + p, .quote-section, blockquote',
                'Error');

            if (quoteText !== 'Error' && quoteText.length > 5) {
                return quoteText.trim();
            }

            return 'Error';
        } catch (error) {
            await logger.debug('Failed to extract character quote');
            return 'Error';
        }
    }

    /**
     * Verify that image URLs are accessible
     */
    static async verifyImageURL(imageUrl: string): Promise<boolean> {
        try {
            if (imageUrl === 'Error' || !imageUrl.startsWith('http')) {
                return false;
            }

            // Basic URL validation
            new URL(imageUrl);
            return true;
        } catch (error) {
            await logger.debug(`Invalid image URL: ${imageUrl}`);
            return false;
        }
    }
}