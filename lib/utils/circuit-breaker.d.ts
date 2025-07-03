export interface CircuitBreakerConfig {
    failureThreshold: number;
    resetTimeout: number;
    monitoringPeriod: number;
}
export declare enum CircuitState {
    CLOSED = "CLOSED",// Normal operation
    OPEN = "OPEN",// Circuit is open, requests fail fast
    HALF_OPEN = "HALF_OPEN"
}
export declare class CircuitBreaker {
    private config;
    private state;
    private failureCount;
    private lastFailureTime;
    private nextAttempt;
    constructor(config: CircuitBreakerConfig);
    execute<T>(operation: () => Promise<T>): Promise<T>;
    private onSuccess;
    private onFailure;
    getState(): CircuitState;
    getStats(): {
        state: CircuitState;
        failureCount: number;
        lastFailureTime: number;
    };
}
//# sourceMappingURL=circuit-breaker.d.ts.map