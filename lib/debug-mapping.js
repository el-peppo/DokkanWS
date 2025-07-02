"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("./scraper");
const character_1 = require("./character");
async function debugMapping() {
    console.log('Debugging class/type mapping...\n');
    try {
        const categoryDoc = await (0, scraper_1.fetchFromWeb)('https://dbz-dokkanbattle.fandom.com/wiki/Category:UR');
        const firstLink = categoryDoc.querySelector('.category-page__member-link')?.getAttribute('href');
        const fullUrl = 'https://dbz-dokkanbattle.fandom.com' + firstLink;
        const doc = await (0, scraper_1.fetchFromWeb)(fullUrl);
        const titleAttr = doc.querySelector('.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(4) > center > a')?.getAttribute('title');
        console.log('Full title attribute:', titleAttr);
        if (titleAttr) {
            const afterCategory = titleAttr.split('Category:')[1];
            console.log('After "Category:":', afterCategory);
            const parts = afterCategory.split(' ');
            console.log('Split parts:', parts);
            console.log('Class part (index 0):', parts[0]);
            console.log('Type part (index 1):', parts[1]);
            console.log('\nEnum lookups:');
            console.log('Classes[parts[0]]:', character_1.Classes[parts[0]]);
            console.log('Types[parts[1]]:', character_1.Types[parts[1]]);
            console.log('\nAvailable enum values:');
            console.log('Classes:', Object.keys(character_1.Classes));
            console.log('Types:', Object.keys(character_1.Types));
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
debugMapping().catch(console.error);
//# sourceMappingURL=debug-mapping.js.map