/**
 * The shape of a logger instance provided by the LoggerService.
 * Implements the core logging methods with Effect-wrapped return types.
 */
export type LoggerShape = {
    /**
     * - The configured minimum log level
     */
    level: import("./types.js").LogLevel;
    /**
     * - The logger name for contextual identification
     */
    name: string;
    /**
     * - Log a debug message
     */
    debug: (message: string, data?: unknown) => import("effect").Effect.Effect<void, never, never>;
    /**
     * - Log an info message
     */
    info: (message: string, data?: unknown) => import("effect").Effect.Effect<void, never, never>;
    /**
     * - Log a warning message
     */
    warn: (message: string, data?: unknown) => import("effect").Effect.Effect<void, never, never>;
    /**
     * - Log an error message
     */
    error: (message: string, data?: unknown) => import("effect").Effect.Effect<void, never, never>;
    /**
     * - Create a child logger with a scoped name
     */
    child: (childName: string) => LoggerShape;
};
//# sourceMappingURL=LoggerShape.d.ts.map