/**
 * @module @tevm/logger-effect/types
 * @description Type definitions for the Effect.ts LoggerService
 */

/**
 * Log level type for controlling logging verbosity
 * @typedef {'debug' | 'info' | 'warn' | 'error' | 'silent'} LogLevel
 */

/**
 * Union type of log entry severity levels (excludes 'silent' as it's a configuration-only level)
 * @typedef {'debug' | 'info' | 'warn' | 'error'} LogSeverity
 */

/**
 * A log entry captured by LoggerTest
 * @typedef {Object} LogEntry
 * @property {LogSeverity} level - The severity level of the log entry
 * @property {string} message - The log message
 * @property {unknown} [data] - Optional structured data attached to the log
 * @property {number} timestamp - Unix timestamp when the log was created
 * @property {string} [loggerName] - Name of the logger that created this entry
 */

export {}
