/**
 * @module @tevm/logger-effect/LoggerShape
 * @description Shape interface for the LoggerService
 */

/**
 * The shape of a logger instance provided by the LoggerService.
 * Implements the core logging methods with Effect-wrapped return types.
 *
 * @typedef {Object} LoggerShape
 * @property {import('./types.js').LogLevel} level - The configured minimum log level
 * @property {string} name - The logger name for contextual identification
 * @property {(message: string, data?: unknown) => import('effect').Effect.Effect<void, never, never>} debug - Log a debug message
 * @property {(message: string, data?: unknown) => import('effect').Effect.Effect<void, never, never>} info - Log an info message
 * @property {(message: string, data?: unknown) => import('effect').Effect.Effect<void, never, never>} warn - Log a warning message
 * @property {(message: string, data?: unknown) => import('effect').Effect.Effect<void, never, never>} error - Log an error message
 * @property {(childName: string) => LoggerShape} child - Create a child logger with a scoped name
 */

export {}
