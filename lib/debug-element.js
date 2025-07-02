"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("./scraper");
async function debugElement() {
    try {
        const categoryDoc = await (0, scraper_1.fetchFromWeb)('https://dbz-dokkanbattle.fandom.com/wiki/Category:UR');
        const firstLink = categoryDoc.querySelector('.category-page__member-link')?.getAttribute('href');
        const fullUrl = 'https://dbz-dokkanbattle.fandom.com' + firstLink;
        console.log('Character URL:', fullUrl);
        const doc = await (0, scraper_1.fetchFromWeb)(fullUrl);
        // Test all possible selectors step by step
        console.log('\n=== STEP BY STEP SELECTOR DEBUG ===');
        const mwOutput = doc.querySelector('.mw-parser-output');
        console.log('1. .mw-parser-output found:', !!mwOutput);
        const table = mwOutput?.querySelector('table');
        console.log('2. table found:', !!table);
        const tbody = table?.querySelector('tbody');
        console.log('3. tbody found:', !!tbody);
        const row3 = tbody?.querySelector('tr:nth-child(3)');
        console.log('4. tr:nth-child(3) found:', !!row3);
        const col4 = row3?.querySelector('td:nth-child(4)');
        console.log('5. td:nth-child(4) found:', !!col4);
        const center = col4?.querySelector('center');
        console.log('6. center found:', !!center);
        const link = center?.querySelector('a');
        console.log('7. a found:', !!link);
        if (link) {
            console.log('8. title attribute:', link.getAttribute('title'));
            console.log('9. href attribute:', link.getAttribute('href'));
            console.log('10. text content:', link.textContent);
        }
        // Also check the full working selector from earlier debug
        const directSelector = doc.querySelector('.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(4) > center > a');
        console.log('\nDirect selector result:', !!directSelector);
        if (directSelector) {
            console.log('Direct selector title:', directSelector.getAttribute('title'));
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
debugElement().catch(console.error);
//# sourceMappingURL=debug-element.js.map