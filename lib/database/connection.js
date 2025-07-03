import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import { logger } from '../utils/logger.js';
config();
export class DatabaseConnection {
    connection = null;
    config;
    constructor(dbConfig) {
        this.config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'dokkan_characters',
            port: parseInt(process.env.DB_PORT || '3306'),
            ...dbConfig
        };
    }
    async connect() {
        try {
            this.connection = await mysql.createConnection(this.config);
            await logger.info('Connected to MySQL database');
        }
        catch (error) {
            await logger.warn('MySQL database connection failed, continuing without database features');
            this.connection = null;
            // Don't throw - allow operation without database
        }
    }
    isConnected() {
        return this.connection !== null;
    }
    async disconnect() {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
            await logger.info('Disconnected from MySQL database');
        }
    }
    getConnection() {
        if (!this.connection) {
            throw new Error('Database connection not established. Call connect() first.');
        }
        return this.connection;
    }
    async query(sql, params) {
        const connection = this.getConnection();
        try {
            const [results] = await connection.execute(sql, params);
            return results;
        }
        catch (error) {
            await logger.error('Database query failed:', { sql }, error);
            throw error;
        }
    }
    async beginTransaction() {
        const connection = this.getConnection();
        await connection.beginTransaction();
    }
    async commit() {
        const connection = this.getConnection();
        await connection.commit();
    }
    async rollback() {
        const connection = this.getConnection();
        await connection.rollback();
    }
}
//# sourceMappingURL=connection.js.map