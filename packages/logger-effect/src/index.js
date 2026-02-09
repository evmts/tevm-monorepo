/**
 * @module @tevm/logger-effect
 * @description Effect.ts LoggerService for type-safe, composable logging in TEVM
 *
 * This package provides an Effect.ts-native logging service that integrates
 * with TEVM's Effect-based architecture. It offers three layer implementations:
 *
 * - **LoggerLive**: Production logger using Pino with configurable log levels
 * - **LoggerSilent**: Silent logger that discards all output (for benchmarking)
 * - **LoggerTest**: Test logger that captures logs in memory for assertions
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { LoggerService, LoggerLive } from '@tevm/logger-effect'
 *
 * const program = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   yield* logger.info('Operation started', { id: 123 })
 *   // ... do work
 *   yield* logger.debug('Detailed info', { result: 'success' })
 * })
 *
 * // Run with live logger at info level
 * Effect.runPromise(program.pipe(Effect.provide(LoggerLive('info'))))
 * ```
 *
 * @example
 * ```javascript
 * import { LoggerService, LoggerTest, isTestLogger } from '@tevm/logger-effect'
 *
 * // Testing with captured logs
 * const testProgram = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   yield* logger.error('Something failed', { code: 'E001' })
 *
 *   if (isTestLogger(logger)) {
 *     const logs = yield* logger.getLogs()
 *     expect(logs).toHaveLength(1)
 *     expect(logs[0].level).toBe('error')
 *   }
 * })
 *
 * Effect.runPromise(testProgram.pipe(Effect.provide(LoggerTest())))
 * ```
 */

// Shape interface
export * from './LoggerShape.js'
// Types (re-exported for convenience)
export * from './types.js'

/**
 * Re-export TestLoggerShape for consumers
 * @typedef {import('./LoggerTest.js').TestLoggerShape} TestLoggerShape
 */

// Layer implementations
export { LoggerLive } from './LoggerLive.js'
// Service tag
export { LoggerService } from './LoggerService.js'
export { LoggerSilent } from './LoggerSilent.js'
export { isTestLogger, LoggerTest } from './LoggerTest.js'
