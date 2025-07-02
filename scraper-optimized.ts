import axios, { AxiosError } from 'axios';
import { JSDOM } from 'jsdom';
import { Character, Rarities, Classes, Types, Transformation } from "./character";

// Connection pooling and request optimization
const httpAgent = new (require('http').Agent)({ keepAlive: true, maxSockets: 20 });
const httpsAgent = new (require('https').Agent)({ keepAlive: true, maxSockets: 20 });

const axiosInstance = axios.create({
    timeout: 10000,
    httpAgent,
    httpsAgent,
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DokkanScraper/1.0)',
    }
});

// Rate limiting and retry logic
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, maxRetries = 3): Promise<string | undefined> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.log(`Retry ${i + 1}/${maxRetries} for ${url}`);
            if (i === maxRetries - 1) {
                console.error(`Failed to fetch ${url}:`, error);
                return undefined;
            }
            await delay(1000 * (i + 1)); // Exponential backoff
        }
    }
}

function cleanPassiveText(text: string | null | undefined): string {
    if (!text) return 'Error';
    return text
        .replace(/Basic effect\(s\)-?\s*/g, '')
        .replace(/\n/g, '; ')
        .replace(/;\s*;/g, ';')
        .replace(/;$/, '')
        .replace(/^;\s*/, '')
        .replace(/-\s+/g, ' ')
        .replace(/\s+-\s+/g, '; ')
        .replace(/\s+/g, ' ')
        .replace(/\s*;\s*/g, '; ')
        .replace(/;\s*$/, '')
        .trim();
}

// Parallel category processing
export async function getAllDokkanData(): Promise<Character[]> {
    console.log('Starting parallel scrape...');
    
    const categories = [
        'UR',
        'UR?from=Evil+Pride+Frieza+(Final+Form)+(Angel)',
        'UR?from=Next-Level+Strike+Super+Saiyan+God+SS+Goku',
        'UR?from=Training+and+Refreshment+Goku',
        'LR'
    ];

    // Process all categories in parallel
    const categoryPromises = categories.map(async (category, index) => {
        console.log(`Starting category ${index + 1}/${categories.length}: ${category}`);
        const data = await getDokkanData(category);
        console.log(`Completed category ${index + 1}/${categories.length}: ${category} (${data.length} characters)`);
        return data;
    });

    const results = await Promise.all(categoryPromises);
    const allData = results.flat();
    
    console.log(`Total characters scraped: ${allData.length}`);
    return allData;
}

export async function getDokkanData(rarity: string): Promise<Character[]> {
    const document = await fetchFromWeb('https://dbz-dokkanbattle.fandom.com/wiki/Category:' + rarity);
    if (!document) return [];
    
    const links = extractLinks(document);
    console.log(`Found ${links.length} character links for ${rarity}`);

    // Process characters in batches to avoid overwhelming the server
    const batchSize = 10;
    const allCharacters: Character[] = [];

    for (let i = 0; i < links.length; i += batchSize) {
        const batch = links.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(links.length / batchSize)} for ${rarity}`);
        
        const batchPromises = batch.map(async (link, index) => {
            // Add small delay between requests to be respectful
            await delay(index * 100);
            const characterDocument = await fetchFromWeb(link);
            return characterDocument ? extractCharacterData(characterDocument) : null;
        });

        const batchResults = await Promise.all(batchPromises);
        const validCharacters = batchResults.filter(char => char !== null) as Character[];
        allCharacters.push(...validCharacters);
        
        // Small delay between batches
        await delay(500);
    }

    return allCharacters;
}

async function fetchFromWeb(url: string): Promise<Document | null> {
    const HTMLData = await fetchWithRetry(url);
    if (!HTMLData) return null;
    
    try {
        const dom = new JSDOM(HTMLData);
        return dom.window.document;
    } catch (error) {
        console.error(`Failed to parse DOM for ${url}:`, error);
        return null;
    }
}

function extractLinks(document: Document): string[] {
    const URIs: HTMLAnchorElement[] = Array.from(
        document.querySelectorAll('.category-page__member-link'),
    );
    return URIs.map(link => 'https://dbz-dokkanbattle.fandom.com'.concat(link.href));
}

// Re-export existing extractCharacterData and helper functions
export function extractCharacterData(characterDocument: Document): Character {
    const transformedCharacterData: Transformation[] = extractTransformedCharacterData(characterDocument);

    const characterData: Character = {
        name: characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr > td:nth-child(2)')?.innerHTML.split('<br>')[1].split('</b>')[0].replaceAll('&amp;', '&') ?? 'Error',
        title: characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr > td:nth-child(2)')?.innerHTML.split('<br>')[0].split('<b>')[1] ?? 'Error',
        maxLevel: parseInt((characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr:nth-child(3) > td')?.textContent?.split('/')[1] || characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr:nth-child(3) > td')?.textContent?.split('/')[0]) ?? 'Error'),
        maxSALevel: (characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr:nth-child(3) > td:nth-child(2) > center')?.textContent?.split('/')[1]?.trim() || characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr:nth-child(3) > td:nth-child(2) > center')?.innerHTML.split('>/')[1]?.trim() || characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr:nth-child(3) > td:nth-child(2) > center')?.textContent?.trim()) ?? 'Error',
        rarity: Rarities[characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr:nth-child(3) > td:nth-child(3) > center')?.querySelector('a')?.getAttribute('title')?.split('Category:')[1] ?? 'Error'],
        class: Classes[characterDocument.querySelector('.mw-parser-output')?.querySelector('table')?.querySelector('tbody')?.querySelector('tr:nth-child(3)')?.querySelector('td:nth-child(4)')?.querySelector('center')?.querySelector('a')?.getAttribute('title')?.split('Category:')[1]?.split(' ')[0] ?? 'Error'],
        type: Types[characterDocument.querySelector('.mw-parser-output')?.querySelector('table')?.querySelector('tbody')?.querySelector('tr:nth-child(3)')?.querySelector('td:nth-child(4)')?.querySelector('center')?.querySelector('a')?.getAttribute('title')?.split('Category:')[1]?.split(' ')[1] ?? 'Error'],
        cost: parseInt((characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr:nth-child(3) > td:nth-child(5) > center:nth-child(1)')?.textContent) ?? 'Error'),
        id: characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr:nth-child(3) > td:nth-child(6) > center:nth-child(1)')?.textContent ?? 'Error',
        imageURL: (characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr > td > div > img')?.getAttribute('src') || characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr > td > a')?.getAttribute('href') || characterDocument.querySelector('.mw-parser-output')?.querySelector('table > tbody > tr > td > img')?.getAttribute('src')) ?? 'Error',
        leaderSkill: characterDocument.querySelector('[data-image-name="Leader Skill.png"]')?.closest('tr')?.nextElementSibling?.textContent ?? 'Error',
        ezaLeaderSkill: characterDocument.querySelector('.ezatabber > div > div:nth-child(3) > table > tbody > tr:nth-child(2) > td')?.textContent || characterDocument.querySelector('.ezawidth [data-image-name="Leader Skill.png"]')?.closest('tr')?.nextElementSibling?.textContent || undefined,
        superAttack: characterDocument.querySelector('[data-image-name="Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent ?? 'Error',
        ezaSuperAttack: characterDocument.querySelectorAll('table.ezawidth')[1]?.querySelector('[data-image-name="Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent || characterDocument.querySelector('.ezawidth [data-image-name="Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent || undefined,
        ultraSuperAttack: characterDocument.querySelector('[data-image-name="Ultra Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent ?? undefined,
        ezaUltraSuperAttack: characterDocument.querySelectorAll('table.ezawidth')[1]?.querySelector('[data-image-name="Ultra Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent || characterDocument.querySelector('.ezawidth [data-image-name="Ultra Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent || undefined,
        passive: cleanPassiveText(characterDocument.querySelector('[data-image-name="Passive skill.png"]')?.closest('tr')?.nextElementSibling?.textContent),
        ezaPassive: cleanPassiveText(characterDocument.querySelectorAll('table.ezawidth')[1]?.querySelector('[data-image-name="Passive skill.png"]')?.closest('tr')?.nextElementSibling?.textContent) || undefined,
        activeSkill: (characterDocument.querySelector('[data-image-name="Active skill.png"]')?.closest('tr')?.nextElementSibling?.textContent || characterDocument.querySelector('[data-image-name="Active skill.png"]')?.closest('tr')?.nextElementSibling?.nextElementSibling?.textContent) ?? undefined,
        activeSkillCondition: characterDocument.querySelector('[data-image-name="Active skill.png"]')?.closest('tr')?.nextElementSibling?.nextElementSibling?.nextElementSibling?.querySelector('td > center')?.textContent ?? undefined,
        ezaActiveSkill: characterDocument.querySelectorAll('table.ezawidth')[1]?.querySelector('[data-image-name="Active skill.png"]')?.closest('tr')?.nextElementSibling?.textContent || characterDocument.querySelector('.ezawidth [data-image-name="Active skill.png"]')?.closest('tr')?.nextElementSibling?.textContent || undefined,
        ezaActiveSkillCondition: characterDocument.querySelectorAll('table.ezawidth')[1]?.querySelector('[data-image-name="Active skill.png"]')?.closest('tr')?.nextElementSibling?.nextElementSibling?.nextElementSibling?.querySelector('td > center')?.textContent || characterDocument.querySelector('.ezawidth [data-image-name="Active skill.png"]')?.closest('tr')?.nextElementSibling?.nextElementSibling?.nextElementSibling?.querySelector('td > center')?.textContent || undefined,
        transformationCondition: characterDocument.querySelector('[data-image-name="Transformation Condition.png"]')?.closest('tr')?.nextElementSibling?.querySelector('td > center')?.textContent ?? undefined,
        links: Array.from(characterDocument.querySelector('[data-image-name="Link skill.png"]')?.closest('tr')?.nextElementSibling?.querySelectorAll('span > a') ?? []).map(link => link.textContent ?? 'Error'),
        categories: Array.from(characterDocument.querySelector('[data-image-name="Category.png"]')?.closest('tr')?.nextElementSibling?.querySelectorAll('a') ?? []).map(link => link.textContent ?? 'Error'),
        kiMeter: Array.from(characterDocument.querySelector('[data-image-name="Ki meter.png"]')?.closest('tbody')?.querySelectorAll('img') ?? []).map(kiMeter => kiMeter.getAttribute('alt')?.split('.png')[0] ?? 'Error').slice(1),
        baseHP: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > center:nth-child(1)')?.textContent ?? 'Error'),
        maxLevelHP: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3) > center:nth-child(1)')?.textContent ?? 'Error'),
        freeDupeHP: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(4) > center:nth-child(1)')?.textContent ?? 'Error'),
        rainbowHP: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(5) > center:nth-child(1)')?.textContent ?? 'Error'),
        baseAttack: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > center:nth-child(1)')?.textContent ?? 'Error'),
        maxLevelAttack: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(3) > center:nth-child(1)')?.textContent ?? 'Error'),
        freeDupeAttack: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(4) > center:nth-child(1)')?.textContent ?? 'Error'),
        rainbowAttack: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(5) > center:nth-child(1)')?.textContent ?? 'Error'),
        baseDefence: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > center:nth-child(1)')?.textContent ?? 'Error'),
        maxDefence: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(3) > center:nth-child(1)')?.textContent ?? 'Error'),
        freeDupeDefence: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(4) > center:nth-child(1)')?.textContent ?? 'Error'),
        rainbowDefence: parseInt(characterDocument.querySelector('.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(5) > center:nth-child(1)')?.textContent ?? 'Error'),
        kiMultiplier: (characterDocument.querySelector('.righttablecard > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)')?.innerHTML.split('► ')[1].split('<br>')[0].concat('; ', characterDocument.querySelector('.righttablecard > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)')?.innerHTML.split('<br>► ')[1] ?? '').replace('<a href="/wiki/Super_Attack_Multipliers" title="Super Attack Multipliers">SA Multiplier</a>', 'SA Multiplier') ?? characterDocument.querySelector('.righttablecard')?.nextElementSibling?.querySelector('tr:nth-child(2) > td')?.textContent?.split('► ')[1]) ?? 'Error',
        transformations: transformedCharacterData
    }
    return characterData
}

function extractTransformedCharacterData(characterDocument: Document): Transformation[] {
    const transformedArray: Transformation[] = []
    const transformCount = characterDocument.querySelectorAll('.mw-parser-output > div:nth-child(2) > div > ul > li').length

    for (let index = 1; index < transformCount; index++) {
        const transformationData: Transformation = {
            transformedName: characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2}) > table > tbody > tr > td:nth-child(2)`)?.innerHTML.split('<br>')[1].split('</b>')[0].replaceAll('&amp;', '&') ?? 'Error',
            transformedID: characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2}) > table > tbody > tr:nth-child(3) > td:nth-child(6)`)?.textContent ?? 'Error',
            transformedClass: Classes[characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('table')?.querySelector('tbody')?.querySelector('tr:nth-child(3)')?.querySelector('td:nth-child(4)')?.querySelector('center')?.querySelector('a')?.getAttribute('title')?.split('Category:')[1]?.split(' ')[0] ?? 'Error'],
            transformedType: Types[characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('table')?.querySelector('tbody')?.querySelector('tr:nth-child(3)')?.querySelector('td:nth-child(4)')?.querySelector('center')?.querySelector('a')?.getAttribute('title')?.split('Category:')[1]?.split(' ')[1] ?? 'Error'],
            transformedSuperAttack: characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('[data-image-name="Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent ?? 'Error',
            transformedEZASuperAttack: characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('.righttablecard > table > tbody > tr > td > div > div > div:nth-child(3)')?.querySelector('[data-image-name="Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent || characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('.ezawidth [data-image-name="Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent || undefined,
            transformedUltraSuperAttack: characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('[data-image-name="Ultra Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent ?? undefined,
            transformedEZAUltraSuperAttack: characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('.righttablecard > table > tbody > tr > td > div > div > div:nth-child(3)')?.querySelector('[data-image-name="Ultra Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent || characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('.ezawidth [data-image-name="Ultra Super atk.png"]')?.closest('tr')?.nextElementSibling?.textContent || undefined,
            transformedPassive: cleanPassiveText(characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('[data-image-name="Passive skill.png"]')?.closest('tr')?.nextElementSibling?.textContent),
            transformedEZAPassive: cleanPassiveText(characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('.righttablecard > table > tbody > tr > td > div > div > div:nth-child(3)')?.querySelector('[data-image-name="Passive skill.png"]')?.closest('tr')?.nextElementSibling?.textContent) || undefined,
            transformedActiveSkill: characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('[data-image-name="Active skill.png"]')?.closest('tr')?.nextElementSibling?.textContent ?? undefined,
            transformedActiveSkillCondition: characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('[data-image-name="Activation Condition.png"]')?.closest('tr')?.nextElementSibling?.textContent ?? undefined,
            transformedLinks: Array.from(characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`)?.querySelector('[data-image-name="Link skill.png"]')?.closest('tr')?.nextElementSibling?.querySelectorAll('span > a') ?? []).map(link => link.textContent ?? 'Error'),
            transformedImageURL: characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2}) > table > tbody > tr > td > div > img`)?.getAttribute('src') ?? characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2}) > table > tbody > tr > td > a`)?.getAttribute('href') ?? characterDocument.querySelector(`.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2}) > table > tbody > tr > td > img`)?.getAttribute('src'),
        }
        transformedArray.push(transformationData)
    }
    return transformedArray
}