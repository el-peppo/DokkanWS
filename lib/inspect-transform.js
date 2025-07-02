"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("./scraper");
async function inspectTransformCharacter() {
    console.log('🔄 Inspecting transformation character DOM structure...\n');
    try {
        const url = 'https://dbz-dokkanbattle.fandom.com/wiki/Divine_Warriors_with_Infinite_Power_Super_Saiyan_God_Goku_%26_Super_Saiyan_God_Vegeta';
        console.log(`Analyzing: ${url.split('/').pop()}\n`);
        const doc = await (0, scraper_1.fetchFromWeb)(url);
        // Check transformation structure
        console.log('🔄 TRANSFORMATION STRUCTURE:');
        const transformTabs = doc.querySelectorAll('.mw-parser-output > div:nth-child(2) > div > ul > li');
        console.log(`Found ${transformTabs.length} transformation tabs`);
        if (transformTabs.length > 1) {
            transformTabs.forEach((tab, index) => {
                console.log(`Tab ${index}: ${tab.textContent?.trim()}`);
            });
            // Check first transformation (div:nth-child(3) since tabs are in div:nth-child(2))
            console.log('\n📋 FIRST TRANSFORMATION TABLE:');
            const transform1Div = doc.querySelector('.mw-parser-output > div:nth-child(2) > div:nth-child(3)');
            if (transform1Div) {
                console.log('Transform div found');
                const transformTable = transform1Div.querySelector('table');
                if (transformTable) {
                    console.log('Transform table found');
                    const transformRows = transformTable.querySelectorAll('tbody > tr');
                    console.log(`Transform table has ${transformRows.length} rows`);
                    if (transformRows.length >= 3) {
                        const transformRow3 = transformRows[2]; // 0-indexed
                        const transformCells = transformRow3.querySelectorAll('td');
                        console.log(`Transform row 3 has ${transformCells.length} cells`);
                        if (transformCells.length >= 4) {
                            const transformCell4 = transformCells[3];
                            console.log(`Transform cell 4 content: ${transformCell4.innerHTML.substring(0, 200)}...`);
                            const transformLink = transformCell4.querySelector('center a');
                            if (transformLink) {
                                console.log(`Transform link title: "${transformLink.getAttribute('title')}"`);
                            }
                            else {
                                console.log('❌ No link found in transform cell 4');
                                // Try alternative selector
                                const altLink = transformCell4.querySelector('a');
                                if (altLink) {
                                    console.log(`Alternative link title: "${altLink.getAttribute('title')}"`);
                                }
                            }
                        }
                    }
                }
                else {
                    console.log('❌ Transform table not found');
                }
            }
            else {
                console.log('❌ Transform div not found');
            }
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
inspectTransformCharacter().catch(console.error);
//# sourceMappingURL=inspect-transform.js.map