import { Character, Classes, Types, Rarities, Transformation } from '../types/character.js';
import { DOMParser } from './dom-parser.js';
import { cleanPassiveText, extractCharacterName, extractCharacterTitle, safeParseInt } from '../utils/text-cleaner.js';
import { logger } from '../utils/logger.js';

export class CharacterExtractor {
    /**
     * Extract complete character data from character page DOM
     */
    static async extractCharacterData(document: Document): Promise<Character | null> {
        try {
            const transformations = await this.extractTransformations(document);
            
            // Main character card selection
            const mainTable = DOMParser.querySelector(document, '.mw-parser-output table');
            if (!mainTable) {
                await logger.warn('Main character table not found');
                return null;
            }

            const character: Character = {
                name: this.extractName(document),
                title: this.extractTitle(document),
                maxLevel: this.extractMaxLevel(document),
                maxSALevel: this.extractMaxSALevel(document),
                rarity: this.extractRarity(document),
                class: this.extractClass(document),
                type: this.extractType(document),
                cost: this.extractCost(document),
                id: this.extractId(document),
                imageURL: this.extractImageURL(document),
                fullImageURL: this.extractFullImageURL(document),
                leaderSkill: this.extractLeaderSkill(document),
                ezaLeaderSkill: this.extractEZALeaderSkill(document),
                sezaLeaderSkill: this.extractSEZALeaderSkill(document),
                superAttack: this.extractSuperAttack(document),
                ezaSuperAttack: this.extractEZASuperAttack(document),
                sezaSuperAttack: this.extractSEZASuperAttack(document),
                ultraSuperAttack: this.extractUltraSuperAttack(document),
                ezaUltraSuperAttack: this.extractEZAUltraSuperAttack(document),
                sezaUltraSuperAttack: this.extractSEZAUltraSuperAttack(document),
                passive: this.extractPassive(document),
                ezaPassive: this.extractEZAPassive(document),
                sezaPassive: this.extractSEZAPassive(document),
                activeSkill: this.extractActiveSkill(document),
                activeSkillCondition: this.extractActiveSkillCondition(document),
                ezaActiveSkill: this.extractEZAActiveSkill(document),
                ezaActiveSkillCondition: this.extractEZAActiveSkillCondition(document),
                sezaActiveSkill: this.extractSEZAActiveSkill(document),
                sezaActiveSkillCondition: this.extractSEZAActiveSkillCondition(document),
                standbySkill: this.extractStandbySkill(document),
                standbySkillCondition: this.extractStandbySkillCondition(document),
                transformationCondition: this.extractTransformationCondition(document),
                links: this.extractLinks(document),
                categories: this.extractCategories(document),
                kiMeter: this.extractKiMeter(document),
                baseHP: this.extractBaseStat(document, 'HP', 2),
                maxLevelHP: this.extractBaseStat(document, 'HP', 3),
                freeDupeHP: this.extractBaseStat(document, 'HP', 4),
                rainbowHP: this.extractBaseStat(document, 'HP', 5),
                baseAttack: this.extractBaseStat(document, 'Attack', 2),
                maxLevelAttack: this.extractBaseStat(document, 'Attack', 3),
                freeDupeAttack: this.extractBaseStat(document, 'Attack', 4),
                rainbowAttack: this.extractBaseStat(document, 'Attack', 5),
                baseDefence: this.extractBaseStat(document, 'Defence', 2),
                maxDefence: this.extractBaseStat(document, 'Defence', 3),
                freeDupeDefence: this.extractBaseStat(document, 'Defence', 4),
                rainbowDefence: this.extractBaseStat(document, 'Defence', 5),
                kiMultiplier: this.extractKiMultiplier(document),
                ki12Multiplier: this.extractKi12Multiplier(document),
                ki18Multiplier: this.extractKi18Multiplier(document),
                ki24Multiplier: this.extractKi24Multiplier(document),
                transformations: transformations.length > 0 ? transformations : undefined
            };

            return character;
        } catch (error) {
            await logger.error('Error extracting character data:', {}, error as Error);
            return null;
        }
    }

    private static extractName(document: Document): string {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr > td:nth-child(2)');
        const html = DOMParser.extractHTML(element);
        return extractCharacterName(html);
    }

    private static extractTitle(document: Document): string {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr > td:nth-child(2)');
        const html = DOMParser.extractHTML(element);
        return extractCharacterTitle(html);
    }

    private static extractMaxLevel(document: Document): number {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td');
        const text = DOMParser.extractText(element);
        const levelText = text.split('/')[1] || text.split('/')[0];
        return safeParseInt(levelText);
    }

    private static extractMaxSALevel(document: Document): string {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(2) > center');
        const text = DOMParser.extractText(element);
        const html = DOMParser.extractHTML(element);
        
        return text.split('/')[1]?.trim() || 
               html.split('>/')[1]?.trim() || 
               text.trim() || 
               'Error';
    }

    private static extractRarity(document: Document): Rarities {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(3) > center a');
        const title = DOMParser.extractAttribute(element, 'title');
        const rarity = title.split('Category:')[1];
        return Rarities[rarity as keyof typeof Rarities] || Rarities.UR;
    }

    private static extractClass(document: Document): Classes {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(4) > center a');
        const title = DOMParser.extractAttribute(element, 'title');
        const className = title.split('Category:')[1]?.split(' ')[0];
        return Classes[className as keyof typeof Classes] || Classes.Super;
    }

    private static extractType(document: Document): Types {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(4) > center a');
        const title = DOMParser.extractAttribute(element, 'title');
        const typeName = title.split('Category:')[1]?.split(' ')[1];
        return Types[typeName as keyof typeof Types] || Types.PHY;
    }

    private static extractCost(document: Document): number {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(5) > center:nth-child(1)');
        const text = DOMParser.extractText(element);
        return safeParseInt(text);
    }

    private static extractId(document: Document): string {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(6) > center:nth-child(1)');
        return DOMParser.extractText(element);
    }

    private static extractImageURL(document: Document): string {
        const selectors = [
            '.mw-parser-output table > tbody > tr > td > div > img',
            '.mw-parser-output table > tbody > tr > td > a',
            '.mw-parser-output table > tbody > tr > td > img'
        ];

        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const src = DOMParser.extractAttribute(element, 'src', '');
                const href = DOMParser.extractAttribute(element, 'href', '');
                if (src !== 'Error') return src;
                if (href !== 'Error') return href;
            }
        }
        return 'Error';
    }

    private static extractFullImageURL(document: Document): string {
        const thumbnailURL = this.extractImageURL(document);
        if (thumbnailURL === 'Error') return 'Error';
        
        // Convert thumbnail URL to full-size URL by removing 'thumb_'
        return thumbnailURL.replace('thumb_apng.png', 'apng.png');
    }

    private static extractSkillByImage(document: Document, imageName: string): string {
        const skillImage = DOMParser.findByImageName(document, imageName);
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        return DOMParser.extractText(nextRow);
    }

    private static extractLeaderSkill(document: Document): string {
        return this.extractSkillByImage(document, 'Leader Skill.png');
    }

    private static extractEZALeaderSkill(document: Document): string | undefined {
        const selectors = [
            '.ezatabber > div > div:nth-child(3) > table > tbody > tr:nth-child(2) > td',
            '.ezawidth [data-image-name="Leader Skill.png"]'
        ];

        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                if (selector.includes('ezawidth')) {
                    const row = DOMParser.findClosest(element, 'tr');
                    const nextRow = DOMParser.getNextSibling(row);
                    const text = DOMParser.extractText(nextRow, '');
                    if (text && text !== 'Error') return text;
                } else {
                    const text = DOMParser.extractText(element, '');
                    if (text && text !== 'Error') return text;
                }
            }
        }
        return undefined;
    }

    private static extractSuperAttack(document: Document): string {
        return this.extractSkillByImage(document, 'Super atk.png');
    }

    private static extractEZASuperAttack(document: Document): string | undefined {
        const ezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (ezaTables && ezaTables.length > 1) {
            const secondTable = ezaTables[1];
            const skillImage = DOMParser.querySelector(secondTable as Element, '[data-image-name="Super atk.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }

        const ezaElement = DOMParser.querySelector(document, '.ezawidth [data-image-name="Super atk.png"]');
        if (ezaElement) {
            const row = DOMParser.findClosest(ezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error') return text;
        }

        return undefined;
    }

    private static extractUltraSuperAttack(document: Document): string | undefined {
        const skillImage = DOMParser.findByImageName(document, 'Ultra Super atk.png');
        if (!skillImage) return undefined;
        
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractText(nextRow, '');
        return text && text !== 'Error' ? text : undefined;
    }

    private static extractEZAUltraSuperAttack(document: Document): string | undefined {
        const selectors = [
            '.righttablecard > table > tbody > tr > td > div > div > div:nth-child(3) [data-image-name="Ultra Super atk.png"]',
            '.ezawidth [data-image-name="Ultra Super atk.png"]'
        ];

        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const row = DOMParser.findClosest(element, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }
        return undefined;
    }

    private static extractPassive(document: Document): string {
        const skillImage = DOMParser.findByImageName(document, 'Passive skill.png');
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractText(nextRow);
        return cleanPassiveText(text);
    }

    private static extractEZAPassive(document: Document): string | undefined {
        const ezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (ezaTables && ezaTables.length > 1) {
            const secondTable = ezaTables[1];
            const skillImage = DOMParser.querySelector(secondTable as Element, '[data-image-name="Passive skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return cleanPassiveText(text);
            }
        }

        const ezaElement = DOMParser.querySelector(document, '.ezawidth [data-image-name="Passive skill.png"]');
        if (ezaElement) {
            const row = DOMParser.findClosest(ezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error') return cleanPassiveText(text);
        }

        return undefined;
    }

    private static extractActiveSkill(document: Document): string | undefined {
        const skillImage = DOMParser.findByImageName(document, 'Active skill.png');
        if (!skillImage) return undefined;

        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        let text = DOMParser.extractText(nextRow, '');
        
        if (!text || text === 'Error') {
            const nextNextRow = DOMParser.getNextSibling(nextRow);
            text = DOMParser.extractText(nextNextRow, '');
        }
        
        return text && text !== 'Error' ? text : undefined;
    }

    private static extractActiveSkillCondition(document: Document): string | undefined {
        const skillImage = DOMParser.findByImageName(document, 'Active skill.png');
        if (!skillImage) return undefined;

        const row = DOMParser.findClosest(skillImage, 'tr');
        let currentRow = DOMParser.getNextSibling(row);
        
        for (let i = 0; i < 3 && currentRow; i++) {
            currentRow = DOMParser.getNextSibling(currentRow);
            const centerElement = DOMParser.querySelector(currentRow, 'td > center');
            if (centerElement) {
                const text = DOMParser.extractText(centerElement, '');
                if (text && text !== 'Error') return text;
            }
        }
        
        return undefined;
    }

    private static extractEZAActiveSkill(document: Document): string | undefined {
        const ezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (ezaTables && ezaTables.length > 1) {
            const secondTable = ezaTables[1];
            const skillImage = DOMParser.querySelector(secondTable as Element, '[data-image-name="Active skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }

        const ezaElement = DOMParser.querySelector(document, '.ezawidth [data-image-name="Active skill.png"]');
        if (ezaElement) {
            const row = DOMParser.findClosest(ezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error') return text;
        }

        return undefined;
    }

    private static extractEZAActiveSkillCondition(document: Document): string | undefined {
        const ezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (ezaTables && ezaTables.length > 1) {
            const secondTable = ezaTables[1];
            const skillImage = DOMParser.querySelector(secondTable as Element, '[data-image-name="Active skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                let currentRow = DOMParser.getNextSibling(row);
                
                for (let i = 0; i < 3 && currentRow; i++) {
                    currentRow = DOMParser.getNextSibling(currentRow);
                    const centerElement = DOMParser.querySelector(currentRow, 'td > center');
                    if (centerElement) {
                        const text = DOMParser.extractText(centerElement, '');
                        if (text && text !== 'Error') return text;
                    }
                }
            }
        }

        const ezaElement = DOMParser.querySelector(document, '.ezawidth [data-image-name="Active skill.png"]');
        if (ezaElement) {
            const row = DOMParser.findClosest(ezaElement, 'tr');
            let currentRow = DOMParser.getNextSibling(row);
            
            for (let i = 0; i < 3 && currentRow; i++) {
                currentRow = DOMParser.getNextSibling(currentRow);
                const centerElement = DOMParser.querySelector(currentRow, 'td > center');
                if (centerElement) {
                    const text = DOMParser.extractText(centerElement, '');
                    if (text && text !== 'Error') return text;
                }
            }
        }

        return undefined;
    }

    private static extractTransformationCondition(document: Document): string | undefined {
        const skillImage = DOMParser.findByImageName(document, 'Transformation Condition.png');
        if (!skillImage) return undefined;

        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const centerElement = DOMParser.querySelector(nextRow, 'td > center');
        const text = DOMParser.extractText(centerElement, '');
        
        return text && text !== 'Error' ? text : undefined;
    }

    private static extractLinks(document: Document): string[] {
        const skillImage = DOMParser.findByImageName(document, 'Link skill.png');
        if (!skillImage) return ['Error'];

        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const linkElements = DOMParser.querySelectorAll(nextRow, 'span > a');
        
        return DOMParser.extractTextArray(linkElements);
    }

    private static extractCategories(document: Document): string[] {
        const skillImage = DOMParser.findByImageName(document, 'Category.png');
        if (!skillImage) return ['Error'];

        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const categoryElements = DOMParser.querySelectorAll(nextRow, 'a');
        
        return DOMParser.extractTextArray(categoryElements);
    }

    private static extractKiMeter(document: Document): string[] {
        const skillImage = DOMParser.findByImageName(document, 'Ki meter.png');
        if (!skillImage) return ['Error'];

        const tbody = DOMParser.findClosest(skillImage, 'tbody');
        const kiElements = DOMParser.querySelectorAll(tbody, 'img');
        
        if (!kiElements) return ['Error'];
        
        const kiValues = Array.from(kiElements)
            .map(img => DOMParser.extractAttribute(img, 'alt').split('.png')[0])
            .slice(1); // Skip first element as per original logic
        
        return kiValues.length > 0 ? kiValues : ['Error'];
    }

    private static extractBaseStat(document: Document, statType: 'HP' | 'Attack' | 'Defence', column: number): number {
        const rowMap = { HP: 2, Attack: 3, Defence: 4 };
        const row = rowMap[statType];
        
        const element = DOMParser.querySelector(document, 
            `.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(${column}) > center:nth-child(1)`
        );
        
        const text = DOMParser.extractText(element, '0');
        return safeParseInt(text);
    }

    private static extractKiMultiplier(document: Document): string {
        const element = DOMParser.querySelector(document, 
            '.righttablecard > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)'
        );
        
        if (element) {
            const html = DOMParser.extractHTML(element);
            const parts = html.split('► ');
            if (parts.length > 1) {
                const firstPart = parts[1].split('<br>')[0];
                const secondPart = parts.length > 2 ? parts[2] : html.split('<br>► ')[1] || '';
                return `${firstPart}; ${secondPart}`.replace(
                    '<a href="/wiki/Super_Attack_Multipliers" title="Super Attack Multipliers">SA Multiplier</a>', 
                    'SA Multiplier'
                );
            }
        }

        const fallbackElement = DOMParser.querySelector(document, 
            '.righttablecard'
        )?.nextElementSibling?.querySelector('tr:nth-child(2) > td');
        
        if (fallbackElement) {
            const text = DOMParser.extractText(fallbackElement);
            const splitText = text.split('► ')[1];
            if (splitText) return splitText;
        }
        
        return 'Error';
    }

    private static async extractTransformations(document: Document): Promise<Transformation[]> {
        const transformedArray: Transformation[] = [];
        const transformElements = DOMParser.querySelectorAll(document, '.mw-parser-output > div:nth-child(2) > div > ul > li');
        
        if (!transformElements) return transformedArray;
        
        const transformCount = transformElements.length;

        // Start from index 1 to skip untransformed state
        for (let index = 1; index < transformCount; index++) {
            const transformation = await this.extractSingleTransformation(document, index);
            if (transformation) {
                transformedArray.push(transformation);
            }
        }

        return transformedArray;
    }

    private static async extractSingleTransformation(document: Document, index: number): Promise<Transformation | null> {
        try {
            const baseSelector = `.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`;
            
            const transformation: Transformation = {
                transformedName: this.extractTransformationName(document, baseSelector),
                transformedID: this.extractTransformationId(document, baseSelector),
                transformedClass: this.extractTransformationClass(document, baseSelector),
                transformedType: this.extractTransformationType(document, baseSelector),
                transformedSuperAttack: this.extractTransformationSuperAttack(document, baseSelector),
                transformedEZASuperAttack: this.extractTransformationEZASuperAttack(document, baseSelector),
                transformedSEZASuperAttack: this.extractTransformationSEZASuperAttack(document, baseSelector),
                transformedUltraSuperAttack: this.extractTransformationUltraSuperAttack(document, baseSelector),
                transformedEZAUltraSuperAttack: this.extractTransformationEZAUltraSuperAttack(document, baseSelector),
                transformedSEZAUltraSuperAttack: this.extractTransformationSEZAUltraSuperAttack(document, baseSelector),
                transformedPassive: this.extractTransformationPassive(document, baseSelector),
                transformedEZAPassive: this.extractTransformationEZAPassive(document, baseSelector),
                transformedSEZAPassive: this.extractTransformationSEZAPassive(document, baseSelector),
                transformedActiveSkill: this.extractTransformationActiveSkill(document, baseSelector),
                transformedActiveSkillCondition: this.extractTransformationActiveSkillCondition(document, baseSelector),
                transformedLinks: this.extractTransformationLinks(document, baseSelector),
                transformedImageURL: this.extractTransformationImageURL(document, baseSelector),
                transformedFullImageURL: this.extractTransformationFullImageURL(document, baseSelector)
            };

            return transformation;
        } catch (error) {
            await logger.error(`Error extracting transformation ${index}:`, {}, error as Error);
            return null;
        }
    }

    private static extractTransformationName(document: Document, baseSelector: string): string {
        const element = DOMParser.querySelector(document, `${baseSelector} > table > tbody > tr > td:nth-child(2)`);
        const html = DOMParser.extractHTML(element);
        return extractCharacterName(html);
    }

    private static extractTransformationId(document: Document, baseSelector: string): string {
        const element = DOMParser.querySelector(document, `${baseSelector} > table > tbody > tr:nth-child(3) > td:nth-child(6)`);
        return DOMParser.extractText(element);
    }

    private static extractTransformationClass(document: Document, baseSelector: string): Classes {
        const element = DOMParser.querySelector(document, `${baseSelector} > table > tbody > tr:nth-child(3) > td:nth-child(4) > center > a`);
        const title = DOMParser.extractAttribute(element, 'title');
        const className = title.split('Category:')[1]?.split(' ')[0];
        return Classes[className as keyof typeof Classes] || Classes.Super;
    }

    private static extractTransformationType(document: Document, baseSelector: string): Types {
        const element = DOMParser.querySelector(document, `${baseSelector} > table > tbody > tr:nth-child(3) > td:nth-child(4) > center > a`);
        const title = DOMParser.extractAttribute(element, 'title');
        const typeName = title.split('Category:')[1]?.split(' ')[1];
        return Types[typeName as keyof typeof Types] || Types.PHY;
    }

    private static extractTransformationSuperAttack(document: Document, baseSelector: string): string {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Super atk.png"]`);
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        return DOMParser.extractText(nextRow);
    }

    private static extractTransformationEZASuperAttack(document: Document, baseSelector: string): string | undefined {
        const selectors = [
            `${baseSelector} .righttablecard > table > tbody > tr > td > div > div > div:nth-child(3) [data-image-name="Super atk.png"]`,
            `${baseSelector} .ezawidth [data-image-name="Super atk.png"]`
        ];

        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const row = DOMParser.findClosest(element, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }
        return undefined;
    }

    private static extractTransformationUltraSuperAttack(document: Document, baseSelector: string): string | undefined {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Ultra Super atk.png"]`);
        if (!skillImage) return undefined;
        
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractText(nextRow, '');
        return text && text !== 'Error' ? text : undefined;
    }

    private static extractTransformationEZAUltraSuperAttack(document: Document, baseSelector: string): string | undefined {
        const selectors = [
            `${baseSelector} .righttablecard > table > tbody > tr > td > div > div > div:nth-child(3) [data-image-name="Ultra Super atk.png"]`,
            `${baseSelector} .ezawidth [data-image-name="Ultra Super atk.png"]`
        ];

        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const row = DOMParser.findClosest(element, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }
        return undefined;
    }

    private static extractTransformationPassive(document: Document, baseSelector: string): string {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Passive skill.png"]`);
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractText(nextRow);
        return cleanPassiveText(text);
    }

    private static extractTransformationEZAPassive(document: Document, baseSelector: string): string | undefined {
        const selectors = [
            `${baseSelector} .righttablecard > table > tbody > tr > td > div > div > div:nth-child(3) [data-image-name="Passive skill.png"]`,
            `${baseSelector} .ezawidth [data-image-name="Passive skill.png"]`
        ];

        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const row = DOMParser.findClosest(element, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return cleanPassiveText(text);
            }
        }
        return undefined;
    }

    private static extractTransformationActiveSkill(document: Document, baseSelector: string): string | undefined {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Active skill.png"]`);
        if (!skillImage) return undefined;
        
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractText(nextRow, '');
        return text && text !== 'Error' ? text : undefined;
    }

    private static extractTransformationActiveSkillCondition(document: Document, baseSelector: string): string | undefined {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Activation Condition.png"]`);
        if (!skillImage) return undefined;
        
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractText(nextRow, '');
        return text && text !== 'Error' ? text : undefined;
    }

    private static extractTransformationLinks(document: Document, baseSelector: string): string[] {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Link skill.png"]`);
        if (!skillImage) return ['Error'];

        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const linkElements = DOMParser.querySelectorAll(nextRow, 'span > a');
        
        return DOMParser.extractTextArray(linkElements);
    }

    private static extractTransformationImageURL(document: Document, baseSelector: string): string {
        const selectors = [
            `${baseSelector} > table > tbody > tr > td > div > img`,
            `${baseSelector} > table > tbody > tr > td > a`,
            `${baseSelector} > table > tbody > tr > td > img`
        ];

        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const src = DOMParser.extractAttribute(element, 'src', '');
                const href = DOMParser.extractAttribute(element, 'href', '');
                if (src !== 'Error') return src;
                if (href !== 'Error') return href;
            }
        }
        return 'Error';
    }

    private static extractTransformationFullImageURL(document: Document, baseSelector: string): string {
        const thumbnailURL = this.extractTransformationImageURL(document, baseSelector);
        if (thumbnailURL === 'Error') return 'Error';
        
        // Convert thumbnail URL to full-size URL by removing 'thumb_'
        return thumbnailURL.replace('thumb_apng.png', 'apng.png');
    }

    // Standby Skill Extraction Methods
    private static extractStandbySkill(document: Document): string | undefined {
        // Look for standby skill indicators
        const standbyElement = DOMParser.querySelector(document, '[data-image-name="Standby skill.png"]');
        if (standbyElement) {
            const row = DOMParser.findClosest(standbyElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error') return text;
        }

        // Alternative: look for text containing "standby" keywords
        const allText = DOMParser.extractText(document, '');
        if (allText.toLowerCase().includes('switch to standby') || 
            allText.toLowerCase().includes('standby for') ||
            allText.toLowerCase().includes('standby skill')) {
            // Try to find the specific standby text in tables
            const tables = DOMParser.querySelectorAll(document, 'table');
            for (const table of tables) {
                const tableText = DOMParser.extractText(table as Element, '');
                if (tableText.toLowerCase().includes('switch to standby')) {
                    return tableText.trim();
                }
            }
        }

        return undefined;
    }

    private static extractStandbySkillCondition(document: Document): string | undefined {
        // Look for standby skill conditions - often includes activation conditions
        const standbySkill = this.extractStandbySkill(document);
        if (standbySkill) {
            // Extract condition part (usually after semicolon or in parentheses)
            const match = standbySkill.match(/\((.*?only.*?)\)/i) || 
                         standbySkill.match(/starting from.*?battle/i);
            if (match) {
                return match[0].replace(/[()]/g, '');
            }
        }
        return undefined;
    }

    // SEZA (Super EZA) Extraction Methods
    private static extractSEZALeaderSkill(document: Document): string | undefined {
        // Look for SEZA sections - they typically come after regular EZA sections
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            // SEZA is typically the third table (after base and EZA)
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable as Element, '[data-image-name="Leader Skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }

        // Alternative: look for Super EZA specific selectors
        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Leader Skill.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error') return text;
        }

        return undefined;
    }

    private static extractSEZASuperAttack(document: Document): string | undefined {
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable as Element, '[data-image-name="Super atk.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }

        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Super atk.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error') return text;
        }

        return undefined;
    }

    private static extractSEZAUltraSuperAttack(document: Document): string | undefined {
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable as Element, '[data-image-name="Ultra Super atk.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }

        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Ultra Super atk.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error') return text;
        }

        return undefined;
    }

    private static extractSEZAPassive(document: Document): string | undefined {
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable as Element, '[data-image-name="Passive skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return cleanPassiveText(text);
            }
        }

        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Passive skill.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error') return cleanPassiveText(text);
        }

        return undefined;
    }

    private static extractSEZAActiveSkill(document: Document): string | undefined {
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable as Element, '[data-image-name="Active skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }

        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Active skill.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error') return text;
        }

        return undefined;
    }

    private static extractSEZAActiveSkillCondition(document: Document): string | undefined {
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable as Element, '[data-image-name="Active skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                let currentRow = DOMParser.getNextSibling(row);
                
                for (let i = 0; i < 3 && currentRow; i++) {
                    currentRow = DOMParser.getNextSibling(currentRow);
                    const centerElement = DOMParser.querySelector(currentRow, 'td > center');
                    if (centerElement) {
                        const text = DOMParser.extractText(centerElement, '');
                        if (text && text !== 'Error') return text;
                    }
                }
            }
        }

        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Active skill.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            let currentRow = DOMParser.getNextSibling(row);
            
            for (let i = 0; i < 3 && currentRow; i++) {
                currentRow = DOMParser.getNextSibling(currentRow);
                const centerElement = DOMParser.querySelector(currentRow, 'td > center');
                if (centerElement) {
                    const text = DOMParser.extractText(centerElement, '');
                    if (text && text !== 'Error') return text;
                }
            }
        }

        return undefined;
    }

    // Transformation SEZA Extraction Methods
    private static extractTransformationSEZASuperAttack(document: Document, baseSelector: string): string | undefined {
        const selectors = [
            `${baseSelector} .righttablecard > table > tbody > tr > td > div > div > div:nth-child(4) [data-image-name="Super atk.png"]`,
            `${baseSelector} .super-eza [data-image-name="Super atk.png"]`
        ];

        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const row = DOMParser.findClosest(element, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }
        return undefined;
    }

    private static extractTransformationSEZAUltraSuperAttack(document: Document, baseSelector: string): string | undefined {
        const selectors = [
            `${baseSelector} .righttablecard > table > tbody > tr > td > div > div > div:nth-child(4) [data-image-name="Ultra Super atk.png"]`,
            `${baseSelector} .super-eza [data-image-name="Ultra Super atk.png"]`
        ];

        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const row = DOMParser.findClosest(element, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return text;
            }
        }
        return undefined;
    }

    private static extractTransformationSEZAPassive(document: Document, baseSelector: string): string | undefined {
        const selectors = [
            `${baseSelector} .righttablecard > table > tbody > tr > td > div > div > div:nth-child(4) [data-image-name="Passive skill.png"]`,
            `${baseSelector} .super-eza [data-image-name="Passive skill.png"]`
        ];

        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const row = DOMParser.findClosest(element, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error') return cleanPassiveText(text);
            }
        }
        return undefined;
    }

    private static extractKi12Multiplier(document: Document): string | undefined {
        const element = DOMParser.querySelector(document, 
            '.righttablecard > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)'
        );
        
        if (element) {
            const html = DOMParser.extractHTML(element);
            const ki12Match = html.match(/12\s*Ki\s*Multiplier[^0-9]*([0-9.]+)/i);
            if (ki12Match) {
                return ki12Match[1];
            }
        }
        return undefined;
    }

    private static extractKi18Multiplier(document: Document): string | undefined {
        const element = DOMParser.querySelector(document, 
            '.righttablecard > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)'
        );
        
        if (element) {
            const html = DOMParser.extractHTML(element);
            const ki18Match = html.match(/18\s*Ki\s*Multiplier[^0-9]*([0-9.]+)/i);
            if (ki18Match) {
                return ki18Match[1];
            }
        }
        return undefined;
    }

    private static extractKi24Multiplier(document: Document): string | undefined {
        const element = DOMParser.querySelector(document, 
            '.righttablecard > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)'
        );
        
        if (element) {
            const html = DOMParser.extractHTML(element);
            const ki24Match = html.match(/24\s*Ki\s*Multiplier[^0-9]*([0-9.]+)/i);
            if (ki24Match) {
                return ki24Match[1];
            }
        }
        return undefined;
    }
}