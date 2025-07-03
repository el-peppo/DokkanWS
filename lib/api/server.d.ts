import express from 'express';
export declare class APIServer {
    private app;
    private server;
    private io;
    private scrapeService;
    private port;
    constructor(port?: number);
    private setupMiddleware;
    private setupRoutes;
    private setupWebSocket;
    start(): Promise<void>;
    stop(): Promise<void>;
    getApp(): express.Application;
    private initializeDatabase;
}
//# sourceMappingURL=server.d.ts.map