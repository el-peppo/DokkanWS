import mysql from 'mysql2/promise';
export interface DatabaseConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
}
export declare class DatabaseConnection {
    private connection;
    private config;
    constructor(dbConfig?: Partial<DatabaseConfig>);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getConnection(): mysql.Connection;
    query(sql: string, params?: any[]): Promise<any>;
    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
//# sourceMappingURL=connection.d.ts.map