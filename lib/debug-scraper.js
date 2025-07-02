"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("./scraper");
async function debugCharacterStructure() {
    console.log('Debugging character page structure...\n');
    try {
        // Get first character from UR category
        const categoryDoc = await (0, scraper_1.fetchFromWeb)('https://dbz-dokkanbattle.fandom.com/wiki/Category:UR');
        const firstLink = categoryDoc.querySelector('.category-page__member-link')?.getAttribute('href');
        if (!firstLink) {
            console.log('No character links found');
            return;
        }
        const fullUrl = 'https://dbz-dokkanbattle.fandom.com' + firstLink;
        console.log(`Analyzing: ${fullUrl}\n`);
        const doc = await (0, scraper_1.fetchFromWeb)(fullUrl);
        // Debug class and type selectors
        console.log('=== DEBUGGING CLASS & TYPE EXTRACTION ===');
        const selector1 = '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(4) > center:nth-child(1) > a:nth-child(1)';
        const selector2 = '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(4) > center > a';
        const selector3 = '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(4)';
        console.log('Selector 1 result:', doc.querySelector(selector1)?.getAttribute('title'));
        console.log('Selector 2 result:', doc.querySelector(selector2)?.getAttribute('title'));
        // Check what's actually in the 4th column
        const fourthColumn = doc.querySelector(selector3);
        console.log('Fourth column HTML:', fourthColumn?.innerHTML?.substring(0, 200));
        // Try different approaches
        const allLinksInFourthColumn = fourthColumn?.querySelectorAll('a');
        console.log('All links in 4th column:');
        allLinksInFourthColumn?.forEach((link, index) => {
            console.log(`  Link ${index}: ${link.getAttribute('title')} | ${link.textContent}`);
        });
        console.log('\n=== COMPLETE TABLE ROW 3 STRUCTURE ===');
        const row3 = doc.querySelector('.mw-parser-output table > tbody > tr:nth-child(3)');
        console.log('Row 3 HTML:', row3?.innerHTML?.substring(0, 500));
    }
    catch (error) {
        console.error('Error:', error);
    }
}
debugCharacterStructure().catch(console.error);
//# sourceMappingURL=debug-scraper.js.map