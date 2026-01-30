import { Effect } from 'effect'

/**
 * @module @tevm/logger-effect/LoggerShape
 * @description Defines the LoggerShape interface for Effect.ts logging
 */

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
 *
 * @typedef {Object} LoggerShape
 * @property {import('./types.js').LogLevel} level - Current log level configuration (any valid Pino level + 'silent')
 * @property {string} name - Logger name for contextual logging
 * @property {(message: string, data?: unknown) => Effect.Effect<void, never, never>} debug - Log a debug message
 * @property {(message: string, data?: unknown) => Effect.Effect<void, never, never>} info - Log an info message
 * @property {(message: string, data?: unknown) => Effect.Effect<void, never, never>} warn - Log a warning message
 * @property {(message: string, data?: unknown) => Effect.Effect<void, never, never>} error - Log an error message
 * @property {(name: string) => LoggerShape} child - Create a child logger with a new name context
 */

export {}
