import { Effect, Layer } from 'effect'
import { createStateManager } from '@tevm/state'
import { CommonService } from '@tevm/common-effect'
import { TransportService, ForkConfigService } from '@tevm/transport-effect'
import { StateRootNotFoundError } from '@tevm/errors-effect'
import { StateManagerService } from './StateManagerService.js'

/**
 * @module @tevm/state-effect/StateManagerLive
 * @description Layer that creates StateManagerService for fork mode
 */

/**
 * @typedef {import('./types.js').StateManagerShape} StateManagerShape
 * @typedef {import('./types.js').StateManagerLiveOptions} StateManagerLiveOptions
 */

/**
 * Creates a StateManagerService layer for fork mode.
 *
 * This layer creates a state manager that forks from a remote network via RPC.
 * When state is requested that doesn't exist locally, it is fetched from
 * the remote network and cached locally.
 *
 * The layer requires:
 * - CommonService - Chain configuration
 * - TransportService - RPC transport for fetching remote state
 * - ForkConfigService - Fork configuration (chain ID, block number)
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { StateManagerService, StateManagerLive } from '@tevm/state-effect'
 * import { HttpTransport, ForkConfigFromRpc, ForkConfigService, TransportService } from '@tevm/transport-effect'
 * import { CommonService, CommonFromFork } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const stateManager = yield* StateManagerService
 *   yield* stateManager.ready
 *
 *   // Get account from forked network
 *   const account = yield* stateManager.getAccount('0x...')
 *   console.log('Account balance:', account?.balance)
 *
 *   // Get storage from forked network
 *   const storage = yield* stateManager.getStorage(address, slot)
 *   console.log('Storage value:', storage)
 * })
 *
 * // Build layer stack
 * const transportLayer = HttpTransport({ url: 'https://mainnet.optimism.io' })
 * const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)
 * const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
 * const stateManagerLayer = Layer.provide(
 *   StateManagerLive(),
 *   Layer.mergeAll(commonLayer, transportLayer, forkConfigLayer)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(stateManagerLayer)))
 * ```
 *
 * @param {StateManagerLiveOptions} [options] - Configuration options
 * @returns {Layer.Layer<StateManagerService, never, CommonService | TransportService | ForkConfigService>} Layer providing StateManagerService
 */
export const StateManagerLive = (options = {}) => {
	return Layer.effect(
		StateManagerService,
		Effect.gen(function* () {
			yield* CommonService
			const transport = yield* TransportService
			const forkConfig = yield* ForkConfigService

			const stateManager = createStateManager({
				loggingLevel: options.loggingEnabled ? 'debug' : 'silent',
				fork: {
					transport: {
						request: (method, params) =>
							Effect.runPromise(transport.request(method, params)),
					},
					blockTag: forkConfig.blockTag,
				},
			})

			// Wait for the state manager to be ready
			yield* Effect.promise(() => stateManager.ready())

			/**
			 * Helper to create StateManagerShape from a stateManager instance
			 * @param {import('@tevm/state').StateManager} sm
			 * @returns {StateManagerShape}
			 */
			const createShape = (sm) => {
				/** @type {StateManagerShape} */
				const shape = {
					stateManager: sm,

					getAccount: (address) =>
						Effect.promise(() => sm.getAccount(/** @type {any} */ (address))),

					putAccount: (address, account) =>
						Effect.promise(() => sm.putAccount(/** @type {any} */ (address), account)),

					deleteAccount: (address) =>
						Effect.promise(() => sm.deleteAccount(/** @type {any} */ (address))),

					getStorage: (address, slot) =>
						Effect.promise(() => sm.getStorage(/** @type {any} */ (address), slot)),

					putStorage: (address, slot, value) =>
						Effect.promise(() => sm.putStorage(/** @type {any} */ (address), slot, value)),

					clearStorage: (address) =>
						Effect.promise(() => sm.clearStorage(/** @type {any} */ (address))),

					getCode: (address) =>
						Effect.promise(() => sm.getCode(/** @type {any} */ (address))),

					putCode: (address, code) =>
						Effect.promise(() => sm.putCode(/** @type {any} */ (address), code)),

					getStateRoot: () =>
						Effect.promise(() => sm.getStateRoot()),

					setStateRoot: (root) =>
						Effect.tryPromise({
							try: () => sm.setStateRoot(root),
							catch: (error) =>
								new StateRootNotFoundError({
									message: `State root not found`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					checkpoint: () =>
						Effect.promise(() => sm.checkpoint()),

					commit: () =>
						Effect.promise(() => sm.commit()),

					revert: () =>
						Effect.promise(() => sm.revert()),

					dumpState: () =>
						Effect.promise(() => sm.dumpCanonicalGenesis()),

					loadState: (state) =>
						Effect.promise(() => sm.generateCanonicalGenesis(state)),

					ready: Effect.promise(() => sm.ready()),

					deepCopy: () =>
						Effect.gen(function* () {
							const copiedSm = yield* Effect.promise(() => sm.deepCopy())
							return createShape(copiedSm)
						}),

					shallowCopy: () => createShape(sm.shallowCopy()),
				}
				return shape
			}

			return createShape(stateManager)
		}),
	)
}
