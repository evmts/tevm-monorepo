import { Effect, Runtime } from 'effect'

/**
 * Convert an Effect program to a Promise.
 *
 * Use this at the boundary when calling Effect code from Promise-based code.
 * This is useful during migration when you have Effect-based internal code
 * but need to maintain Promise-based public APIs.
 *
 * @example
 * ```typescript
 * import { effectToPromise } from '@tevm/interop'
 * import { Effect } from 'effect'
 *
 * const effect = Effect.succeed(42)
 *
 * // Convert to Promise for use in Promise-based code
 * const result = await effectToPromise(effect)
 * console.log(result) // 42
 * ```
 *
 * @example
 * ```typescript
 * // With custom runtime
 * import { effectToPromise } from '@tevm/interop'
 * import { Effect, Layer, ManagedRuntime } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   return yield* Effect.succeed('hello')
 * })
 *
 * const runtime = ManagedRuntime.make(Layer.empty)
 * const result = await effectToPromise(program, await runtime.runtime())
 * ```
 *
 * @template A - The success type of the Effect
 * @template E - The error type of the Effect
 * @param {Effect.Effect<A, E, never>} effect - The Effect to convert
 * @param {Runtime.Runtime<never>} [runtime] - Optional runtime to use. Defaults to defaultRuntime.
 * @returns {Promise<A>} A Promise that resolves with the Effect's success value or rejects with the error
 */
export const effectToPromise = (effect, runtime = Runtime.defaultRuntime) => {
	return Runtime.runPromise(runtime)(effect)
}
