import { Effect } from 'effect'

/**
 * @module @tevm/logger-effect/LoggerShape
 * @description Defines the LoggerShape interface for Effect.ts logging
 */

/**
 * @typedef {import('./types.js').LogLevel} LogLevel
 * @typedef {import('./types.js').LogSeverity} LogSeverity
 */

/**
 * The shape interface for the LoggerService.
 * Provides Effect-wrapped logging methods for type-safe, composable logging.
 *
 * @typedef {Object} LoggerShape
 * @property {LogLevel} level - Current log level configuration
 * @property {string} name - Logger name for contextual logging
 * @property {(message: string, data?: unknown) => Effect.Effect<void, never, never>} debug - Log a debug message
 * @property {(message: string, data?: unknown) => Effect.Effect<void, never, never>} info - Log an info message
 * @property {(message: string, data?: unknown) => Effect.Effect<void, never, never>} warn - Log a warning message
 * @property {(message: string, data?: unknown) => Effect.Effect<void, never, never>} error - Log an error message
 * @property {(name: string) => LoggerShape} child - Create a child logger with a new name context
 */

export {}
