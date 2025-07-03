import { DatabaseService } from './database-service.js';
// Single shared database instance
let sharedDbService = null;
export function getSharedDatabaseService() {
    if (!sharedDbService) {
        sharedDbService = new DatabaseService();
        // Connect on first access
        sharedDbService.connect().catch(() => {
            // Ignore connection errors - graceful degradation is handled in DatabaseService
        });
    }
    return sharedDbService;
}
//# sourceMappingURL=shared-db.js.map