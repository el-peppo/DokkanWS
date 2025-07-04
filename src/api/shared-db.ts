import { DatabaseService } from './database-service.js';

// Single shared database instance
let sharedDbService: DatabaseService | null = null;

export async function initializeDatabaseService(): Promise<void> {
    if (!sharedDbService) {
        sharedDbService = new DatabaseService();
        await sharedDbService.connect();
    }
}

export function getSharedDatabaseService(): DatabaseService {
    if (!sharedDbService) {
        throw new Error('Database service not initialized. Call initializeDatabaseService() first.');
    }
    return sharedDbService;
}