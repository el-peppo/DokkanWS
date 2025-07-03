import { Socket } from 'net';
export class CorelogClient {
    config;
    isShuttingDown = false;
    constructor(config) {
        this.config = config;
    }
    formatTimestamp() {
        return new Date().toISOString();
    }
    async sendMessage(message) {
        if (this.isShuttingDown) {
            return;
        }
        return new Promise((resolve, reject) => {
            const socket = new Socket();
            let isResolved = false;
            const cleanup = () => {
                if (!isResolved) {
                    isResolved = true;
                    socket.destroy();
                }
            };
            const timeoutId = setTimeout(() => {
                cleanup();
                reject(new Error(`Corelog connection timeout after ${this.config.timeout_connect}ms`));
            }, this.config.timeout_connect);
            socket.setTimeout(this.config.timeout_send);
            socket.on('connect', () => {
                try {
                    const jsonMessage = JSON.stringify(message) + '\0';
                    socket.write(jsonMessage, 'utf8', (err) => {
                        clearTimeout(timeoutId);
                        cleanup();
                        if (!isResolved) {
                            isResolved = true;
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        }
                    });
                }
                catch (err) {
                    clearTimeout(timeoutId);
                    cleanup();
                    if (!isResolved) {
                        isResolved = true;
                        reject(err);
                    }
                }
            });
            socket.on('error', (err) => {
                clearTimeout(timeoutId);
                cleanup();
                if (!isResolved) {
                    isResolved = true;
                    reject(err);
                }
            });
            socket.on('timeout', () => {
                clearTimeout(timeoutId);
                cleanup();
                if (!isResolved) {
                    isResolved = true;
                    reject(new Error(`Corelog send timeout after ${this.config.timeout_send}ms`));
                }
            });
            socket.connect(this.config.port, this.config.host);
        });
    }
    async debug(message, context) {
        const logMessage = {
            ts: this.formatTimestamp(),
            app: this.config.app_name,
            level: 'DEBUG',
            msg: message,
            ctx: context,
            ip: null
        };
        try {
            await this.sendMessage(logMessage);
        }
        catch (err) {
            // Silently fail for debug messages to avoid flooding console
            if (process.env.NODE_ENV !== 'production') {
                console.warn(`Failed to send debug log to corelog: ${err instanceof Error ? err.message : err}`);
            }
        }
    }
    async info(message, context) {
        const logMessage = {
            ts: this.formatTimestamp(),
            app: this.config.app_name,
            level: 'INFO',
            msg: message,
            ctx: context,
            ip: null
        };
        try {
            await this.sendMessage(logMessage);
        }
        catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn(`Failed to send info log to corelog: ${err instanceof Error ? err.message : err}`);
            }
        }
    }
    async warn(message, context) {
        const logMessage = {
            ts: this.formatTimestamp(),
            app: this.config.app_name,
            level: 'WARNING',
            msg: message,
            ctx: context,
            ip: null
        };
        try {
            await this.sendMessage(logMessage);
        }
        catch (err) {
            console.warn(`Failed to send warning log to corelog: ${err instanceof Error ? err.message : err}`);
        }
    }
    async error(message, context, error) {
        const logContext = { ...context };
        if (error) {
            logContext.error_message = error.message;
            logContext.error_stack = error.stack;
            logContext.error_name = error.name;
        }
        const logMessage = {
            ts: this.formatTimestamp(),
            app: this.config.app_name,
            level: 'ERROR',
            msg: message,
            ctx: logContext,
            ip: null
        };
        try {
            await this.sendMessage(logMessage);
        }
        catch (err) {
            console.error(`Failed to send error log to corelog: ${err instanceof Error ? err.message : err}`);
        }
    }
    async critical(message, context, error) {
        const logContext = { ...context };
        if (error) {
            logContext.error_message = error.message;
            logContext.error_stack = error.stack;
            logContext.error_name = error.name;
        }
        const logMessage = {
            ts: this.formatTimestamp(),
            app: this.config.app_name,
            level: 'CRITICAL',
            msg: message,
            ctx: logContext,
            ip: null
        };
        try {
            await this.sendMessage(logMessage);
        }
        catch (err) {
            console.error(`Failed to send critical log to corelog: ${err instanceof Error ? err.message : err}`);
        }
    }
    shutdown() {
        this.isShuttingDown = true;
    }
}
export function createCorelogClient(appName) {
    const config = {
        host: process.env.CORELOG_REMOTE_HOST || 'localhost',
        port: parseInt(process.env.CORELOG_REMOTE_PORT || '9020', 10),
        timeout_connect: parseInt(process.env.CORELOG_TIMEOUT_CONNECT || '3000', 10),
        timeout_send: parseInt(process.env.CORELOG_TIMEOUT_SEND || '3000', 10),
        app_name: appName
    };
    return new CorelogClient(config);
}
//# sourceMappingURL=corelog-client.js.map