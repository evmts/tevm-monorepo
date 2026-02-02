/**
 * @module @tevm/logger-effect/LoggerService
 * @description Effect.ts Context.Tag for the LoggerService
 */
/**
 * @typedef {import('./LoggerShape.js').LoggerShape} LoggerShape
 */
/**
 * The LoggerService Context.Tag for Effect.ts dependency injection.
 *
 * This service provides type-safe, composable logging throughout TEVM's Effect pipelines.
 * Use with LoggerLive, LoggerSilent, or LoggerTest layers depending on your use case.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { LoggerService, LoggerLive } from '@tevm/logger-effect'
 *
 * const program = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   yield* logger.info('Starting operation', { id: 123 })
 *   // ... do work
 *   yield* logger.debug('Operation details', { result: 'success' })
 * })
 *
 * // Run with live logger
 * Effect.runPromise(
 *   program.pipe(Effect.provide(LoggerLive('info')))
 * )
 * ```
 *
 * @example
 * ```javascript
 * // Using child loggers for context
 * const program = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   const childLogger = logger.child('my-component')
 *   yield* childLogger.info('Component initialized')
 * })
 * ```
 *
 */
export const LoggerService: Context.Tag<any, any>;
export type LoggerShape = import("./LoggerShape.js").LoggerShape;
import { Context } from 'effect';
//# sourceMappingURL=LoggerService.d.ts.map