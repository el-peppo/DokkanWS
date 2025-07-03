import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, statSync } from 'fs';
import { JsonImporter } from './json-importer.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: npm run import-db <json-file-path>');
        console.log('       npm run import-db latest  (imports latest file from data directory)');
        console.log('       npm run import-db all     (imports all files from data directory)');
        process.exit(1);
    }

    const importer = new JsonImporter();
    
    try {
        const command = args[0];
        
        if (command === 'latest') {
            const latestFile = getLatestDataFile();
            await logger.info(`Importing latest file: ${latestFile}`);
            await importer.importFromFile(latestFile);
        } else if (command === 'all') {
            const dataFiles = getAllDataFiles();
            await logger.info(`Found ${dataFiles.length} data files to import`);
            
            for (const file of dataFiles) {
                await logger.info(`Importing: ${file}`);
                await importer.importFromFile(file);
            }
        } else {
            // Treat as file path
            const filePath = resolve(command);
            await importer.importFromFile(filePath);
        }
        
        await logger.info('Import completed successfully!');
    } catch (error) {
        await logger.error('Import failed:', {}, error as Error);
        process.exit(1);
    }
}

function getLatestDataFile(): string {
    const dataDir = resolve(__dirname, '../../data');
    const files = readdirSync(dataDir)
        .filter(file => file.endsWith('_DokkanCharacterData.json'))
        .map(file => ({
            name: file,
            path: resolve(dataDir, file),
            mtime: statSync(resolve(dataDir, file)).mtime
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    
    if (files.length === 0) {
        throw new Error('No data files found in data directory');
    }
    
    return files[0].path;
}

function getAllDataFiles(): string[] {
    const dataDir = resolve(__dirname, '../../data');
    const files = readdirSync(dataDir)
        .filter(file => file.endsWith('_DokkanCharacterData.json'))
        .map(file => resolve(dataDir, file));
    
    if (files.length === 0) {
        throw new Error('No data files found in data directory');
    }
    
    return files.sort();
}

main().catch(async (error) => {
    await logger.error('CLI failed:', {}, error as Error);
    process.exit(1);
});