import { DatabaseService } from './database-service.js';
// Single shared database instance
let sharedDbService = null;
export async function initializeDatabaseService() {
    if (!sharedDbService) {
        sharedDbService = new DatabaseService();
        await sharedDbService.connect();
    }
}
export function getSharedDatabaseService() {
    if (!sharedDbService) {
        throw new Error('Database service not initialized. Call initializeDatabaseService() first.');
    }
    return sharedDbService;
}
//# sourceMappingURL=shared-db.js.map