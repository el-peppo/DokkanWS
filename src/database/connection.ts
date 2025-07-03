import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import { logger } from '../utils/logger.js';

config();

export interface DatabaseConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
}

export class DatabaseConnection {
    private connection: mysql.Connection | null = null;
    private config: DatabaseConfig;

    constructor(dbConfig?: Partial<DatabaseConfig>) {
        this.config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'dokkan_characters',
            port: parseInt(process.env.DB_PORT || '3306'),
            ...dbConfig
        };
    }

    async connect(): Promise<void> {
        try {
            this.connection = await mysql.createConnection(this.config);
            await logger.info('Connected to MySQL database');
        } catch (error) {
            await logger.error('Failed to connect to database:', {}, error as Error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
            await logger.info('Disconnected from MySQL database');
        }
    }

    getConnection(): mysql.Connection {
        if (!this.connection) {
            throw new Error('Database connection not established. Call connect() first.');
        }
        return this.connection;
    }

    async query(sql: string, params?: any[]): Promise<any> {
        const connection = this.getConnection();
        try {
            const [results] = await connection.execute(sql, params);
            return results;
        } catch (error) {
            await logger.error('Database query failed:', { sql }, error as Error);
            throw error;
        }
    }

    async beginTransaction(): Promise<void> {
        const connection = this.getConnection();
        await connection.beginTransaction();
    }

    async commit(): Promise<void> {
        const connection = this.getConnection();
        await connection.commit();
    }

    async rollback(): Promise<void> {
        const connection = this.getConnection();
        await connection.rollback();
    }
}