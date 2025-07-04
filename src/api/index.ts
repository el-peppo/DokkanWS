import { logger } from '../utils/logger.js';
import { APIServer } from './server.js';

// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

async function startAPIServer() {
    try {
        const port = process.env.API_PORT ? parseInt(process.env.API_PORT) : 3001;
        const server = new APIServer(port);
        
        await server.start();

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            logger.info('SIGTERM received, shutting down API server gracefully');
            await server.stop();
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            logger.info('SIGINT received, shutting down API server gracefully');
            await server.stop();
            process.exit(0);
        });

    } catch (error) {
        logger.error('Failed to start API server:', {}, error as Error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    startAPIServer();
}

export { APIServer };