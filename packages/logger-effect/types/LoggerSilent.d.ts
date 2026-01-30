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
export const LoggerSilent: Layer.Layer<import("effect/Context").Tag<any, any>, never, never>;
export type LoggerShape = import("./LoggerShape.js").LoggerShape;
import { Layer } from 'effect';
//# sourceMappingURL=LoggerSilent.d.ts.map