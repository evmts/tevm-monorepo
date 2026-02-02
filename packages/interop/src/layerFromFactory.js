import { Effect, Layer, Context } from 'effect'

/**
 * Create a Layer from an existing factory function that returns a Promise.
 *
 * This allows gradual migration of `create*` factory functions to Effect Layers.
 * The factory function is called when the Layer is provided, and its result
 * becomes the service implementation.
 *
 * Note: The resulting Layer has an error type of `unknown` since the factory
 * function's Promise may reject with any error type.
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
 * **Note**: This creates simple layers with no dependencies (R = never). If your factory
 * needs other services, use `Layer.effect` directly with `Effect.gen` instead.
 *
 * @template I - The service identifier type (what the Layer provides, typically the Tag class itself)
 * @template S - The service shape/interface type (the actual implementation interface)
 * @template O - The options type for the factory function
 * @param {Context.Tag<I, S>} tag - The Context.Tag for the service. The Layer will provide this service.
 * @param {(options: O) => Promise<S>} factory - The factory function that creates the service implementation
 * @returns {(options: O) => Layer.Layer<I, unknown, never>} A function that takes options and returns a Layer providing service I. Error type is `unknown` as the factory may reject with any value. R = never means no dependencies.
 */
export const layerFromFactory = (tag, factory) => {
	return (options) =>
		Layer.effect(
			tag,
			Effect.tryPromise(() => factory(options)),
		)
}
