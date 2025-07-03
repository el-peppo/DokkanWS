import { CharacterSearchQuery, CharacterSearchResult, DatabaseStats } from './types.js';
export declare class DatabaseService {
    private db;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    searchCharacters(query: CharacterSearchQuery): Promise<CharacterSearchResult>;
    getCharacterById(id: string): Promise<any | null>;
    private getCharacterLinks;
    private getCharacterCategories;
    private getCharacterKiMeter;
    private getCharacterTransformations;
    private getAvailableFilters;
    getDatabaseStats(): Promise<DatabaseStats>;
}
//# sourceMappingURL=database-service.d.ts.map