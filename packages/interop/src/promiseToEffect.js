import { Effect } from 'effect'

/**
 * Convert a Promise-returning function to an Effect-returning function.
 *
 * Use this when wrapping existing Promise-based APIs to make them compatible
 * with Effect pipelines. The resulting function returns an Effect that will
 * either succeed with the Promise's resolved value or fail with the rejection.
 *
 * Note: The resulting Effect has an error type of `unknown` since the original
 * Promise may reject with any error type. Use Effect.catchAll or Effect.mapError
 * to refine the error type if needed.
 *
 * **⚠️ IMPORTANT: `this` binding is NOT preserved!**
 *
 * When wrapping class/object methods, you MUST bind `this` explicitly or the
 * method will lose its context and likely fail at runtime. This is a common
 * JavaScript gotcha that applies to any function wrapper.
 *
 * ```typescript
 * // ❌ WRONG - will fail because `this` is undefined
 * const getDataEffect = promiseToEffect(service.getData)
 *
 * // ✅ CORRECT - bind `this` explicitly
 * const getDataEffect = promiseToEffect(service.getData.bind(service))
 *
 * // ✅ ALSO CORRECT - use arrow function
 * const getDataEffect = promiseToEffect((id) => service.getData(id))
 * ```
 *
 * @example
 * ```typescript
 * import { promiseToEffect } from '@tevm/interop'
 * import { Effect } from 'effect'
 *
 * // Wrap a standalone async function (no binding needed)
 * const fetchData = async (url: string) => {
 *   const response = await fetch(url)
 *   return response.json()
 * }
 *
 * const fetchDataEffect = promiseToEffect(fetchData)
 *
 * // Now can use in Effect pipelines
 * const program = Effect.gen(function* () {
 *   const data = yield* fetchDataEffect('https://api.example.com')
 *   return data
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Wrap a method that returns a Promise - MUST use .bind()
 * class DataService {
 *   async getData(id: string) { return { id } }
 * }
 *
 * const service = new DataService()
 *
 * // ⚠️ IMPORTANT: Use .bind() to preserve `this` context
 * const getDataEffect = promiseToEffect(service.getData.bind(service))
 *
 * const program = Effect.gen(function* () {
 *   const data = yield* getDataEffect('123')
 *   return data
 * })
 * ```
 *
 * @template A - The return type of the Promise
 * @template Args - The argument types of the function
 * @param {(...args: Args) => Promise<A>} fn - The Promise-returning function to wrap. If this is a method, you MUST bind it first.
 * @returns {(...args: Args) => Effect.Effect<A, unknown, never>} A function that returns an Effect. The error type is `unknown` as the Promise may reject with any value.
 */
export const promiseToEffect = (fn) => {
	return (...args) => Effect.tryPromise(() => fn(...args))
}
