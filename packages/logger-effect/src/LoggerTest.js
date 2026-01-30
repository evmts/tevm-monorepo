import { Effect, Layer, Ref } from 'effect'
import { LoggerService } from './LoggerService.js'

/**
 * @module @tevm/logger-effect/LoggerTest
 * @description Test implementation of LoggerService that captures logs for assertions
 */

/**
 * @typedef {import('./types.js').LogLevel} LogLevel
 * @typedef {import('./types.js').LogSeverity} LogSeverity
 * @typedef {import('./types.js').LogEntry} LogEntry
 * @typedef {import('./LoggerShape.js').LoggerShape} LoggerShape
 */

/**
 * Extended LoggerShape with additional methods for test assertions.
 *
 * @typedef {LoggerShape & {
 *   getLogs: () => Effect.Effect<readonly LogEntry[], never, never>,
 *   getLogsByLevel: (level: LogSeverity) => Effect.Effect<readonly LogEntry[], never, never>,
 *   clearLogs: () => Effect.Effect<void, never, never>,
 *   getLastLog: () => Effect.Effect<LogEntry | undefined, never, never>,
 *   getLogCount: () => Effect.Effect<number, never, never>
 * }} TestLoggerShape
 */

/**
 * Creates a test LoggerShape that captures all logs in memory for assertions.
 *
 * @param {Ref.Ref<readonly LogEntry[]>} logsRef - Reference to the log entries array
 * @param {LogLevel} [level='debug'] - Minimum log level to capture (defaults to debug to capture all)
 * @param {string} [name='tevm'] - Logger name for contextual logging
 * @returns {TestLoggerShape} The test logger shape implementation
 */
const createTestLoggerShape = (logsRef, level = 'debug', name = 'tevm') => {
	/**
	 * Log level priority for filtering
	 * @type {Record<LogLevel, number>}
	 */
	const levelPriority = {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
		silent: 4,
	}

	const currentPriority = levelPriority[level]

	/**
	 * Creates a log function that captures entries
	 * @param {LogSeverity} severity
	 * @returns {(message: string, data?: unknown) => Effect.Effect<void, never, never>}
	 */
	const createLogFn = (severity) => (message, data) =>
		Effect.gen(function* () {
			if (levelPriority[severity] >= currentPriority) {
				/** @type {LogEntry} */
				const entry = {
					level: severity,
					message,
					data,
					timestamp: Date.now(),
					loggerName: name,
				}
				yield* Ref.update(logsRef, (logs) => [...logs, entry])
			}
		})

	/** @type {TestLoggerShape} */
	const shape = {
		level,
		name,
		debug: createLogFn('debug'),
		info: createLogFn('info'),
		warn: createLogFn('warn'),
		error: createLogFn('error'),
		child: (childName) =>
			createTestLoggerShape(logsRef, level, `${name}:${childName}`),

		// Test-specific methods
		getLogs: () => Ref.get(logsRef),
		getLogsByLevel: (targetLevel) =>
			Effect.gen(function* () {
				const logs = yield* Ref.get(logsRef)
				return logs.filter((log) => log.level === targetLevel)
			}),
		clearLogs: () => Ref.set(logsRef, []),
		getLastLog: () =>
			Effect.gen(function* () {
				const logs = yield* Ref.get(logsRef)
				return logs[logs.length - 1]
			}),
		getLogCount: () =>
			Effect.gen(function* () {
				const logs = yield* Ref.get(logsRef)
				return logs.length
			}),
	}

	return shape
}

/**
 * Creates a test LoggerService layer that captures logs for assertions.
 *
 * This layer is designed for testing - it captures all log entries in memory
 * so tests can verify that appropriate logging occurred.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { LoggerService, LoggerTest } from '@tevm/logger-effect'
 *
 * const program = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   yield* logger.info('User logged in', { userId: 123 })
 *   yield* logger.error('Database connection failed', { error: 'timeout' })
 *
 *   // Assert on captured logs
 *   const logs = yield* logger.getLogs()
 *   expect(logs).toHaveLength(2)
 *   expect(logs[0].message).toBe('User logged in')
 *   expect(logs[0].level).toBe('info')
 *   expect(logs[1].level).toBe('error')
 * })
 *
 * Effect.runPromise(program.pipe(Effect.provide(LoggerTest())))
 * ```
 *
 * @example
 * ```javascript
 * // Filtering logs by level in tests
 * const program = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   yield* logger.debug('Debug message')
 *   yield* logger.info('Info message')
 *   yield* logger.error('Error message')
 *
 *   const errorLogs = yield* logger.getLogsByLevel('error')
 *   expect(errorLogs).toHaveLength(1)
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Clearing logs between test assertions
 * const program = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *
 *   yield* logger.info('First phase')
 *   let count = yield* logger.getLogCount()
 *   expect(count).toBe(1)
 *
 *   yield* logger.clearLogs()
 *
 *   yield* logger.info('Second phase')
 *   count = yield* logger.getLogCount()
 *   expect(count).toBe(1) // Only second phase log
 * })
 * ```
 *
 * @param {LogLevel} [level='debug'] - Minimum log level to capture. Defaults to 'debug' to capture all.
 * @param {string} [name='tevm'] - Root logger name. Defaults to 'tevm'.
 * @returns {Layer.Layer<LoggerService, never, never>} Layer providing LoggerService with test capabilities
 */
export const LoggerTest = (level = 'debug', name = 'tevm') =>
	Layer.effect(
		LoggerService,
		Effect.gen(function* () {
			/** @type {Ref.Ref<readonly LogEntry[]>} */
			const logsRef = yield* Ref.make(/** @type {readonly LogEntry[]} */ ([]))
			return createTestLoggerShape(logsRef, level, name)
		}),
	)

/**
 * Type guard to check if a LoggerShape is a TestLoggerShape.
 *
 * @param {LoggerShape} logger - The logger to check
 * @returns {logger is TestLoggerShape} True if the logger has test-specific methods
 *
 * @example
 * ```javascript
 * const program = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   if (isTestLogger(logger)) {
 *     const logs = yield* logger.getLogs()
 *     // Test assertions...
 *   }
 * })
 * ```
 */
export const isTestLogger = (logger) => {
	return 'getLogs' in logger && typeof logger.getLogs === 'function'
}
