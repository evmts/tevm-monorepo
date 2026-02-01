/**
 * The shape interface for the LoggerService.
 * Provides Effect-wrapped logging methods for type-safe, composable logging.
 *
 * This interface exposes 4 primary log methods (debug, info, warn, error) that cover
 * the most common use cases. The `level` property can be set to any LogLevel
 * (including 'fatal', 'trace', and 'silent') for configuration purposes, even though
 * there are no dedicated fatal() or trace() methods on the interface.
 *
 * - For fatal errors, use `error()` with appropriate message/data indicating criticality
 * - For trace-level logging, use `debug()` with detailed context
 * - For silent mode, set level to 'silent' to suppress all output
 */
export type LoggerShape = {
    /**
     * - Current log level configuration (any valid Pino level + 'silent')
     */
    level: import("./types.js").LogLevel;
    /**
     * - Logger name for contextual logging
     */
    name: string;
    /**
     * - Log a debug message
     */
    debug: (message: string, data?: unknown) => Effect.Effect<void, never, never>;
    /**
     * - Log an info message
     */
    info: (message: string, data?: unknown) => Effect.Effect<void, never, never>;
    /**
     * - Log a warning message
     */
    warn: (message: string, data?: unknown) => Effect.Effect<void, never, never>;
    /**
     * - Log an error message
     */
    error: (message: string, data?: unknown) => Effect.Effect<void, never, never>;
    /**
     * - Create a child logger with a new name context
     */
    child: (name: string) => LoggerShape;
};
import { Effect } from 'effect';
//# sourceMappingURL=LoggerShape.d.ts.map