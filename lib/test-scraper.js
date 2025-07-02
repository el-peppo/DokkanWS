"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("./scraper");
async function testScraperWith10Characters() {
    console.log('Testing scraper with 10 specific characters...');
    const testCharacterUrls = [
        'https://dbz-dokkanbattle.fandom.com/wiki/Miraculous_Final_Technique_Super_Saiyan_Goku',
        'https://dbz-dokkanbattle.fandom.com/wiki/Extreme_Elite%27s_Pride_Vegeta',
        'https://dbz-dokkanbattle.fandom.com/wiki/The_Paramount_Saiyan_Super_Saiyan_4_Goku',
        'https://dbz-dokkanbattle.fandom.com/wiki/Invincible_Saiyan_Super_Saiyan_4_Vegeta',
        'https://dbz-dokkanbattle.fandom.com/wiki/Divine_Warriors_with_Infinite_Power_Super_Saiyan_God_SS_Goku_%26_Super_Saiyan_God_SS_Vegeta',
        'https://dbz-dokkanbattle.fandom.com/wiki/Legendary_Super_Saiyan_Super_Saiyan_Broly',
        'https://dbz-dokkanbattle.fandom.com/wiki/Furious_Limit_Breaker_Super_Saiyan_2_Caulifla',
        'https://dbz-dokkanbattle.fandom.com/wiki/Universe%27s_Last_Hope_Super_Saiyan_3_Goku_(Angel)',
        'https://dbz-dokkanbattle.fandom.com/wiki/Transcended_Warrior_Super_Saiyan_God_SS_Goku',
        'https://dbz-dokkanbattle.fandom.com/wiki/Limitless_Radiance_Super_Vegito'
    ];
    const results = [];
    for (let i = 0; i < testCharacterUrls.length; i++) {
        try {
            console.log(`\nScraping character ${i + 1}/10: ${testCharacterUrls[i].split('/').pop()}`);
            const document = await (0, scraper_1.fetchFromWeb)(testCharacterUrls[i]);
            const characterData = (0, scraper_1.extractCharacterData)(document);
            console.log(`✅ ${characterData.name} - ${characterData.title}`);
            console.log(`   Class: ${characterData.class}, Type: ${characterData.type}, Rarity: ${characterData.rarity}`);
            console.log(`   Passive: ${characterData.passive.substring(0, 80)}...`);
            results.push(characterData);
        }
        catch (error) {
            console.log(`❌ Failed to scrape character ${i + 1}: ${error}`);
        }
    }
    console.log(`\n🎯 Successfully scraped ${results.length}/10 characters`);
    console.log(`📊 Success rate: ${(results.length / 10 * 100).toFixed(1)}%`);
    return results;
}
testScraperWith10Characters().catch(console.error);
//# sourceMappingURL=test-scraper.js.map