import { Effect, Layer } from 'effect'
import { createStateManager } from '@tevm/state'
import { CommonService } from '@tevm/common-effect'
import { TransportService, ForkConfigService } from '@tevm/transport-effect'
import {
	StateRootNotFoundError,
	StorageError,
	AccountNotFoundError,
	InternalError,
	NodeNotReadyError,
} from '@tevm/errors-effect'
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
						// Issue #314 fix: Preserve ForkError properties through Promise boundary by enriching
						// the thrown error with the original typed error's properties.
						request: (method, params) =>
							Effect.runPromise(
								transport.request(method, params).pipe(
									Effect.tapError((error) =>
										Effect.logError(`Fork transport error: ${method}`, { error, method, params })
									),
									// Issue #314: Catch typed ForkError and convert to enriched Error that preserves context
									Effect.catchTag('ForkError', (forkError) => {
										const enrichedError = /** @type {Error & { method?: string; code?: number; docsPath?: string; __isForkError?: boolean }} */ (
											new Error(forkError.message)
										)
										enrichedError.method = forkError.method
										enrichedError.code = forkError.code
										enrichedError.docsPath = forkError.docsPath
										enrichedError.cause = forkError.cause
										enrichedError.__isForkError = true
										return Effect.fail(enrichedError)
									})
								)
							),
					},
					blockTag: forkConfig.blockTag,
				},
			})

			// Wait for the state manager to be ready
			yield* Effect.tryPromise({
				try: () => stateManager.ready(),
				catch: (error) =>
					new NodeNotReadyError({
						message: `Failed to initialize state manager`,
						cause: /** @type {Error} */ (error),
					}),
			})

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
						Effect.tryPromise({
							try: () => sm.getAccount(toEthjsAddress(address)),
							catch: (error) =>
								new AccountNotFoundError({
									message: `Failed to get account for address ${String(address)}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					putAccount: (address, account) =>
						Effect.tryPromise({
							try: () => sm.putAccount(toEthjsAddress(address), account),
							catch: (error) =>
								new InternalError({
									message: `Failed to put account for address ${String(address)}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					deleteAccount: (address) =>
						Effect.tryPromise({
							try: () => sm.deleteAccount(toEthjsAddress(address)),
							catch: (error) =>
								new InternalError({
									message: `Failed to delete account for address ${String(address)}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					getStorage: (address, slot) =>
						Effect.tryPromise({
							try: () => sm.getStorage(toEthjsAddress(address), slot),
							catch: (error) =>
								new StorageError({
									message: `Failed to get storage for address ${String(address)}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					putStorage: (address, slot, value) =>
						Effect.tryPromise({
							try: () => sm.putStorage(toEthjsAddress(address), slot, value),
							catch: (error) =>
								new StorageError({
									message: `Failed to put storage for address ${String(address)}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					clearStorage: (address) =>
						Effect.tryPromise({
							try: () => sm.clearStorage(toEthjsAddress(address)),
							catch: (error) =>
								new StorageError({
									message: `Failed to clear storage for address ${String(address)}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					getCode: (address) =>
						Effect.tryPromise({
							try: () => sm.getCode(toEthjsAddress(address)),
							catch: (error) =>
								new InternalError({
									message: `Failed to get code for address ${String(address)}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					putCode: (address, code) =>
						Effect.tryPromise({
							try: () => sm.putCode(toEthjsAddress(address), code),
							catch: (error) =>
								new InternalError({
									message: `Failed to put code for address ${String(address)}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					getStateRoot: () =>
						Effect.tryPromise({
							try: () => sm.getStateRoot(),
							catch: (error) =>
								new StateRootNotFoundError({
									message: `Failed to get state root`,
									stateRoot: /** @type {`0x${string}`} */ ('0x'),
									cause: /** @type {Error} */ (error),
								}),
						}),

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
						Effect.tryPromise({
							try: () => sm.checkpoint(),
							catch: (error) =>
								new InternalError({
									message: `Failed to create state checkpoint`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					commit: () =>
						Effect.tryPromise({
							try: () => sm.commit(),
							catch: (error) =>
								new InternalError({
									message: `Failed to commit state changes`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					revert: () =>
						Effect.tryPromise({
							try: () => sm.revert(),
							catch: (error) =>
								new InternalError({
									message: `Failed to revert state to checkpoint`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					dumpState: () =>
						Effect.tryPromise({
							try: () => sm.dumpCanonicalGenesis(),
							catch: (error) =>
								new InternalError({
									message: `Failed to dump state`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					loadState: (state) =>
						Effect.tryPromise({
							try: () => sm.generateCanonicalGenesis(state),
							catch: (error) =>
								new InternalError({
									message: `Failed to load state`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					ready: Effect.tryPromise({
						try: () => sm.ready(),
						catch: (error) =>
							new NodeNotReadyError({
								message: `State manager failed to become ready`,
								cause: /** @type {Error} */ (error),
							}),
					}),

					deepCopy: () =>
						Effect.gen(function* () {
							const copiedSm = yield* Effect.tryPromise({
								try: () => sm.deepCopy(),
								catch: (error) =>
									new InternalError({
										message: `Failed to deep copy state manager`,
										cause: /** @type {Error} */ (error),
									}),
							})
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
