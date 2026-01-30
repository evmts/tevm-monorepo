import { Effect, Layer } from 'effect'
import { LoggerService } from './LoggerService.js'

/**
 * @module @tevm/logger-effect/LoggerSilent
 * @description Silent implementation of LoggerService that discards all logs
 */

/**
 * @typedef {import('./LoggerShape.js').LoggerShape} LoggerShape
 */

/**
 * Creates a silent LoggerShape that discards all log messages.
 *
 * @param {string} [name='tevm'] - Logger name (preserved for child logger creation)
 * @returns {LoggerShape} The silent logger shape implementation
 */
const createSilentLoggerShape = (name = 'tevm') => {
	/** @type {LoggerShape} */
	const shape = {
		level: 'silent',
		name,
		// Parameters match LoggerShape interface (Issue #38 fix)
		debug: (_message, _data) => Effect.void,
		info: (_message, _data) => Effect.void,
		warn: (_message, _data) => Effect.void,
		error: (_message, _data) => Effect.void,
		child: (childName) => createSilentLoggerShape(`${name}:${childName}`),
	}

	return shape
}

/**
 * A silent LoggerService layer that discards all log messages.
 *
 * Use this layer in production scenarios where logging overhead is unacceptable,
 * or in tests where log output would be noisy and distracting.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { LoggerService, LoggerSilent } from '@tevm/logger-effect'
 *
 * const program = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   yield* logger.info('This will not be logged')
 *   yield* logger.error('Neither will this')
 * })
 *
 * // All logs are silently discarded
 * Effect.runPromise(program.pipe(Effect.provide(LoggerSilent)))
 * ```
 *
 * @example
 * ```javascript
 * // Useful for benchmarking without log overhead
 * const benchmark = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   for (let i = 0; i < 10000; i++) {
 *     yield* logger.debug('iteration', { i })
 *   }
 * })
 *
 * Effect.runPromise(benchmark.pipe(Effect.provide(LoggerSilent)))
 * ```
 *
 * @type {Layer.Layer<LoggerService, never, never>}
 */
export const LoggerSilent = Layer.succeed(LoggerService, createSilentLoggerShape())
