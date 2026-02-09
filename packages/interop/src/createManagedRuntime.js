import { Layer, ManagedRuntime } from 'effect'

/**
 * Create a managed runtime with proper lifecycle management.
 *
 * This is a convenience wrapper around `ManagedRuntime.make` that provides
 * a reusable pattern for creating runtimes with layers. The runtime can be
 * disposed when no longer needed, properly cleaning up resources.
 *
 * Note: This is a thin wrapper around `ManagedRuntime.make`. Consider using
 * `ManagedRuntime.make` directly if you don't need the abstraction.
 *
 * @example
 * ```typescript
 * import { createManagedRuntime, effectToPromise } from '@tevm/interop'
 * import { Effect, Layer, Context } from 'effect'
 *
 * // Define services
 * class LoggerService extends Context.Tag('LoggerService')<
 *   LoggerService,
 *   { log: (msg: string) => void }
 * >() {}
 *
 * const LoggerLive = Layer.succeed(LoggerService, {
 *   log: (msg) => console.log(msg)
 * })
 *
 * // Create runtime
 * const runtime = createManagedRuntime(LoggerLive)
 *
 * // Use the runtime
 * const program = Effect.gen(function* () {
 *   const logger = yield* LoggerService
 *   logger.log('Hello!')
 *   return 'done'
 * })
 *
 * const result = await runtime.runPromise(program)
 *
 * // Clean up when done
 * await runtime.dispose()
 * ```
 *
 * @template E - The error type of the layer
 * @template ROut - The services provided by the layer
 * @param {Layer.Layer<ROut, E, never>} layer - The layer to create a runtime from (must have no requirements)
 * @returns {ManagedRuntime.ManagedRuntime<ROut, E>} A managed runtime that must be disposed when no longer needed
 */
export const createManagedRuntime = (layer) => {
	return ManagedRuntime.make(layer)
}
