export interface Character {
    name: string;
    title: string;
    maxLevel: number;
    maxSALevel: string;
    rarity: Rarities;
    class: Classes;
    type: Types;
    cost: number;
    id: string;
    imageURL: string;
    fullImageURL: string;
    leaderSkill: string;
    ezaLeaderSkill?: string;
    sezaLeaderSkill?: string;
    superAttack: string;
    ezaSuperAttack?: string;
    sezaSuperAttack?: string;
    ultraSuperAttack?: string;
    ezaUltraSuperAttack?: string;
    sezaUltraSuperAttack?: string;
    passive: string;
    ezaPassive?: string;
    sezaPassive?: string;
    activeSkill?: string;
    activeSkillCondition?: string;
    ezaActiveSkill?: string;
    ezaActiveSkillCondition?: string;
    sezaActiveSkill?: string;
    sezaActiveSkillCondition?: string;
    transformationCondition?: string;
    links: string[];
    categories: string[];
    kiMeter: string[];
    baseHP: number;
    maxLevelHP: number;
    freeDupeHP: number;
    rainbowHP: number;
    baseAttack: number;
    maxLevelAttack: number;
    freeDupeAttack: number;
    rainbowAttack: number;
    baseDefence: number;
    maxDefence: number;
    freeDupeDefence: number;
    rainbowDefence: number;
    kiMultiplier: string;
    ki12Multiplier?: string;
    ki18Multiplier?: string;
    ki24Multiplier?: string;
    transformations?: Transformation[];
}

export enum Classes {
    Super = "Super",
    Extreme = "Extreme"
}

export enum Types {
    PHY = "PHY",
    STR = "STR",
    AGL = "AGL",
    TEQ = "TEQ",
    INT = "INT"
}

export enum Rarities {
    N = "N",
    R = "R",
    SR = "SR",
    SSR = "SSR",
    UR = "UR",
    LR = "LR"
}

export interface Transformation {
    transformedID: string;
    transformedName: string;
    transformedClass: Classes;
    transformedType: Types;
    transformedSuperAttack: string;
    transformedEZASuperAttack?: string;
    transformedSEZASuperAttack?: string;
    transformedUltraSuperAttack?: string;
    transformedEZAUltraSuperAttack?: string;
    transformedSEZAUltraSuperAttack?: string;
    transformedPassive: string;
    transformedEZAPassive?: string;
    transformedSEZAPassive?: string;
    transformedActiveSkill?: string;
    transformedActiveSkillCondition?: string;
    transformedLinks: string[];
    transformedImageURL: string;
    transformedFullImageURL: string;
}

export interface ScrapingConfig {
    maxRetries: number;
    retryDelay: number;
    batchSize: number;
    concurrentLimit: number;
    requestTimeout: number;
    userAgent: string;
}

export interface ScrapingResult {
    characters: Character[];
    stats: {
        totalCharacters: number;
        processingTime: number;
        categoriesProcessed: string[];
        errors: ScrapingError[];
    };
}

export interface ScrapingError {
    url: string;
    error: string;
    timestamp: Date;
    retryAttempt: number;
}