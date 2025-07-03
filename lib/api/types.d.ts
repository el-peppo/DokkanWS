export interface CharacterSearchQuery {
    search?: string;
    rarity?: string;
    type?: string;
    class?: string;
    category?: string;
    link?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'rarity' | 'maxLevel' | 'cost';
    sortOrder?: 'asc' | 'desc';
}
export interface CharacterSearchResult {
    characters: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    filters: {
        rarities: string[];
        types: string[];
        classes: string[];
        categories: string[];
        links: string[];
    };
}
export interface ScrapeStatus {
    isUpToDate: boolean;
    lastUpdate: Date | null;
    totalCharacters: number;
    needsUpdate: boolean;
    estimatedNewCharacters: number;
}
export interface ScrapeProgress {
    isRunning: boolean;
    category: string;
    processed: number;
    total: number;
    progress: number;
    eta: number;
    errors: number;
}
export interface DatabaseStats {
    totalCharacters: number;
    charactersByRarity: Record<string, number>;
    charactersByType: Record<string, number>;
    charactersByClass: Record<string, number>;
    lastUpdate: Date | null;
    totalCategories: number;
    totalLinks: number;
    totalTransformations: number;
}
//# sourceMappingURL=types.d.ts.map