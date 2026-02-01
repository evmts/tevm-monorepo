/**
 * Log level type for controlling logging verbosity.
 * Matches the base
 */
export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
/**
 * Union type of log entry severity levels (excludes 'silent' as it's a configuration-only level).
 * These correspond to the 4 primary log methods available on LoggerShape.
 * Note: While LogLevel includes 'fatal' and 'trace' for Pino compatibility,
 * LoggerShape only exposes 4 methods (debug, info, warn, error) for simplicity.
 */
export type LogSeverity = "debug" | "info" | "warn" | "error";
/**
 * A log entry captured by LoggerTest
 */
export type LogEntry = {
    /**
     * - The severity level of the log entry
     */
    level: LogSeverity;
    /**
     * - The log message
     */
    message: string;
    /**
     * - Optional structured data attached to the log
     */
    data?: unknown;
    /**
     * - Unix timestamp when the log was created
     */
    timestamp: number;
    /**
     * - Name of the logger that created this entry
     */
    loggerName?: string;
};
//# sourceMappingURL=types.d.ts.map