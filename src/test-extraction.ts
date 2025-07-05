#!/usr/bin/env node

import { CharacterExtractor } from './services/character-extractor.js';
import { PlaywrightClient } from './services/playwright-client.js';
import { DOMParserAdapter } from './services/dom-parser-adapter.js';
import { DEFAULT_CONFIG } from './config/scraper.config.js';
import { logger } from './utils/logger.js';

async function testExtraction() {
    console.log('🧪 Testing new Playwright extraction system...');
    
    const playwrightClient = new PlaywrightClient(DEFAULT_CONFIG);
    await playwrightClient.initialize();
    
    // Test URLs for different character types
    const testUrls = [
        'https://dbz-dokkanbattle.fandom.com/wiki/Eternal_Rival_Vegeta', // Standard character
        'https://dbz-dokkanbattle.fandom.com/wiki/Last_Resort_Majin_Vegeta', // EZA character
        'https://dbz-dokkanbattle.fandom.com/wiki/Limitless_Energy_Super_Saiyan_2_Caulifla', // LR character
    ];
    
    for (const url of testUrls) {
        try {
            console.log(`\n📄 Testing: ${url}`);
            
            const page = await playwrightClient.getPage(url);
            if (!page) {
                console.log('❌ Failed to get page');
                continue;
            }
            
            const domSource = DOMParserAdapter.fromPage(page);
            const character = await CharacterExtractor.extractCharacterData(domSource);
            
            if (character) {
                console.log(`✅ Successfully extracted: ${character.name} - ${character.title}`);
                console.log(`   Rarity: ${character.rarity}, Type: ${character.type}, Class: ${character.class}`);
                console.log(`   Leader Skill: ${character.leaderSkill?.substring(0, 50)}...`);
                console.log(`   Super Attack: ${character.superAttack?.substring(0, 50)}...`);
                console.log(`   Passive: ${character.passive?.substring(0, 50)}...`);
                console.log(`   Links: ${character.links?.length} found`);
                console.log(`   Categories: ${character.categories?.length} found`);
                console.log(`   Transformations: ${character.transformations?.length} found`);
                
                if (character.transformations && character.transformations.length > 0) {
                    character.transformations.forEach((transform, i) => {
                        console.log(`   Transform ${i + 1}: ${transform.name} - ${transform.condition}`);
                    });
                }
            } else {
                console.log('❌ Failed to extract character data');
            }
            
        } catch (error) {
            console.log(`❌ Error extracting ${url}:`, error.message);
        }
    }
    
    await playwrightClient.cleanup();
    console.log('\n🏁 Test completed!');
}

testExtraction().catch(console.error);