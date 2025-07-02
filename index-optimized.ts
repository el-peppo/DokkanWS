import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { getAllDokkanData } from "./scraper-optimized";

export async function saveDokkanResultsOptimized() {
    const startTime = Date.now();
    console.log('Starting optimized parallel scrape...');
    
    try {
        const allData = await getAllDokkanData();
        
        const currentDate = new Date();
        const day = ("0" + currentDate.getUTCDate()).slice(-2);
        const month = ("0" + currentDate.getUTCMonth() + 1).slice(-2);
        const year = currentDate.getUTCFullYear();
        
        const fileName = `${year}${month}${day}DokkanCharacterData`;
        await saveData(fileName, allData);
        
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        
        console.log(`✅ Scraping completed successfully!`);
        console.log(`📊 Total characters: ${allData.length}`);
        console.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`);
        console.log(`📁 Saved to: ./data/${fileName}.json`);
        
    } catch (error) {
        console.error('❌ Scraping failed:', error);
        throw error;
    }
}

async function saveData(fileName: string, data: unknown) {
    if (!existsSync(resolve(__dirname, 'data'))) {
        mkdirSync('data');
    }
    
    await writeFile(
        resolve(__dirname, `data/${fileName}.json`),
        JSON.stringify(data, null, 2), // Pretty print JSON
        { encoding: 'utf8' }
    );
}

// Run if called directly
if (require.main === module) {
    saveDokkanResultsOptimized().catch(console.error);
}