// Highly adapted from pino api https://github.com/pinojs/pino/blob/master/docs/api.md

/**
 * Log level used to control the verbosity of logging output
 * Follows standard logging level conventions from least to most verbose:
 * - fatal: Only critical errors that cause the application to crash
 * - error: Error conditions that might still allow the application to continue
 * - warn: Warning conditions that should be addressed
 * - info: Informational messages highlighting normal application progress
 * - debug: Detailed information for debugging purposes
 * - trace: Extremely detailed information including function entry/exit
 *
 * @example
 * ```typescript
 * import { Level } from '@tevm/logger'
 * 
 * // Using as a type
 * const logLevel: Level = 'info'
 * 
 * // Creating logger with specific level
 * const logger = createLogger({ 
 *   name: 'my-module',
 *   level: 'debug' // Show all logs at debug level and above 
 * })
 * ```
 */
export type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

/**
 * Options for logger
 */
export type LogOptions = {
	/**
	 * The name of the logger. Adds a name field to every JSON line logged.
	 */
	name: string
	/**
	 * The minimum level to log.
	 * Typically, debug and trace logs are only valid for development, and not needed in production.
	 */
	level: Level
}
