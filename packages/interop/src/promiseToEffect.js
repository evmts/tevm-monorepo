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
 * @example
 * ```typescript
 * import { promiseToEffect } from '@tevm/interop'
 * import { Effect } from 'effect'
 *
 * // Wrap an async function
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
 * // Wrap a method that returns a Promise
 * class DataService {
 *   async getData(id: string) { return { id } }
 * }
 *
 * const service = new DataService()
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
 * @param {(...args: Args) => Promise<A>} fn - The Promise-returning function to wrap
 * @returns {(...args: Args) => Effect.Effect<A, unknown, never>} A function that returns an Effect. The error type is `unknown` as the Promise may reject with any value.
 */
export const promiseToEffect = (fn) => {
	return (...args) => Effect.tryPromise(() => fn(...args))
}
