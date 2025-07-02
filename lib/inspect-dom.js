"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("./scraper");
async function inspectCurrentDOM() {
    console.log('🔍 Inspecting current website DOM structure...\n');
    try {
        // Get a specific character that's used in tests
        const testUrls = [
            'https://dbz-dokkanbattle.fandom.com/wiki/Limitless_Radiance_Super_Vegito',
            'https://dbz-dokkanbattle.fandom.com/wiki/The_Warriors_Sent_by_God_Ultimate_Gohan'
        ];
        for (const url of testUrls) {
            console.log(`\n=== ANALYZING: ${url.split('/').pop()} ===`);
            try {
                const doc = await (0, scraper_1.fetchFromWeb)(url);
                // Check main table structure
                console.log('\n📋 MAIN TABLE STRUCTURE:');
                const tables = doc.querySelectorAll('.mw-parser-output table');
                console.log(`Found ${tables.length} tables in .mw-parser-output`);
                if (tables.length > 0) {
                    const mainTable = tables[0];
                    const rows = mainTable.querySelectorAll('tbody > tr');
                    console.log(`Main table has ${rows.length} rows`);
                    // Check row 3 (where class/type should be)
                    if (rows.length >= 3) {
                        const row3 = rows[2]; // 0-indexed
                        const cells = row3.querySelectorAll('td');
                        console.log(`Row 3 has ${cells.length} cells`);
                        if (cells.length >= 4) {
                            const cell4 = cells[3]; // 0-indexed (4th cell)
                            console.log(`Cell 4 content: ${cell4.innerHTML.substring(0, 200)}...`);
                            const link = cell4.querySelector('a');
                            if (link) {
                                console.log(`Class/Type link title: "${link.getAttribute('title')}"`);
                                console.log(`Class/Type link href: "${link.getAttribute('href')}"`);
                            }
                            else {
                                console.log('❌ No link found in cell 4');
                            }
                        }
                    }
                }
                // Check SA Level extraction (cell 2)
                console.log('\n🎯 SA LEVEL EXTRACTION:');
                const saCell = doc.querySelector('.mw-parser-output table tbody tr:nth-child(3) td:nth-child(2) center');
                if (saCell) {
                    console.log(`SA Cell innerHTML: "${saCell.innerHTML}"`);
                    console.log(`SA Cell textContent: "${saCell.textContent}"`);
                }
                else {
                    console.log('❌ SA cell not found');
                }
                // Check passive skill extraction
                console.log('\n🧠 PASSIVE SKILL EXTRACTION:');
                const passiveImg = doc.querySelector('[data-image-name="Passive skill.png"]');
                if (passiveImg) {
                    const passiveRow = passiveImg.closest('tr')?.nextElementSibling;
                    if (passiveRow) {
                        const passiveText = passiveRow.textContent?.substring(0, 100);
                        console.log(`Passive text: "${passiveText}..."`);
                    }
                    else {
                        console.log('❌ Passive row not found');
                    }
                }
                else {
                    console.log('❌ Passive skill image not found');
                }
                // Check transformation structure if exists
                console.log('\n🔄 TRANSFORMATION STRUCTURE:');
                const transformTabs = doc.querySelectorAll('.mw-parser-output > div:nth-child(2) > div > ul > li');
                console.log(`Found ${transformTabs.length} transformation tabs`);
                if (transformTabs.length > 1) {
                    // Check first transformation (index 1, since 0 is base form)
                    const transform1 = doc.querySelector('.mw-parser-output > div:nth-child(2) > div:nth-child(3)');
                    if (transform1) {
                        const transformTable = transform1.querySelector('table');
                        if (transformTable) {
                            const transformRow3 = transformTable.querySelector('tbody > tr:nth-child(3)');
                            const transformCell4 = transformRow3?.querySelector('td:nth-child(4)');
                            if (transformCell4) {
                                console.log(`Transform cell 4 content: ${transformCell4.innerHTML.substring(0, 150)}...`);
                                const transformLink = transformCell4.querySelector('a');
                                if (transformLink) {
                                    console.log(`Transform link title: "${transformLink.getAttribute('title')}"`);
                                }
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.log(`❌ Error analyzing ${url}: ${error}`);
            }
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
inspectCurrentDOM().catch(console.error);
//# sourceMappingURL=inspect-dom.js.map