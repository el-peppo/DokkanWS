export interface CircuitBreakerConfig {
    failureThreshold: number;    // Number of failures before opening circuit
    resetTimeout: number;        // Time to wait before trying to close circuit (ms)
    monitoringPeriod: number;    // Period to monitor failures (ms)
}

export enum CircuitState {
    CLOSED = 'CLOSED',      // Normal operation
    OPEN = 'OPEN',          // Circuit is open, requests fail fast
    HALF_OPEN = 'HALF_OPEN' // Testing if service has recovered
}

export class CircuitBreaker {
    private state: CircuitState = CircuitState.CLOSED;
    private failureCount: number = 0;
    private lastFailureTime: number = 0;
    private nextAttempt: number = 0;

    constructor(private config: CircuitBreakerConfig) {}

    async execute<T>(operation: () => Promise<T>): Promise<T> {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() < this.nextAttempt) {
                throw new Error('Circuit breaker is OPEN');
            }
            this.state = CircuitState.HALF_OPEN;
        }

        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess(): void {
        this.failureCount = 0;
        this.state = CircuitState.CLOSED;
    }

    private onFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.failureCount >= this.config.failureThreshold) {
            this.state = CircuitState.OPEN;
            this.nextAttempt = Date.now() + this.config.resetTimeout;
        }
    }

    getState(): CircuitState {
        return this.state;
    }

    getStats(): { state: CircuitState; failureCount: number; lastFailureTime: number } {
        return {
            state: this.state,
            failureCount: this.failureCount,
            lastFailureTime: this.lastFailureTime
        };
    }
}