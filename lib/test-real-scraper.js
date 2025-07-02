"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("./scraper");
async function testRealScraper() {
    console.log('Testing scraper with real UR characters (first 10)...\n');
    try {
        // Get first 10 UR characters from the actual category page
        const characters = await (0, scraper_1.getDokkanData)('UR');
        const first10 = characters.slice(0, 10);
        console.log(`🎯 Successfully scraped ${first10.length}/10 characters from UR category\n`);
        let validCount = 0;
        first10.forEach((char, index) => {
            const hasValidData = char.name !== 'Error' && char.title !== 'Error' &&
                char.class !== undefined && char.type !== undefined;
            if (hasValidData)
                validCount++;
            console.log(`${index + 1}. ${char.name} - ${char.title}`);
            console.log(`   Class: ${char.class || 'N/A'}, Type: ${char.type || 'N/A'}, Rarity: ${char.rarity || 'N/A'}`);
            console.log(`   Status: ${hasValidData ? '✅ Valid' : '❌ Missing data'}`);
            console.log(`   Passive: ${char.passive.substring(0, 60)}...`);
            console.log('');
        });
        console.log(`📊 Data Quality: ${validCount}/10 characters have complete core data`);
        console.log(`📈 Success Rate: ${(validCount / 10 * 100).toFixed(1)}%`);
        return first10;
    }
    catch (error) {
        console.error('❌ Error during scraping:', error);
        return [];
    }
}
testRealScraper().catch(console.error);
//# sourceMappingURL=test-real-scraper.js.map