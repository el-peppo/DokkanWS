import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger.js';
import { ScrapeService } from './scrape-service.js';
import { initializeDatabaseService } from './shared-db.js';

// Import routes
import charactersRouter from './routes/characters.js';
import scrapeRouter from './routes/scrape.js';

export class APIServer {
    private app: express.Application;
    private server: any;
    private io: SocketIOServer;
    private scrapeService: ScrapeService;
    private port: number;

    constructor(port = 3001) {
        this.port = port;
        this.app = express();
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "*", // Configure appropriately for production
                methods: ["GET", "POST"]
            }
        });
        this.scrapeService = new ScrapeService();
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        
        // Initialize database connection once
        this.initializeDatabase();
    }

    private setupMiddleware(): void {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: false // Disable for development
        }));

        // CORS
        this.app.use(cors({
            origin: true, // Configure appropriately for production
            credentials: true
        }));

        // Compression
        this.app.use(compression());

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Logging
        this.app.use(morgan('combined', {
            stream: {
                write: (message: string) => {
                    logger.info(message.trim());
                }
            }
        }));
    }

    private setupRoutes(): void {
        // Health check
        this.app.get('/health', (_req, res) => {
            res.json({ 
                status: 'ok', 
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });

        // API routes
        this.app.use('/api/characters', charactersRouter);
        this.app.use('/api/scrape', scrapeRouter);

        // Serve static files (for future frontend)
        this.app.use(express.static('public'));

        // 404 handler
        this.app.use((_req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found'
            });
        });

        // Error handler
        this.app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
            logger.error('Unhandled API error:', {}, error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        });
    }

    private setupWebSocket(): void {
        this.io.on('connection', (socket) => {
            logger.info(`WebSocket client connected: ${socket.id}`);

            // Send current scrape progress on connection
            socket.emit('scrapeProgress', this.scrapeService.getProgress());

            socket.on('disconnect', () => {
                logger.info(`WebSocket client disconnected: ${socket.id}`);
            });
        });

        // Forward scrape service events to WebSocket clients
        this.scrapeService.on('progress', (progress) => {
            this.io.emit('scrapeProgress', progress);
        });

        this.scrapeService.on('scrapeComplete', (result) => {
            this.io.emit('scrapeComplete', result);
        });
    }

    async start(): Promise<void> {
        try {
            // Initialize database service
            await initializeDatabaseService();
            
            // Initialize scrape service
            await this.scrapeService.connect();

            // Start server on all interfaces
            this.server.listen(this.port, '0.0.0.0', () => {
                logger.info(`API server started on http://localhost:${this.port}`);
                logger.info(`API server accessible on local network at http://10.1.1.5:${this.port}`);
                logger.info(`WebSocket server started on ws://localhost:${this.port}`);
                logger.info(`WebSocket server accessible on local network at ws://10.1.1.5:${this.port}`);
            });

        } catch (error) {
            logger.error('Failed to start API server:', {}, error as Error);
            throw error;
        }
    }

    async stop(): Promise<void> {
        try {
            await this.scrapeService.disconnect();
            
            this.server.close(() => {
                logger.info('API server stopped');
            });
        } catch (error) {
            logger.error('Error stopping API server:', {}, error as Error);
            throw error;
        }
    }

    getApp(): express.Application {
        return this.app;
    }

    private async initializeDatabase(): Promise<void> {
        // Database initialization is handled by individual routes
        // This method is here for future centralized DB management
    }
}