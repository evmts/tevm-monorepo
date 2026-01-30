import { Effect, Layer } from 'effect'
import { createLogger } from '@tevm/logger'
import { LoggerService } from './LoggerService.js'

/**
 * @module @tevm/logger-effect/LoggerLive
 * @description Live implementation of LoggerService using Pino
 */

/**
 * @typedef {import('./types.js').LogLevel} LogLevel
 * @typedef {import('./LoggerShape.js').LoggerShape} LoggerShape
 */

/**
 * Maps our LogLevel to Pino's log levels
 * @type {Record<LogLevel, string>}
 */
const levelMap = {
	debug: 'debug',
	info: 'info',
	warn: 'warn',
	error: 'error',
	silent: 'silent',
}

/**
 * Log level priority for filtering (higher number = more severe)
 * @type {Record<LogLevel, number>}
 */
const levelPriority = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
	silent: 4,
}

/**
 * Creates a LoggerShape implementation that uses Pino under the hood.
 *
 * @param {LogLevel} level - Minimum log level to output
 * @param {string} [name='tevm'] - Logger name for contextual logging
 * @returns {LoggerShape} The logger shape implementation
 */
const createLoggerShape = (level, name = 'tevm') => {
	const pinoLogger = createLogger({
		level: level === 'silent' ? 'silent' : levelMap[level],
		name,
	})

	const currentPriority = levelPriority[level]

	/**
	 * Creates a log function that respects the current level
	 * @param {'debug' | 'info' | 'warn' | 'error'} severity
	 * @returns {(message: string, data?: unknown) => Effect.Effect<void, never, never>}
	 */
	const createLogFn = (severity) => (message, data) =>
		Effect.sync(() => {
			if (levelPriority[severity] >= currentPriority) {
				if (data !== undefined) {
					pinoLogger[severity](data, message)
				} else {
					pinoLogger[severity](message)
				}
			}
		})

	/** @type {LoggerShape} */
	const shape = {
		level,
		name,
		debug: createLogFn('debug'),
		info: createLogFn('info'),
		warn: createLogFn('warn'),
		error: createLogFn('error'),
		child: (childName) => createLoggerShape(level, `${name}:${childName}`),
	}

	return shape
}

/**
 * Creates a live LoggerService layer using Pino.
 *
 * This layer provides production-ready logging with configurable log levels.
 * Logs are output to stdout in JSON format (Pino's default).
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { LoggerService, LoggerLive } from '@tevm/logger-effect'
 *
 * const program = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   yield* logger.info('Server starting', { port: 3000 })
 *   yield* logger.debug('Configuration loaded', { config: { debug: true } })
 * })
 *
 * // Only info and above will be logged
 * Effect.runPromise(program.pipe(Effect.provide(LoggerLive('info'))))
 * ```
 *
 * @example
 * ```javascript
 * // Debug level for development
 * Effect.runPromise(program.pipe(Effect.provide(LoggerLive('debug'))))
 * ```
 *
 * @param {LogLevel} [level='warn'] - Minimum log level to output. Defaults to 'warn'.
 * @param {string} [name='tevm'] - Root logger name. Defaults to 'tevm'.
 * @returns {Layer.Layer<LoggerService, never, never>} Layer providing LoggerService
 */
export const LoggerLive = (level = 'warn', name = 'tevm') =>
	Layer.succeed(LoggerService, createLoggerShape(level, name))
