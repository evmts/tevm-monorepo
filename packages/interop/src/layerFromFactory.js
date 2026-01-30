import { Effect, Layer, Context } from 'effect'

/**
 * Create a Layer from an existing factory function that returns a Promise.
 *
 * This allows gradual migration of `create*` factory functions to Effect Layers.
 * The factory function is called when the Layer is provided, and its result
 * becomes the service implementation.
 *
 * @example
 * ```typescript
 * import { layerFromFactory } from '@tevm/interop'
 * import { Context, Effect, Layer } from 'effect'
 *
 * // Define the service interface
 * interface StateManager {
 *   readonly getAccount: (address: string) => Promise<Account>
 * }
 *
 * // Create the Context.Tag
 * class StateManagerService extends Context.Tag('StateManagerService')<
 *   StateManagerService,
 *   StateManager
 * >() {}
 *
 * // Existing factory function
 * async function createStateManager(options: { fork?: string }) {
 *   return {
 *     getAccount: async (address) => ({ balance: 0n })
 *   }
 * }
 *
 * // Create a Layer from the factory
 * const StateManagerLive = layerFromFactory(StateManagerService, createStateManager)
 *
 * // Use the Layer
 * const program = Effect.gen(function* () {
 *   const stateManager = yield* StateManagerService
 *   const account = yield* Effect.promise(() => stateManager.getAccount('0x...'))
 *   return account
 * }).pipe(Effect.provide(StateManagerLive({ fork: 'https://mainnet.infura.io' })))
 * ```
 *
 * @template I - The identifier type of the Context.Tag
 * @template S - The service interface type
 * @template O - The options type for the factory function
 * @param {Context.Tag<I, S>} tag - The Context.Tag for the service
 * @param {(options: O) => Promise<S>} factory - The factory function that creates the service
 * @returns {(options: O) => Layer.Layer<I, unknown, never>} A function that takes options and returns a Layer
 */
export const layerFromFactory = (tag, factory) => {
	return (options) =>
		Layer.effect(
			tag,
			Effect.tryPromise(() => factory(options)),
		)
}
