import { Effect, Layer } from 'effect'
import { createStateManager } from '@tevm/state'
import { CommonService } from '@tevm/common-effect'
import { TransportService, ForkConfigService } from '@tevm/transport-effect'
import { StateRootNotFoundError } from '@tevm/errors-effect'
import { StateManagerService } from './StateManagerService.js'
import { createAddressFromString } from '@tevm/utils'

/**
 * Helper to convert an address (hex string or EthjsAddress) to EthjsAddress.
 * This handles the type mismatch between the public API (which accepts hex strings)
 * and the underlying StateManager (which expects EthjsAddress objects).
 *
 * @param {import('./types.js').Address} address - Address as hex string or EthjsAddress
 * @returns {import('@tevm/utils').EthjsAddress} EthjsAddress instance
 */
const toEthjsAddress = (address) => {
	if (typeof address === 'string') {
		return createAddressFromString(address)
	}
	return address
}


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
 *   // Get account from forked network - pass address as hex string directly
 *   const account = yield* stateManager.getAccount('0x1234567890123456789012345678901234567890')
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
				loggingLevel: options.loggingEnabled ? 'debug' : 'warn',
				fork: {
					transport: {
						// Note: Effect.runPromise is used here as a boundary between Effect and non-Effect code.
						// The createStateManager function expects a Promise-based transport, so we must convert.
						// Errors from transport.request are converted to Promise rejections which propagate
						// through createStateManager's error handling. (Issue #253 - documented architectural boundary)
						request: (method, params) =>
							Effect.runPromise(
								transport.request(method, params).pipe(
									Effect.tapError((error) =>
										Effect.logError(`Fork transport error: ${method}`, { error, method, params })
									)
								)
							),
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
						Effect.promise(() => sm.getAccount(toEthjsAddress(address))),

					putAccount: (address, account) =>
						Effect.promise(() => sm.putAccount(toEthjsAddress(address), account)),

					deleteAccount: (address) =>
						Effect.promise(() => sm.deleteAccount(toEthjsAddress(address))),

					getStorage: (address, slot) =>
						Effect.promise(() => sm.getStorage(toEthjsAddress(address), slot)),

					putStorage: (address, slot, value) =>
						Effect.promise(() => sm.putStorage(toEthjsAddress(address), slot, value)),

					clearStorage: (address) =>
						Effect.promise(() => sm.clearStorage(toEthjsAddress(address))),

					getCode: (address) =>
						Effect.promise(() => sm.getCode(toEthjsAddress(address))),

					putCode: (address, code) =>
						Effect.promise(() => sm.putCode(toEthjsAddress(address), code)),

					getStateRoot: () =>
						Effect.promise(() => sm.getStateRoot()),

					setStateRoot: (root) =>
						Effect.tryPromise({
							try: () => sm.setStateRoot(root),
							catch: (error) => {
								// Convert Uint8Array to hex string for error context
								const stateRootHex = `0x${Array.from(root)
									.map((b) => b.toString(16).padStart(2, '0'))
									.join('')}`
								return new StateRootNotFoundError({
									message: `State root not found: ${stateRootHex}`,
									stateRoot: /** @type {`0x${string}`} */ (stateRootHex),
									cause: /** @type {Error} */ (error),
								})
							},
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

					shallowCopy: () => createShape(/** @type {import('@tevm/state').StateManager} */ (sm.shallowCopy())),
				}
				return shape
			}

			return createShape(stateManager)
		}),
	)
}
