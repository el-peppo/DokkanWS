import { DOMSource, DOMParserAdapter } from '../dom-parser-adapter.js';
import { logger } from '../../utils/logger.js';
import { Transformation } from '../../types/character.js';
// Helper function for cleaning text
function cleanPassiveText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}

export class TransformationExtractor {
    /**
     * Extract all transformations from a character page
     * Based on Dragon Ball Dokkan Battle Complete Mechanics Guide
     */
    static async extractTransformations(source: DOMSource): Promise<Transformation[]> {
        try {
            const transformations: Transformation[] = [];
            
            // Look for transformation sections
            const transformSections = await this.findTransformationSections(source);
            
            if (!transformSections || transformSections.length === 0) {
                return [];
            }
            
            for (let i = 0; i < transformSections.length; i++) {
                const transformation = await this.extractSingleTransformation(source, i);
                if (transformation) {
                    transformations.push(transformation);
                }
            }
            
            return transformations;
        } catch (error) {
            await logger.debug(`Failed to extract transformations: ${error}`);
            return [];
        }
    }
    
    /**
     * Find transformation sections in the DOM
     */
    private static async findTransformationSections(source: DOMSource): Promise<string[]> {
        const transformationSelectors = [
            'h3:contains("Transformation"), h3:contains("Transform"), h3:contains("Form")',
            'h2:contains("Transformation"), h2:contains("Transform"), h2:contains("Form")',
            'div[class*="transform"], div[class*="Transform"]',
            'section[class*="transform"], section[class*="Transform"]',
            // Look for numbered transformations
            'h3:contains("1st"), h3:contains("2nd"), h3:contains("3rd"), h3:contains("Final")',
            // Look for specific transformation types
            'h3:contains("Giant"), h3:contains("Rage"), h3:contains("Revival")',
            'h3:contains("Fusion"), h3:contains("Exchange")'
        ];
        
        const sections: string[] = [];
        
        for (const selector of transformationSelectors) {
            const element = await DOMParserAdapter.extractText(source, selector, '');
            if (element && element !== 'Error') {
                sections.push(element);
            }
        }
        
        return sections;
    }
    
    /**
     * Extract a single transformation from the page
     */
    private static async extractSingleTransformation(source: DOMSource, index: number): Promise<Transformation | null> {
        try {
            const transformation: Transformation = {
                name: '',
                condition: '',
                passive: '',
                superAttack: '',
                kiMultiplier: '',
                links: [],
                categories: []
            };
            
            // Extract transformation name
            transformation.name = await this.extractTransformationName(source, index);
            
            // Extract transformation condition
            transformation.condition = await this.extractTransformationCondition(source, index);
            
            // Extract transformed passive skill
            transformation.passive = await this.extractTransformationPassive(source, index);
            
            // Extract transformed super attack
            transformation.superAttack = await this.extractTransformationSuperAttack(source, index);
            
            // Extract transformed Ki multiplier
            transformation.kiMultiplier = await this.extractTransformationKiMultiplier(source, index);
            
            // Extract transformed links
            transformation.links = await this.extractTransformationLinks(source, index);
            
            // Extract transformed categories
            transformation.categories = await this.extractTransformationCategories(source, index);
            
            // Only return if we have meaningful data
            if (transformation.name && transformation.name !== 'Error' && transformation.condition) {
                return transformation;
            }
            
            return null;
        } catch (error) {
            await logger.debug(`Failed to extract transformation ${index}: ${error}`);
            return null;
        }
    }
    
    /**
     * Extract transformation name
     */
    private static async extractTransformationName(source: DOMSource, index: number): Promise<string> {
        const nameSelectors = [
            `h3:nth-of-type(${index + 2})`, // Adjust for base form
            `h2:nth-of-type(${index + 2})`,
            'h3:contains("Super Saiyan"), h3:contains("Golden"), h3:contains("Ultra")',
            'h3:contains("Perfected"), h3:contains("Evolved"), h3:contains("Awakened")',
            'h3:contains("Giant"), h3:contains("Rage"), h3:contains("Revival")'
        ];
        
        for (const selector of nameSelectors) {
            const name = await DOMParserAdapter.extractText(source, selector, '');
            if (name && name !== 'Error' && name.length > 0) {
                // Clean up the name
                const cleanName = name.replace(/^\d+\.\s*/, '').trim();
                if (cleanName.length > 0) {
                    return cleanName;
                }
            }
        }
        
        return `Transformation ${index + 1}`;
    }
    
    /**
     * Extract transformation condition using Dragon Ball Dokkan Battle mechanics
     */
    private static async extractTransformationCondition(source: DOMSource, _index: number): Promise<string> {
        const conditionSelectors = [
            'th:contains("Condition") + td',
            'th:contains("Transformation Condition") + td',
            'th:contains("Requirements") + td',
            'div[class*="condition"]',
            'p:contains("Starting from"), p:contains("When HP"), p:contains("When facing")',
            'p:contains("turn"), p:contains("Turn"), p:contains("below")'
        ];
        
        for (const selector of conditionSelectors) {
            const condition = await DOMParserAdapter.extractText(source, selector, '');
            if (condition && condition !== 'Error' && condition.length > 10) {
                return this.parseTransformationCondition(condition);
            }
        }
        
        return 'Unknown condition';
    }
    
    /**
     * Parse transformation condition based on Dokkan Battle mechanics
     */
    private static parseTransformationCondition(rawCondition: string): string {
        let condition = rawCondition.trim();
        
        // Turn-based transformations
        if (condition.match(/turn\s*(\d+)/i)) {
            const turnMatch = condition.match(/turn\s*(\d+)/i);
            if (turnMatch) {
                condition = `Starting from turn ${turnMatch[1]}`;
            }
        }
        
        // HP-based transformations
        if (condition.match(/hp\s*(\d+)%/i)) {
            const hpMatch = condition.match(/hp\s*(\d+)%/i);
            if (hpMatch) {
                condition = `When HP is ${hpMatch[1]}% or below`;
            }
        }
        
        // Multi-condition transformations (combine with AND)
        if (condition.includes('turn') && condition.includes('hp')) {
            const turnMatch = condition.match(/turn\s*(\d+)/i);
            const hpMatch = condition.match(/hp\s*(\d+)%/i);
            if (turnMatch && hpMatch) {
                condition = `Starting from turn ${turnMatch[1]} AND when HP is ${hpMatch[1]}% or below`;
            }
        }
        
        // Enemy-based conditions
        if (condition.match(/facing\s*(\d+)\s*enem/i)) {
            const enemyMatch = condition.match(/facing\s*(\d+)\s*enem/i);
            if (enemyMatch) {
                condition = `When facing ${enemyMatch[1]} enemy`;
            }
        }
        
        // Active Skill transformations
        if (condition.includes('Active Skill') || condition.includes('active skill')) {
            condition = 'Via Active Skill';
        }
        
        // Standby Skills
        if (condition.includes('Standby') || condition.includes('standby')) {
            condition = 'Via Standby Skill';
        }
        
        // Exchange mechanics
        if (condition.includes('Exchange') || condition.includes('exchange')) {
            condition = 'Via Exchange Active Skill';
        }
        
        // Fusion mechanics
        if (condition.includes('Fusion') || condition.includes('fusion')) {
            condition = 'Via Fusion Active Skill';
        }
        
        // Giant Form
        if (condition.includes('Giant') || condition.includes('giant')) {
            condition = 'Giant Form transformation (random chance)';
        }
        
        // Rage Mode
        if (condition.includes('Rage') || condition.includes('rage')) {
            condition = 'Rage Mode (when receiving fatal damage)';
        }
        
        // Revival
        if (condition.includes('Revival') || condition.includes('revival')) {
            condition = 'Revival (when KO\'d with HP below 50%)';
        }
        
        return condition;
    }
    
    /**
     * Extract transformation passive skill
     */
    private static async extractTransformationPassive(source: DOMSource, index: number): Promise<string> {
        const passiveSelectors = [
            `th:contains("Passive") + td:nth-of-type(${index + 2})`,
            `th:contains("Passive Skill") + td:nth-of-type(${index + 2})`,
            'th:contains("Transformed Passive") + td',
            'th:contains("After Transformation") + td'
        ];
        
        for (const selector of passiveSelectors) {
            const passive = await DOMParserAdapter.extractText(source, selector, '');
            if (passive && passive !== 'Error' && passive.length > 10) {
                return cleanPassiveText(passive);
            }
        }
        
        return '';
    }
    
    /**
     * Extract transformation super attack
     */
    private static async extractTransformationSuperAttack(source: DOMSource, index: number): Promise<string> {
        const saSelectors = [
            `th:contains("Super Attack") + td:nth-of-type(${index + 2})`,
            'th:contains("Transformed Super Attack") + td',
            'th:contains("After Transformation SA") + td'
        ];
        
        for (const selector of saSelectors) {
            const sa = await DOMParserAdapter.extractText(source, selector, '');
            if (sa && sa !== 'Error' && sa.length > 10) {
                return cleanPassiveText(sa);
            }
        }
        
        return '';
    }
    
    /**
     * Extract transformation Ki multiplier
     */
    private static async extractTransformationKiMultiplier(source: DOMSource, index: number): Promise<string> {
        const kiSelectors = [
            `th:contains("Ki Multiplier") + td:nth-of-type(${index + 2})`,
            'th:contains("Transformed Ki") + td',
            'th:contains("12 Ki Multiplier") + td'
        ];
        
        for (const selector of kiSelectors) {
            const ki = await DOMParserAdapter.extractText(source, selector, '');
            if (ki && ki !== 'Error' && ki.length > 0) {
                return ki.trim();
            }
        }
        
        return '';
    }
    
    /**
     * Extract transformation links
     */
    private static async extractTransformationLinks(source: DOMSource, index: number): Promise<string[]> {
        const linkSelectors = [
            'th:contains("Transformed Links") + td',
            'th:contains("After Transformation Links") + td',
            `th:contains("Link Skills") + td:nth-of-type(${index + 2})`
        ];
        
        for (const selector of linkSelectors) {
            const linksText = await DOMParserAdapter.extractText(source, selector, '');
            if (linksText && linksText !== 'Error' && linksText.length > 0) {
                // Parse links from text
                const links = linksText.split(/[,\n]/).map(link => link.trim()).filter(link => link.length > 0);
                return links;
            }
        }
        
        return [];
    }
    
    /**
     * Extract transformation categories
     */
    private static async extractTransformationCategories(source: DOMSource, index: number): Promise<string[]> {
        const categorySelectors = [
            'th:contains("Transformed Categories") + td',
            'th:contains("After Transformation Categories") + td',
            `th:contains("Categories") + td:nth-of-type(${index + 2})`
        ];
        
        for (const selector of categorySelectors) {
            const categoriesText = await DOMParserAdapter.extractText(source, selector, '');
            if (categoriesText && categoriesText !== 'Error' && categoriesText.length > 0) {
                // Parse categories from text
                const categories = categoriesText.split(/[,\n]/).map(cat => cat.trim()).filter(cat => cat.length > 0);
                return categories;
            }
        }
        
        return [];
    }
    
    /**
     * Detect specific transformation types from Dokkan Battle mechanics
     */
    static async detectTransformationType(source: DOMSource): Promise<string> {
        const typeDetectors = [
            { pattern: /giant/i, type: 'Giant Form' },
            { pattern: /rage/i, type: 'Rage Mode' },
            { pattern: /revival/i, type: 'Revival' },
            { pattern: /fusion/i, type: 'Fusion' },
            { pattern: /exchange/i, type: 'Exchange' },
            { pattern: /standby/i, type: 'Standby' },
            { pattern: /active.*skill/i, type: 'Active Skill' },
            { pattern: /turn.*(\d+)/i, type: 'Turn-based' },
            { pattern: /hp.*(\d+)%/i, type: 'HP-based' },
            { pattern: /enemy/i, type: 'Conditional' }
        ];
        
        const pageText = await DOMParserAdapter.extractText(source, 'body', '');
        
        for (const detector of typeDetectors) {
            if (detector.pattern.test(pageText)) {
                return detector.type;
            }
        }
        
        return 'Standard';
    }
}