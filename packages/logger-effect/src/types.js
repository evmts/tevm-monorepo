/**
 * @module @tevm/logger-effect/types
 * @description Type definitions for the Effect.ts LoggerService
 */

/**
 * Log level type for controlling logging verbosity.
 * Matches the base @tevm/logger Level type plus 'silent' for disabling all output.
 *
 * Levels from least to most verbose:
 * - fatal: Only critical errors that cause the application to crash
 * - error: Error conditions that might still allow the application to continue
 * - warn: Warning conditions that should be addressed
 * - info: Informational messages highlighting normal application progress
 * - debug: Detailed information for debugging purposes
 * - trace: Extremely detailed information including function entry/exit
 * - silent: Disables all logging output (configuration-only, not a method)
 *
 * @typedef {'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'} LogLevel
 */

/**
 * Union type of log entry severity levels (excludes 'silent' as it's a configuration-only level).
 * These correspond to the 4 primary log methods available on LoggerShape.
 * Note: While LogLevel includes 'fatal' and 'trace' for Pino compatibility,
 * LoggerShape only exposes 4 methods (debug, info, warn, error) for simplicity.
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
