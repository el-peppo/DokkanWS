import { Classes, Types, Rarities } from '../types/character.js';
import { DOMParser } from './dom-parser.js';
import { cleanPassiveText, extractCharacterName, extractCharacterTitle, safeParseInt } from '../utils/text-cleaner.js';
import { logger } from '../utils/logger.js';
export class CharacterExtractor {
    /**
     * Extract complete character data from character page DOM
     */
    static async extractCharacterData(document) {
        try {
            const transformations = await this.extractTransformations(document);
            // Main character card selection
            const mainTable = DOMParser.querySelector(document, '.mw-parser-output table');
            if (!mainTable) {
                await logger.warn('Main character table not found');
                return null;
            }
            const character = {
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
        }
        catch (error) {
            await logger.error('Error extracting character data:', {}, error);
            return null;
        }
    }
    static extractName(document) {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr > td:nth-child(2)');
        const html = DOMParser.extractHTML(element);
        return extractCharacterName(html);
    }
    static extractTitle(document) {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr > td:nth-child(2)');
        const html = DOMParser.extractHTML(element);
        return extractCharacterTitle(html);
    }
    static extractMaxLevel(document) {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td');
        const text = DOMParser.extractText(element);
        const levelText = text.split('/')[1] || text.split('/')[0];
        return safeParseInt(levelText);
    }
    static extractMaxSALevel(document) {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(2) > center');
        const text = DOMParser.extractText(element);
        const html = DOMParser.extractHTML(element);
        return text.split('/')[1]?.trim() ||
            html.split('>/')[1]?.trim() ||
            text.trim() ||
            'Error';
    }
    static extractRarity(document) {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(3) > center a');
        const title = DOMParser.extractAttribute(element, 'title');
        const rarity = title.split('Category:')[1];
        return Rarities[rarity] || Rarities.UR;
    }
    static extractClass(document) {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(4) > center a');
        const title = DOMParser.extractAttribute(element, 'title');
        const className = title.split('Category:')[1]?.split(' ')[0];
        return Classes[className] || Classes.Super;
    }
    static extractType(document) {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(4) > center a');
        const title = DOMParser.extractAttribute(element, 'title');
        const typeName = title.split('Category:')[1]?.split(' ')[1];
        return Types[typeName] || Types.PHY;
    }
    static extractCost(document) {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(5) > center:nth-child(1)');
        const text = DOMParser.extractText(element);
        return safeParseInt(text);
    }
    static extractId(document) {
        const element = DOMParser.querySelector(document, '.mw-parser-output table > tbody > tr:nth-child(3) > td:nth-child(6) > center:nth-child(1)');
        return DOMParser.extractText(element);
    }
    static extractImageURL(document) {
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
                if (src !== 'Error')
                    return src;
                if (href !== 'Error')
                    return href;
            }
        }
        return 'Error';
    }
    static extractFullImageURL(document) {
        // Look for artwork images directly on the page
        const artworkSelectors = [
            'img[src*="_artwork_apng.png"]',
            'img[src*="_artwork.png"]',
            'a[href*="_artwork_apng.png"]',
            'a[href*="_artwork.png"]'
        ];
        for (const selector of artworkSelectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const src = DOMParser.extractAttribute(element, 'src', '');
                const href = DOMParser.extractAttribute(element, 'href', '');
                if (src !== 'Error')
                    return src;
                if (href !== 'Error')
                    return href;
            }
        }
        // Fallback: try URL transformation as last resort
        const thumbnailURL = this.extractImageURL(document);
        if (thumbnailURL === 'Error')
            return 'Error';
        if (thumbnailURL.includes('_thumb_apng.png')) {
            return thumbnailURL.replace('_thumb_apng.png', '_artwork_apng.png');
        }
        else if (thumbnailURL.includes('_thumb.png')) {
            return thumbnailURL.replace('_thumb.png', '_artwork.png');
        }
        return thumbnailURL;
    }
    static extractSkillByImage(document, imageName) {
        const skillImage = DOMParser.findByImageName(document, imageName);
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        return DOMParser.extractTextWithKiSpheres(nextRow);
    }
    static extractLeaderSkill(document) {
        return this.extractSkillByImage(document, 'Leader Skill.png');
    }
    static extractEZALeaderSkill(document) {
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
                    if (text && text !== 'Error')
                        return text;
                }
                else {
                    const text = DOMParser.extractText(element, '');
                    if (text && text !== 'Error')
                        return text;
                }
            }
        }
        return undefined;
    }
    static extractSuperAttack(document) {
        return this.extractSkillByImage(document, 'Super atk.png');
    }
    static extractEZASuperAttack(document) {
        const ezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (ezaTables && ezaTables.length > 1) {
            const secondTable = ezaTables[1];
            const skillImage = DOMParser.querySelector(secondTable, '[data-image-name="Super atk.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error')
                    return text;
            }
        }
        const ezaElement = DOMParser.querySelector(document, '.ezawidth [data-image-name="Super atk.png"]');
        if (ezaElement) {
            const row = DOMParser.findClosest(ezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error')
                return text;
        }
        return undefined;
    }
    static extractUltraSuperAttack(document) {
        const skillImage = DOMParser.findByImageName(document, 'Ultra Super atk.png');
        if (!skillImage)
            return undefined;
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractText(nextRow, '');
        return text && text !== 'Error' ? text : undefined;
    }
    static extractEZAUltraSuperAttack(document) {
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
                if (text && text !== 'Error')
                    return text;
            }
        }
        return undefined;
    }
    static extractPassive(document) {
        const skillImage = DOMParser.findByImageName(document, 'Passive skill.png');
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractTextWithKiSpheres(nextRow);
        return cleanPassiveText(text);
    }
    static extractEZAPassive(document) {
        const ezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (ezaTables && ezaTables.length > 1) {
            const secondTable = ezaTables[1];
            const skillImage = DOMParser.querySelector(secondTable, '[data-image-name="Passive skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractTextWithKiSpheres(nextRow, '');
                if (text && text !== 'Error')
                    return cleanPassiveText(text);
            }
        }
        const ezaElement = DOMParser.querySelector(document, '.ezawidth [data-image-name="Passive skill.png"]');
        if (ezaElement) {
            const row = DOMParser.findClosest(ezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractTextWithKiSpheres(nextRow, '');
            if (text && text !== 'Error')
                return cleanPassiveText(text);
        }
        return undefined;
    }
    static extractActiveSkill(document) {
        const skillImage = DOMParser.findByImageName(document, 'Active skill.png');
        if (!skillImage)
            return undefined;
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        let text = DOMParser.extractTextWithKiSpheres(nextRow, '');
        if (!text || text === 'Error') {
            const nextNextRow = DOMParser.getNextSibling(nextRow);
            text = DOMParser.extractTextWithKiSpheres(nextNextRow, '');
        }
        return text && text !== 'Error' ? text : undefined;
    }
    static extractActiveSkillCondition(document) {
        const skillImage = DOMParser.findByImageName(document, 'Active skill.png');
        if (!skillImage)
            return undefined;
        const row = DOMParser.findClosest(skillImage, 'tr');
        let currentRow = DOMParser.getNextSibling(row);
        for (let i = 0; i < 3 && currentRow; i++) {
            currentRow = DOMParser.getNextSibling(currentRow);
            const centerElement = DOMParser.querySelector(currentRow, 'td > center');
            if (centerElement) {
                const text = DOMParser.extractText(centerElement, '');
                if (text && text !== 'Error')
                    return text;
            }
        }
        return undefined;
    }
    static extractEZAActiveSkill(document) {
        const ezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (ezaTables && ezaTables.length > 1) {
            const secondTable = ezaTables[1];
            const skillImage = DOMParser.querySelector(secondTable, '[data-image-name="Active skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error')
                    return text;
            }
        }
        const ezaElement = DOMParser.querySelector(document, '.ezawidth [data-image-name="Active skill.png"]');
        if (ezaElement) {
            const row = DOMParser.findClosest(ezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error')
                return text;
        }
        return undefined;
    }
    static extractEZAActiveSkillCondition(document) {
        const ezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (ezaTables && ezaTables.length > 1) {
            const secondTable = ezaTables[1];
            const skillImage = DOMParser.querySelector(secondTable, '[data-image-name="Active skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                let currentRow = DOMParser.getNextSibling(row);
                for (let i = 0; i < 3 && currentRow; i++) {
                    currentRow = DOMParser.getNextSibling(currentRow);
                    const centerElement = DOMParser.querySelector(currentRow, 'td > center');
                    if (centerElement) {
                        const text = DOMParser.extractText(centerElement, '');
                        if (text && text !== 'Error')
                            return text;
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
                    if (text && text !== 'Error')
                        return text;
                }
            }
        }
        return undefined;
    }
    static extractTransformationCondition(document) {
        const skillImage = DOMParser.findByImageName(document, 'Transformation Condition.png');
        if (!skillImage)
            return undefined;
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const centerElement = DOMParser.querySelector(nextRow, 'td > center');
        const text = DOMParser.extractText(centerElement, '');
        return text && text !== 'Error' ? text : undefined;
    }
    static extractLinks(document) {
        const skillImage = DOMParser.findByImageName(document, 'Link skill.png');
        if (!skillImage)
            return ['Error'];
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const linkElements = DOMParser.querySelectorAll(nextRow, 'span > a');
        return DOMParser.extractTextArray(linkElements);
    }
    static extractCategories(document) {
        const skillImage = DOMParser.findByImageName(document, 'Category.png');
        if (!skillImage)
            return ['Error'];
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const categoryElements = DOMParser.querySelectorAll(nextRow, 'a');
        return DOMParser.extractTextArray(categoryElements);
    }
    static extractKiMeter(document) {
        const skillImage = DOMParser.findByImageName(document, 'Ki meter.png');
        if (!skillImage)
            return ['Error'];
        const tbody = DOMParser.findClosest(skillImage, 'tbody');
        const kiElements = DOMParser.querySelectorAll(tbody, 'img');
        if (!kiElements)
            return ['Error'];
        const kiValues = Array.from(kiElements)
            .map(img => DOMParser.extractAttribute(img, 'alt').split('.png')[0])
            .slice(1); // Skip first element as per original logic
        return kiValues.length > 0 ? kiValues : ['Error'];
    }
    static extractBaseStat(document, statType, column) {
        const rowMap = { HP: 2, Attack: 3, Defence: 4 };
        const row = rowMap[statType];
        const element = DOMParser.querySelector(document, `.righttablecard > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(${column}) > center:nth-child(1)`);
        const text = DOMParser.extractText(element, '0');
        return safeParseInt(text);
    }
    static extractKiMultiplier(document) {
        const element = DOMParser.querySelector(document, '.righttablecard > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)');
        if (element) {
            const html = DOMParser.extractHTML(element);
            const parts = html.split('► ');
            if (parts.length > 1) {
                const firstPart = parts[1].split('<br>')[0];
                const secondPart = parts.length > 2 ? parts[2] : html.split('<br>► ')[1] || '';
                return `${firstPart}; ${secondPart}`.replace('<a href="/wiki/Super_Attack_Multipliers" title="Super Attack Multipliers">SA Multiplier</a>', 'SA Multiplier');
            }
        }
        const fallbackElement = DOMParser.querySelector(document, '.righttablecard')?.nextElementSibling?.querySelector('tr:nth-child(2) > td');
        if (fallbackElement) {
            const text = DOMParser.extractText(fallbackElement);
            const splitText = text.split('► ')[1];
            if (splitText)
                return splitText;
        }
        return 'Error';
    }
    static async extractTransformations(document) {
        const transformedArray = [];
        const transformElements = DOMParser.querySelectorAll(document, '.mw-parser-output > div:nth-child(2) > div > ul > li');
        if (!transformElements)
            return transformedArray;
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
    static async extractSingleTransformation(document, index) {
        try {
            const baseSelector = `.mw-parser-output > div:nth-child(2) > div:nth-child(${index + 2})`;
            const transformation = {
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
        }
        catch (error) {
            await logger.error(`Error extracting transformation ${index}:`, {}, error);
            return null;
        }
    }
    static extractTransformationName(document, baseSelector) {
        const element = DOMParser.querySelector(document, `${baseSelector} > table > tbody > tr > td:nth-child(2)`);
        const html = DOMParser.extractHTML(element);
        return extractCharacterName(html);
    }
    static extractTransformationId(document, baseSelector) {
        const element = DOMParser.querySelector(document, `${baseSelector} > table > tbody > tr:nth-child(3) > td:nth-child(6)`);
        return DOMParser.extractText(element);
    }
    static extractTransformationClass(document, baseSelector) {
        const element = DOMParser.querySelector(document, `${baseSelector} > table > tbody > tr:nth-child(3) > td:nth-child(4) > center > a`);
        const title = DOMParser.extractAttribute(element, 'title');
        const className = title.split('Category:')[1]?.split(' ')[0];
        return Classes[className] || Classes.Super;
    }
    static extractTransformationType(document, baseSelector) {
        const element = DOMParser.querySelector(document, `${baseSelector} > table > tbody > tr:nth-child(3) > td:nth-child(4) > center > a`);
        const title = DOMParser.extractAttribute(element, 'title');
        const typeName = title.split('Category:')[1]?.split(' ')[1];
        return Types[typeName] || Types.PHY;
    }
    static extractTransformationSuperAttack(document, baseSelector) {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Super atk.png"]`);
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        return DOMParser.extractText(nextRow);
    }
    static extractTransformationEZASuperAttack(document, baseSelector) {
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
                if (text && text !== 'Error')
                    return text;
            }
        }
        return undefined;
    }
    static extractTransformationUltraSuperAttack(document, baseSelector) {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Ultra Super atk.png"]`);
        if (!skillImage)
            return undefined;
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractText(nextRow, '');
        return text && text !== 'Error' ? text : undefined;
    }
    static extractTransformationEZAUltraSuperAttack(document, baseSelector) {
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
                if (text && text !== 'Error')
                    return text;
            }
        }
        return undefined;
    }
    static extractTransformationPassive(document, baseSelector) {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Passive skill.png"]`);
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractTextWithKiSpheres(nextRow);
        return cleanPassiveText(text);
    }
    static extractTransformationEZAPassive(document, baseSelector) {
        const selectors = [
            `${baseSelector} .righttablecard > table > tbody > tr > td > div > div > div:nth-child(3) [data-image-name="Passive skill.png"]`,
            `${baseSelector} .ezawidth [data-image-name="Passive skill.png"]`
        ];
        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const row = DOMParser.findClosest(element, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractTextWithKiSpheres(nextRow, '');
                if (text && text !== 'Error')
                    return cleanPassiveText(text);
            }
        }
        return undefined;
    }
    static extractTransformationActiveSkill(document, baseSelector) {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Active skill.png"]`);
        if (!skillImage)
            return undefined;
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractText(nextRow, '');
        return text && text !== 'Error' ? text : undefined;
    }
    static extractTransformationActiveSkillCondition(document, baseSelector) {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Activation Condition.png"]`);
        if (!skillImage)
            return undefined;
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const text = DOMParser.extractText(nextRow, '');
        return text && text !== 'Error' ? text : undefined;
    }
    static extractTransformationLinks(document, baseSelector) {
        const skillImage = DOMParser.querySelector(document, `${baseSelector} [data-image-name="Link skill.png"]`);
        if (!skillImage)
            return ['Error'];
        const row = DOMParser.findClosest(skillImage, 'tr');
        const nextRow = DOMParser.getNextSibling(row);
        const linkElements = DOMParser.querySelectorAll(nextRow, 'span > a');
        return DOMParser.extractTextArray(linkElements);
    }
    static extractTransformationImageURL(document, baseSelector) {
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
                if (src !== 'Error')
                    return src;
                if (href !== 'Error')
                    return href;
            }
        }
        return 'Error';
    }
    static extractTransformationFullImageURL(document, baseSelector) {
        // Look for artwork images directly in the transformation section
        const artworkSelectors = [
            `${baseSelector} img[src*="_artwork_apng.png"]`,
            `${baseSelector} img[src*="_artwork.png"]`,
            `${baseSelector} a[href*="_artwork_apng.png"]`,
            `${baseSelector} a[href*="_artwork.png"]`
        ];
        for (const selector of artworkSelectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const src = DOMParser.extractAttribute(element, 'src', '');
                const href = DOMParser.extractAttribute(element, 'href', '');
                if (src !== 'Error')
                    return src;
                if (href !== 'Error')
                    return href;
            }
        }
        // Fallback: try URL transformation as last resort
        const thumbnailURL = this.extractTransformationImageURL(document, baseSelector);
        if (thumbnailURL === 'Error')
            return 'Error';
        if (thumbnailURL.includes('_thumb_apng.png')) {
            return thumbnailURL.replace('_thumb_apng.png', '_artwork_apng.png');
        }
        else if (thumbnailURL.includes('_thumb.png')) {
            return thumbnailURL.replace('_thumb.png', '_artwork.png');
        }
        return thumbnailURL;
    }
    // Standby Skill Extraction Methods
    static extractStandbySkill(document) {
        // Look for standby skill indicators
        const standbyElement = DOMParser.querySelector(document, '[data-image-name="Standby skill.png"]');
        if (standbyElement) {
            const row = DOMParser.findClosest(standbyElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractTextWithKiSpheres(nextRow, '');
            if (text && text !== 'Error')
                return text;
        }
        // Alternative: look for text containing "standby" keywords
        const allText = DOMParser.extractText(document.body || document.documentElement, '');
        if (allText.toLowerCase().includes('switch to standby') ||
            allText.toLowerCase().includes('standby for') ||
            allText.toLowerCase().includes('standby skill')) {
            // Try to find the specific standby text in tables
            const tables = DOMParser.querySelectorAll(document, 'table');
            if (tables) {
                for (const table of tables) {
                    const tableText = DOMParser.extractTextWithKiSpheres(table, '');
                    if (tableText.toLowerCase().includes('switch to standby')) {
                        return tableText.trim();
                    }
                }
            }
        }
        return undefined;
    }
    static extractStandbySkillCondition(document) {
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
    static extractSEZALeaderSkill(document) {
        // Look for SEZA sections - they typically come after regular EZA sections
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            // SEZA is typically the third table (after base and EZA)
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable, '[data-image-name="Leader Skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error')
                    return text;
            }
        }
        // Alternative: look for Super EZA specific selectors
        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Leader Skill.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error')
                return text;
        }
        return undefined;
    }
    static extractSEZASuperAttack(document) {
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable, '[data-image-name="Super atk.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error')
                    return text;
            }
        }
        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Super atk.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error')
                return text;
        }
        return undefined;
    }
    static extractSEZAUltraSuperAttack(document) {
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable, '[data-image-name="Ultra Super atk.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error')
                    return text;
            }
        }
        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Ultra Super atk.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error')
                return text;
        }
        return undefined;
    }
    static extractSEZAPassive(document) {
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable, '[data-image-name="Passive skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractTextWithKiSpheres(nextRow, '');
                if (text && text !== 'Error')
                    return cleanPassiveText(text);
            }
        }
        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Passive skill.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractTextWithKiSpheres(nextRow, '');
            if (text && text !== 'Error')
                return cleanPassiveText(text);
        }
        return undefined;
    }
    static extractSEZAActiveSkill(document) {
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable, '[data-image-name="Active skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractText(nextRow, '');
                if (text && text !== 'Error')
                    return text;
            }
        }
        const sezaElement = DOMParser.querySelector(document, '.super-eza [data-image-name="Active skill.png"]');
        if (sezaElement) {
            const row = DOMParser.findClosest(sezaElement, 'tr');
            const nextRow = DOMParser.getNextSibling(row);
            const text = DOMParser.extractText(nextRow, '');
            if (text && text !== 'Error')
                return text;
        }
        return undefined;
    }
    static extractSEZAActiveSkillCondition(document) {
        const sezaTables = DOMParser.querySelectorAll(document, 'table.ezawidth');
        if (sezaTables && sezaTables.length > 2) {
            const sezaTable = sezaTables[2];
            const skillImage = DOMParser.querySelector(sezaTable, '[data-image-name="Active skill.png"]');
            if (skillImage) {
                const row = DOMParser.findClosest(skillImage, 'tr');
                let currentRow = DOMParser.getNextSibling(row);
                for (let i = 0; i < 3 && currentRow; i++) {
                    currentRow = DOMParser.getNextSibling(currentRow);
                    const centerElement = DOMParser.querySelector(currentRow, 'td > center');
                    if (centerElement) {
                        const text = DOMParser.extractText(centerElement, '');
                        if (text && text !== 'Error')
                            return text;
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
                    if (text && text !== 'Error')
                        return text;
                }
            }
        }
        return undefined;
    }
    // Transformation SEZA Extraction Methods
    static extractTransformationSEZASuperAttack(document, baseSelector) {
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
                if (text && text !== 'Error')
                    return text;
            }
        }
        return undefined;
    }
    static extractTransformationSEZAUltraSuperAttack(document, baseSelector) {
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
                if (text && text !== 'Error')
                    return text;
            }
        }
        return undefined;
    }
    static extractTransformationSEZAPassive(document, baseSelector) {
        const selectors = [
            `${baseSelector} .righttablecard > table > tbody > tr > td > div > div > div:nth-child(4) [data-image-name="Passive skill.png"]`,
            `${baseSelector} .super-eza [data-image-name="Passive skill.png"]`
        ];
        for (const selector of selectors) {
            const element = DOMParser.querySelector(document, selector);
            if (element) {
                const row = DOMParser.findClosest(element, 'tr');
                const nextRow = DOMParser.getNextSibling(row);
                const text = DOMParser.extractTextWithKiSpheres(nextRow, '');
                if (text && text !== 'Error')
                    return cleanPassiveText(text);
            }
        }
        return undefined;
    }
    static extractKi12Multiplier(document) {
        const element = DOMParser.querySelector(document, '.righttablecard > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)');
        if (element) {
            const html = DOMParser.extractHTML(element);
            const ki12Match = html.match(/12\s*Ki\s*Multiplier[^0-9]*([0-9.]+)/i);
            if (ki12Match) {
                return ki12Match[1];
            }
        }
        return undefined;
    }
    static extractKi18Multiplier(document) {
        const element = DOMParser.querySelector(document, '.righttablecard > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)');
        if (element) {
            const html = DOMParser.extractHTML(element);
            const ki18Match = html.match(/18\s*Ki\s*Multiplier[^0-9]*([0-9.]+)/i);
            if (ki18Match) {
                return ki18Match[1];
            }
        }
        return undefined;
    }
    static extractKi24Multiplier(document) {
        const element = DOMParser.querySelector(document, '.righttablecard > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)');
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
//# sourceMappingURL=character-extractor.js.map