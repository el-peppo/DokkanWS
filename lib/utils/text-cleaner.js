/**
 * Cleans passive text from the Dokkan wiki format
 * Removes wiki formatting artifacts and normalizes text
 */
export function cleanPassiveText(text) {
    if (!text)
        return 'Error';
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
export function extractCharacterName(html) {
    if (!html)
        return 'Error';
    return html
        .split('<br>')[1]
        ?.split('</b>')[0]
        ?.replaceAll('&amp;', '&') ?? 'Error';
}
/**
 * Extracts and cleans character title from HTML
 */
export function extractCharacterTitle(html) {
    if (!html)
        return 'Error';
    return html
        .split('<br>')[0]
        ?.split('<b>')[1] ?? 'Error';
}
/**
 * Safely parses integer values with fallback
 */
export function safeParseInt(value, fallback = 0) {
    if (!value)
        return fallback;
    const parsed = parseInt(value);
    return isNaN(parsed) ? fallback : parsed;
}
/**
 * Safely extracts text content with fallback
 */
export function safeExtractText(element, fallback = 'Error') {
    return element?.textContent?.trim() ?? fallback;
}
/**
 * Extracts array of text content from NodeList
 */
export function extractTextArray(elements) {
    if (!elements)
        return ['Error'];
    return Array.from(elements).map(el => el.textContent?.trim() ?? 'Error');
}
//# sourceMappingURL=text-cleaner.js.map