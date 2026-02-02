/**
 * @module @tevm/memory-client-effect/createMemoryClient
 * Viem-compatible wrapper for the Effect-based memory client
 */

import { Effect, ManagedRuntime, Layer } from 'effect'
import { MemoryClientService } from './MemoryClientService.js'
import { MemoryClientLive } from './MemoryClientLive.js'
import { StateManagerLocal } from '@tevm/state-effect'
import { VmLive } from '@tevm/vm-effect'
import { CommonFromConfig } from '@tevm/common-effect'
import { BlockchainLocal } from '@tevm/blockchain-effect'
import { EvmLive } from '@tevm/evm-effect'
// Note: Action services are now created inline in MemoryClientLive
// to ensure deepCopy creates services bound to the copied state manager
import { SnapshotLive } from '@tevm/node-effect'

/**
 * Required methods for MemoryClientShape contract.
 * Used for validation when creating layers from copied shapes.
 * @type {readonly string[]}
 */
const REQUIRED_SHAPE_METHODS = /** @type {const} */ ([
	'ready',
	'getBlockNumber',
	'getChainId',
	'getAccount',
	'setAccount',
	'getBalance',
	'getCode',
	'getStorageAt',
	'takeSnapshot',
	'revertToSnapshot',
	'deepCopy',
	'dispose',
])

/**
 * Validates that a shape implements the MemoryClientShape contract.
 * @param {unknown} shape - The shape to validate
 * @throws {Error} If the shape doesn't implement required methods
 * @returns {import('./types.js').MemoryClientShape} The validated shape
 */
const validateMemoryClientShape = (shape) => {
	if (!shape || typeof shape !== 'object') {
		throw new Error('Invalid MemoryClientShape: expected an object')
	}

	const missingMethods = REQUIRED_SHAPE_METHODS.filter(
		(method) => !(method in shape)
	)

	if (missingMethods.length > 0) {
		throw new Error(
			`Invalid MemoryClientShape: missing required methods: ${missingMethods.join(', ')}`
		)
	}

	return /** @type {import('./types.js').MemoryClientShape} */ (shape)
}

/**
 * @typedef {Object} ViemMemoryClient
 * @property {() => Promise<boolean>} ready - Wait for client to be ready
 * @property {() => Promise<bigint>} getBlockNumber - Get current block number
 * @property {() => Promise<bigint>} getChainId - Get chain ID
 * @property {(params: import('@tevm/actions-effect').GetAccountParams) => Promise<import('@tevm/actions-effect').GetAccountSuccess>} tevmGetAccount - Get account info
 * @property {(params: import('@tevm/actions-effect').SetAccountParams) => Promise<import('@tevm/actions-effect').SetAccountSuccess>} tevmSetAccount - Set account state
 * @property {(params: import('@tevm/actions-effect').GetBalanceParams) => Promise<bigint>} getBalance - Get account balance
 * @property {(params: import('@tevm/actions-effect').GetCodeParams) => Promise<import('./types.js').Hex>} getCode - Get account code
 * @property {(params: import('@tevm/actions-effect').GetStorageAtParams) => Promise<import('./types.js').Hex>} getStorageAt - Get storage value
 * @property {() => Promise<import('./types.js').Hex>} takeSnapshot - Take state snapshot
 * @property {(snapshotId: import('./types.js').Hex) => Promise<void>} revertToSnapshot - Revert to snapshot
 * @property {() => Promise<ViemMemoryClient>} deepCopy - Create deep copy of client
 * @property {() => Promise<void>} destroy - Dispose of client resources
 * @property {Object} effect - Effect escape hatch
 * @property {ManagedRuntime.ManagedRuntime<MemoryClientService, never>} effect.runtime - Managed runtime
 * @property {Layer.Layer<MemoryClientService, never, never>} effect.layer - Full composed layer (throws Error on deep-copied clients - use runtime instead)
 */

/**
 * Creates the full composed layer for the memory client.
 *
 * This composes all required Effect layers:
 * - Common configuration
 * - State management
 * - VM execution
 * - Action handlers
 * - Snapshot/filter services
 *
 * @param {import('./types.js').MemoryClientOptions} [options] - Client configuration
 * @returns {Layer.Layer<MemoryClientService, never, never>}
 */
const createFullLayer = (options = {}) => {
	// Create common layer with chain configuration
	const commonLayer = CommonFromConfig({
		chainId: options.common?.chainId ?? options.fork?.chainId ?? 1,
		hardfork: /** @type {import('@tevm/common-effect').Hardfork} */ (options.common?.hardfork ?? 'prague'),
		eips: options.common?.eips ?? [],
	})

	// Create state manager layer (depends on common)
	const stateManagerLayer = Layer.provide(StateManagerLocal(), commonLayer)

	// Create blockchain layer (depends on common)
	const blockchainLayer = Layer.provide(BlockchainLocal(), commonLayer)

	// Create EVM layer (depends on common, state manager, blockchain)
	const evmLayer = Layer.provide(
		EvmLive(),
		Layer.mergeAll(commonLayer, stateManagerLayer, blockchainLayer)
	)

	// Create VM layer (depends on common, state manager, blockchain, evm)
	const vmLayer = Layer.provide(
		VmLive(),
		Layer.mergeAll(commonLayer, stateManagerLayer, blockchainLayer, evmLayer)
	)

	// Action services are now created inline in MemoryClientLive
	// to ensure deepCopy creates services bound to the copied state manager

	// Create node service layers (snapshot depends on state manager)
	const snapshotLayer = SnapshotLive()
	const snapshotComposedLayer = Layer.provide(snapshotLayer, stateManagerLayer)

	// Merge all service layers together
	const servicesLayer = Layer.mergeAll(
		commonLayer,
		stateManagerLayer,
		blockchainLayer,
		evmLayer,
		vmLayer,
		snapshotComposedLayer
	)

	// Finally: memory client layer on top
	const memoryClientComposedLayer = Layer.provide(MemoryClientLive, servicesLayer)

	return /** @type {Layer.Layer<MemoryClientService, never, never>} */ (memoryClientComposedLayer)
}

/**
 * Creates a viem-compatible wrapper for a deep-copied MemoryClientShape.
 * This is used internally for nested deepCopy operations.
 *
 * @param {ManagedRuntime.ManagedRuntime<MemoryClientService, never>} runtime
 * @returns {ViemMemoryClient}
 */
const createDeepCopyClient = (runtime) => {
	/**
	 * Helper to run an Effect program with the managed runtime
	 * @template A
	 * @template E
	 * @param {Effect.Effect<A, E, MemoryClientService>} effect
	 * @returns {Promise<A>}
	 */
	const runEffect = async (effect) => runtime.runPromise(effect)

	/**
	 * Helper to create a program that uses the MemoryClientService
	 * @template A
	 * @template E
	 * @param {(client: import('./types.js').MemoryClientShape) => Effect.Effect<A, E, never>} fn
	 * @returns {Effect.Effect<A, E, MemoryClientService>}
	 */
	const withClient = (fn) =>
		Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* fn(client)
		})

	return {
		ready: () => runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.ready)),
		getBlockNumber: () => runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.getBlockNumber)),
		getChainId: () => runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.getChainId)),
		tevmGetAccount: (/** @type {import('@tevm/actions-effect').GetAccountParams} */ params) => runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.getAccount(params))),
		tevmSetAccount: (/** @type {import('@tevm/actions-effect').SetAccountParams} */ params) => runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.setAccount(params))),
		getBalance: (/** @type {import('@tevm/actions-effect').GetBalanceParams} */ params) => runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.getBalance(params))),
		getCode: (/** @type {import('@tevm/actions-effect').GetCodeParams} */ params) => runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.getCode(params))),
		getStorageAt: (/** @type {import('@tevm/actions-effect').GetStorageAtParams} */ params) => runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.getStorageAt(params))),
		takeSnapshot: () => runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.takeSnapshot())),
		revertToSnapshot: (/** @type {import('./types.js').Hex} */ snapshotId) => runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.revertToSnapshot(snapshotId))),
		deepCopy: async function() {
			const copiedShape = await runEffect(withClient((/** @type {import('./types.js').MemoryClientShape} */ c) => c.deepCopy()))
			// Validate the copied shape implements the required contract
			const validatedShape = validateMemoryClientShape(copiedShape)
			const copiedLayer = Layer.succeed(MemoryClientService, validatedShape)
			const copiedRuntime = ManagedRuntime.make(copiedLayer)
			try {
				return createDeepCopyClient(copiedRuntime)
			} catch (e) {
				// Dispose runtime on failure to prevent resource leak
				// Fire-and-forget pattern: dispose() returns Promise but we're about to throw
				copiedRuntime.dispose().catch((/** @type {unknown} */ disposeError) => {
					console.error('[createMemoryClient] Failed to dispose runtime during error recovery:', disposeError)
				})
				throw e
			}
		},
		destroy: () => runtime.dispose(),
		effect: {
			runtime,
			// Note: The original composed layer is not available in deep-copied clients.
			// Use the runtime to run Effects instead. Accessing this layer throws an error
			// to prevent misuse - use the parent client's layer if needed.
			/** @type {Layer.Layer<MemoryClientService, never, never>} */
			get layer() {
				throw /** @type {never} */ (new Error('layer is not available on deep-copied clients. Use effect.runtime instead, or access the layer from the original client.'))
			},
		},
	}
}

/**
 * Creates a viem-compatible memory client backed by Effect.
 *
 * This function provides backward compatibility with the existing Promise-based
 * memory client API while internally using Effect.ts for type-safe, composable
 * operations.
 *
 * The client exposes:
 * - Standard viem-compatible Promise methods (getBlockNumber, getBalance, etc.)
 * - TEVM-specific methods (tevmGetAccount, tevmSetAccount, takeSnapshot, etc.)
 * - An `effect` property for advanced users who want to work with Effect directly
 * - A `destroy()` method for proper resource cleanup
 *
 * @example
 * ```javascript
 * import { createMemoryClient } from '@tevm/memory-client-effect'
 *
 * // Create client with default options
 * const client = createMemoryClient()
 *
 * // Wait for ready
 * await client.ready()
 *
 * // Use viem-compatible API
 * const blockNumber = await client.getBlockNumber()
 * const balance = await client.getBalance({
 *   address: '0x1234567890123456789012345678901234567890'
 * })
 *
 * // TEVM-specific operations
 * await client.tevmSetAccount({
 *   address: '0x1234567890123456789012345678901234567890',
 *   balance: 1000000000000000000n
 * })
 *
 * // Snapshot/restore
 * const snapshotId = await client.takeSnapshot()
 * // ... make changes ...
 * await client.revertToSnapshot(snapshotId)
 *
 * // Advanced: access Effect runtime directly
 * const result = await client.effect.runtime.runPromise(
 *   Effect.gen(function* () {
 *     const memClient = yield* MemoryClientService
 *     return yield* memClient.getBlockNumber
 *   })
 * )
 *
 * // Clean up when done
 * await client.destroy()
 * ```
 *
 * @example
 * ```javascript
 * // With fork configuration
 * const client = createMemoryClient({
 *   fork: {
 *     url: 'https://mainnet.infura.io/v3/YOUR_KEY',
 *     blockNumber: 18000000n
 *   }
 * })
 * ```
 *
 * @param {import('./types.js').MemoryClientOptions} [options] - Client configuration
 * @returns {ViemMemoryClient}
 */
export const createMemoryClient = (options = {}) => {
	// Create the full composed layer
	const layer = createFullLayer(options)

	// Create managed runtime for lifecycle management
	const managedRuntime = ManagedRuntime.make(layer)

	/**
	 * Helper to run an Effect program with the managed runtime
	 * @template A
	 * @template E
	 * @param {Effect.Effect<A, E, MemoryClientService>} effect
	 * @returns {Promise<A>}
	 */
	const runEffect = async (effect) => {
		return managedRuntime.runPromise(effect)
	}

	/**
	 * Helper to create a program that uses the MemoryClientService
	 * @template A
	 * @template E
	 * @param {(client: import('./types.js').MemoryClientShape) => Effect.Effect<A, E, never>} fn
	 * @returns {Effect.Effect<A, E, MemoryClientService>}
	 */
	const withClient = (fn) =>
		Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* fn(client)
		})

	return {
		ready: () => runEffect(withClient((c) => c.ready)),

		getBlockNumber: () => runEffect(withClient((c) => c.getBlockNumber)),

		getChainId: () => runEffect(withClient((c) => c.getChainId)),

		tevmGetAccount: (params) =>
			runEffect(withClient((c) => c.getAccount(params))),

		tevmSetAccount: (params) =>
			runEffect(withClient((c) => c.setAccount(params))),

		getBalance: (params) =>
			runEffect(withClient((c) => c.getBalance(params))),

		getCode: (params) =>
			runEffect(withClient((c) => c.getCode(params))),

		getStorageAt: (params) =>
			runEffect(withClient((c) => c.getStorageAt(params))),

		takeSnapshot: () =>
			runEffect(withClient((c) => c.takeSnapshot())),

		revertToSnapshot: (snapshotId) =>
			runEffect(withClient((c) => c.revertToSnapshot(snapshotId))),

		deepCopy: async () => {
			// Get the copied MemoryClientShape from the current client
			const copiedShape = await runEffect(
				withClient((c) => c.deepCopy())
			)

			// Validate the copied shape implements the required contract
			const validatedShape = validateMemoryClientShape(copiedShape)

			// Create a custom layer that provides the copied shape directly
			const copiedLayer = Layer.succeed(MemoryClientService, validatedShape)

			// Create a new managed runtime with the copied layer
			const copiedRuntime = ManagedRuntime.make(copiedLayer)

			// Reuse createDeepCopyClient to eliminate code duplication
			try {
				return createDeepCopyClient(copiedRuntime)
			} catch (e) {
				// Dispose runtime on failure to prevent resource leak
				// Fire-and-forget pattern: dispose() returns Promise but we're about to throw
				copiedRuntime.dispose().catch((disposeError) => {
					console.error('[createMemoryClient] Failed to dispose runtime during error recovery:', disposeError)
				})
				throw e
			}
		},

		destroy: () => managedRuntime.dispose(),

		effect: {
			runtime: managedRuntime,
			layer,
		},
	}
}
