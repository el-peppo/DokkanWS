import { DatabaseService } from './database-service.js';
// Single shared database instance
let sharedDbService = null;
export function getSharedDatabaseService() {
    if (!sharedDbService) {
        sharedDbService = new DatabaseService();
        // Connect asynchronously without awaiting
        sharedDbService.connect().catch((error) => {
            console.warn('Database connection failed, API will work with limited functionality:', error);
        });
    }
    return sharedDbService;
}
//# sourceMappingURL=shared-db.js.map