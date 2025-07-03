import { logger } from './logger.js';

export interface PerformanceMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    requestsPerSecond: number;
    memoryUsage: NodeJS.MemoryUsage;
    uptime: number;
}

export class PerformanceMonitor {
    private startTime: number;
    private requestTimes: number[] = [];
    private totalRequests: number = 0;
    private successfulRequests: number = 0;
    private failedRequests: number = 0;
    private lastLogTime: number = 0;

    constructor() {
        this.startTime = Date.now();
    }

    recordRequest(responseTime: number, success: boolean): void {
        this.totalRequests++;
        this.requestTimes.push(responseTime);
        
        if (success) {
            this.successfulRequests++;
        } else {
            this.failedRequests++;
        }

        // Keep only last 100 response times for calculating average
        if (this.requestTimes.length > 100) {
            this.requestTimes.shift();
        }

        // Log performance metrics every 60 seconds
        const now = Date.now();
        if (now - this.lastLogTime > 60000) {
            this.logMetrics();
            this.lastLogTime = now;
        }
    }

    getMetrics(): PerformanceMetrics {
        const now = Date.now();
        const uptime = (now - this.startTime) / 1000;
        const averageResponseTime = this.requestTimes.length > 0 
            ? this.requestTimes.reduce((a, b) => a + b, 0) / this.requestTimes.length 
            : 0;

        return {
            totalRequests: this.totalRequests,
            successfulRequests: this.successfulRequests,
            failedRequests: this.failedRequests,
            averageResponseTime: Math.round(averageResponseTime),
            requestsPerSecond: this.totalRequests / uptime,
            memoryUsage: process.memoryUsage(),
            uptime
        };
    }

    async logMetrics(): Promise<void> {
        const metrics = this.getMetrics();
        const memoryMB = Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024);
        const successRate = this.totalRequests > 0 ? (this.successfulRequests / this.totalRequests * 100).toFixed(1) : '0';

        await logger.info(`Performance metrics: ${metrics.totalRequests} requests, ${successRate}% success, ${metrics.averageResponseTime}ms avg, ${metrics.requestsPerSecond.toFixed(1)}/s rate, ${memoryMB}MB memory`);
    }

    reset(): void {
        this.startTime = Date.now();
        this.requestTimes = [];
        this.totalRequests = 0;
        this.successfulRequests = 0;
        this.failedRequests = 0;
        this.lastLogTime = 0;
    }
}