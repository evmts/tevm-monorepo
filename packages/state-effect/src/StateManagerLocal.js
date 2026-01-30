import { Effect, Layer } from 'effect'
import { createStateManager } from '@tevm/state'
import { CommonService } from '@tevm/common-effect'
import { StateRootNotFoundError } from '@tevm/errors-effect'
import { StateManagerService } from './StateManagerService.js'

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
 * // With checkpoint/commit pattern
 * const program = Effect.gen(function* () {
 *   const stateManager = yield* StateManagerService
 *   yield* stateManager.ready
 *
 *   // Create checkpoint for atomic operations
 *   yield* stateManager.checkpoint()
 *
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
 * @returns {Layer.Layer<StateManagerService, never, CommonService>} Layer providing StateManagerService
 */
export const StateManagerLocal = (options = {}) => {
	return Layer.effect(
		StateManagerService,
		Effect.gen(function* () {
			// CommonService is available but we don't strictly need it for local mode
			// We yield it anyway to ensure consistent API with fork mode
			yield* CommonService

			const stateManager = createStateManager({
				loggingLevel: options.loggingEnabled ? 'debug' : 'silent',
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
