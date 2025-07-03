export interface CorelogMessage {
    ts: string;
    app: string;
    level: string;
    msg: string;
    ctx?: Record<string, any>;
    ip?: string | null;
}
export interface CorelogConfig {
    host: string;
    port: number;
    timeout_connect: number;
    timeout_send: number;
    app_name: string;
}
export declare class CorelogClient {
    private config;
    private isShuttingDown;
    constructor(config: CorelogConfig);
    private formatTimestamp;
    private sendMessage;
    debug(message: string, context?: Record<string, any>): Promise<void>;
    info(message: string, context?: Record<string, any>): Promise<void>;
    warn(message: string, context?: Record<string, any>): Promise<void>;
    error(message: string, context?: Record<string, any>, error?: Error): Promise<void>;
    critical(message: string, context?: Record<string, any>, error?: Error): Promise<void>;
    shutdown(): void;
}
export declare function createCorelogClient(appName: string): CorelogClient;
//# sourceMappingURL=corelog-client.d.ts.map