/**
 * Cleans passive text from the Dokkan wiki format
 * Removes wiki formatting artifacts and normalizes text
 */
export function cleanPassiveText(text: string | null | undefined): string {
    if (!text) return 'Error';
    
    return text
        .replace(/Basic effect\(s\)-?\s*/g, '')
        .replace(/\n/g, '; ')
        .replace(/;\s*;/g, ';')
        .replace(/;$/, '')
        .replace(/^;\s*/, '')
        .replace(/-\s+/g, ' ')
        .replace(/\s+-\s+/g, '; ')
        .replace(/\s+/g, ' ')
        .replace(/\s*;\s*/g, '; ')
        .replace(/;\s*$/, '')
        .trim();
}

/**
 * Extracts and cleans character name from HTML
 */
export function extractCharacterName(html: string | undefined): string {
    if (!html) return 'Error';
    
    return html
        .split('<br>')[1]
        ?.split('</b>')[0]
        ?.replaceAll('&amp;', '&') ?? 'Error';
}

/**
 * Extracts and cleans character title from HTML
 */
export function extractCharacterTitle(html: string | undefined): string {
    if (!html) return 'Error';
    
    return html
        .split('<br>')[0]
        ?.split('<b>')[1] ?? 'Error';
}

/**
 * Safely parses integer values with fallback
 */
export function safeParseInt(value: string | null | undefined, fallback: number = 0): number {
    if (!value) return fallback;
    const parsed = parseInt(value);
    return isNaN(parsed) ? fallback : parsed;
}

/**
 * Safely extracts text content with fallback
 */
export function safeExtractText(element: Element | null, fallback: string = 'Error'): string {
    return element?.textContent?.trim() ?? fallback;
}

/**
 * Extracts array of text content from NodeList
 */
export function extractTextArray(elements: NodeListOf<Element> | null): string[] {
    if (!elements) return ['Error'];
    return Array.from(elements).map(el => el.textContent?.trim() ?? 'Error');
}