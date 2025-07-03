import { DatabaseService } from './database-service.js';

// Single shared database instance
let sharedDbService: DatabaseService | null = null;

export function getSharedDatabaseService(): DatabaseService {
    if (!sharedDbService) {
        sharedDbService = new DatabaseService();
        // Connect on first access
        sharedDbService.connect().catch(() => {
            // Ignore connection errors - graceful degradation is handled in DatabaseService
        });
    }
    return sharedDbService;
}