export interface PerformanceMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    requestsPerSecond: number;
    memoryUsage: NodeJS.MemoryUsage;
    uptime: number;
}
export declare class PerformanceMonitor {
    private startTime;
    private requestTimes;
    private totalRequests;
    private successfulRequests;
    private failedRequests;
    private lastLogTime;
    constructor();
    recordRequest(responseTime: number, success: boolean): void;
    getMetrics(): PerformanceMetrics;
    logMetrics(): Promise<void>;
    reset(): void;
}
//# sourceMappingURL=performance-monitor.d.ts.map