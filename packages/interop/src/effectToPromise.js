import { Effect, Runtime } from 'effect'

/**
 * Convert an Effect program to a Promise.
 *
 * Use this at the boundary when calling Effect code from Promise-based code.
 * This is useful during migration when you have Effect-based internal code
 * but need to maintain Promise-based public APIs.
 *
 * **⚠️ CRITICAL: Effects with requirements (R !== never) require a custom runtime!**
 *
 * If your Effect requires services (R type parameter is not `never`), you MUST
 * provide a runtime that satisfies those requirements. The default runtime only
 * works for Effects with no requirements (`Effect<A, E, never>`).
 *
 * Using the default runtime with an Effect that has requirements will:
 * - Compile without errors (due to type casting)
 * - **FAIL AT RUNTIME** with a missing service error
 *
 * ```typescript
 * // ❌ WILL FAIL AT RUNTIME - Effect requires FooService but default runtime doesn't have it
 * const effect: Effect<string, never, FooService> = ...
 * const result = await effectToPromise(effect) // Runtime error!
 *
 * // ✅ CORRECT - Provide a runtime that has FooService
 * const managedRuntime = ManagedRuntime.make(FooServiceLive)
 * const result = await effectToPromise(effect, await managedRuntime.runtime())
 *
 * // ✅ ALSO CORRECT - Provide all dependencies before converting
 * const satisfiedEffect = effect.pipe(Effect.provide(FooServiceLive))
 * const result = await effectToPromise(satisfiedEffect) // R is now never
 * ```
 *
 * @example
 * ```typescript
 * import { effectToPromise } from '@tevm/interop'
 * import { Effect } from 'effect'
 *
 * // Simple case: Effect with no requirements
 * const effect = Effect.succeed(42)
 *
 * // Convert to Promise for use in Promise-based code
 * const result = await effectToPromise(effect)
 * console.log(result) // 42
 * ```
 *
 * @example
 * ```typescript
 * // With custom runtime for Effects with requirements
 * import { effectToPromise } from '@tevm/interop'
 * import { Effect, Layer, ManagedRuntime, Context } from 'effect'
 *
 * // Define a service
 * class MyService extends Context.Tag('MyService')<MyService, { getValue: () => string }>() {}
 * const MyServiceLive = Layer.succeed(MyService, { getValue: () => 'hello' })
 *
 * // Effect that requires MyService
 * const program = Effect.gen(function* () {
 *   const svc = yield* MyService
 *   return svc.getValue()
 * })
 *
 * // Create runtime with the service
 * const managedRuntime = ManagedRuntime.make(MyServiceLive)
 * const result = await effectToPromise(program, await managedRuntime.runtime())
 * console.log(result) // 'hello'
 * ```
 *
 * @template A - The success type of the Effect
 * @template E - The error type of the Effect
 * @template R - The requirements type of the Effect (must be satisfied by the runtime)
 * @param {Effect.Effect<A, E, R>} effect - The Effect to convert
 * @param {Runtime.Runtime<R>} [runtime] - Optional runtime to use. Defaults to defaultRuntime. **MUST be provided if R !== never!**
 * @returns {Promise<A>} A Promise that resolves with the Effect's success value or rejects with the error
 * @throws {TypeError} If effect parameter is null or undefined
 * @throws {E} Rejects with the Effect's error type if the effect fails
 * @throws Will throw a runtime error if the Effect has requirements (R !== never) and no custom runtime is provided
 */
export const effectToPromise = (effect, runtime = /** @type {Runtime.Runtime<any>} */ (Runtime.defaultRuntime)) => {
	if (effect === null || effect === undefined) {
		return Promise.reject(new TypeError('effectToPromise: effect parameter is required and cannot be null or undefined'))
	}
	return Runtime.runPromise(runtime)(effect)
}
