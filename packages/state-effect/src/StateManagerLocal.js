import { CommonService } from '@tevm/common-effect'
import {
	AccountNotFoundError,
	InternalError,
	NodeNotReadyError,
	StateRootNotFoundError,
	StorageError,
} from '@tevm/errors-effect'
import { createStateManager } from '@tevm/state'
import { createAddressFromString } from '@tevm/utils'
import { Effect, Layer } from 'effect'
import { StateManagerService } from './StateManagerService.js'

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
 * @module @tevm/state-effect/StateManagerLocal
 * @description Layer that creates StateManagerService for local (non-fork) mode
 */

/**
 * @typedef {import('./types.js').StateManagerShape} StateManagerShape
 * @typedef {import('./types.js').StateManagerLocalOptions} StateManagerLocalOptions
 */

/**
 * Creates a StateManagerService layer for local (non-fork) mode.
 *
 * This layer creates a state manager that starts from empty state without forking
 * from any remote network. It's suitable for:
 * - Local development and testing
 * - Deterministic test environments
 * - Scenarios that don't require existing mainnet state
 *
 * The layer requires CommonService to be provided for chain configuration.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { StateManagerService, StateManagerLocal } from '@tevm/state-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const stateManager = yield* StateManagerService
 *   yield* stateManager.ready
 *
 *   const stateRoot = yield* stateManager.getStateRoot()
 *   console.log('State root:', stateRoot)
 * })
 *
 * // Run with local state manager
 * const layer = Layer.provide(StateManagerLocal(), CommonLocal)
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @example
 * ```javascript
 * // With checkpoint/commit pattern - now accepts hex string addresses directly!
 * const program = Effect.gen(function* () {
 *   const stateManager = yield* StateManagerService
 *   yield* stateManager.ready
 *
 *   // Create checkpoint for atomic operations
 *   yield* stateManager.checkpoint()
 *
 *   // Pass address as hex string - conversion is handled internally
 *   const address = '0x1234567890123456789012345678901234567890'
 *   const slot = new Uint8Array(32)
 *   const value = new Uint8Array([1, 2, 3, 4])
 *
 *   yield* stateManager.putStorage(address, slot, value)
 *   yield* stateManager.commit()
 * })
 * ```
 *
 * @param {StateManagerLocalOptions} [options] - Configuration options
 * @returns {Layer.Layer<StateManagerService, import('@tevm/errors-effect').NodeNotReadyError, CommonService>} Layer providing StateManagerService
 */
export const StateManagerLocal = (options = {}) => {
	return Layer.effect(
		StateManagerService,
		Effect.gen(function* () {
			// CommonService is available but we don't strictly need it for local mode
			// We yield it anyway to ensure consistent API with fork mode
			yield* CommonService

			const stateManager = createStateManager({
				loggingLevel: options.loggingEnabled ? 'debug' : 'warn',
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
