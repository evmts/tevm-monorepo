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
 * @property {(snapshotId: import('./types.js').Hex) => Promise<boolean>} revertToSnapshot - Revert to snapshot
 * @property {() => Promise<ViemMemoryClient>} deepCopy - Create deep copy of client
 * @property {() => Promise<void>} destroy - Dispose of client resources
 * @property {Object} effect - Effect escape hatch
 * @property {ManagedRuntime.ManagedRuntime<MemoryClientService, never>} effect.runtime - Managed runtime
 * @property {Layer.Layer<MemoryClientService, never, never>} effect.layer - Full composed layer
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
		hardfork: options.common?.hardfork ?? 'prague',
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

	return memoryClientComposedLayer
}

/**
 * Creates a viem-compatible wrapper for a deep-copied MemoryClientShape.
 * This is used internally for nested deepCopy operations.
 *
 * @param {ManagedRuntime.ManagedRuntime<MemoryClientService, never>} runtime
 * @returns {ViemMemoryClient}
 */
const createDeepCopyClient = (runtime) => {
	const runEffect = async (effect) => runtime.runPromise(effect)

	const withClient = (fn) =>
		Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* fn(client)
		})

	return {
		ready: () => runEffect(withClient((c) => c.ready)),
		getBlockNumber: () => runEffect(withClient((c) => c.getBlockNumber)),
		getChainId: () => runEffect(withClient((c) => c.getChainId)),
		tevmGetAccount: (params) => runEffect(withClient((c) => c.getAccount(params))),
		tevmSetAccount: (params) => runEffect(withClient((c) => c.setAccount(params))),
		getBalance: (params) => runEffect(withClient((c) => c.getBalance(params))),
		getCode: (params) => runEffect(withClient((c) => c.getCode(params))),
		getStorageAt: (params) => runEffect(withClient((c) => c.getStorageAt(params))),
		takeSnapshot: () => runEffect(withClient((c) => c.takeSnapshot())),
		revertToSnapshot: (snapshotId) => runEffect(withClient((c) => c.revertToSnapshot(snapshotId))),
		deepCopy: async function() {
			const copiedShape = await runEffect(withClient((c) => c.deepCopy()))
			const copiedLayer = Layer.succeed(MemoryClientService, copiedShape)
			const copiedRuntime = ManagedRuntime.make(copiedLayer)
			return createDeepCopyClient(copiedRuntime)
		},
		destroy: () => runtime.dispose(),
		effect: {
			runtime,
			layer: Layer.succeed(MemoryClientService, null), // Placeholder - actual layer not available
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

			// Create a custom layer that provides the copied shape directly
			const copiedLayer = Layer.succeed(MemoryClientService, copiedShape)

			// Create a new managed runtime with the copied layer
			const copiedRuntime = ManagedRuntime.make(copiedLayer)

			/**
			 * Helper to run effects on the copied runtime
			 * @template A
			 * @template E
			 * @param {Effect.Effect<A, E, MemoryClientService>} effect
			 * @returns {Promise<A>}
			 */
			const runCopiedEffect = async (effect) => {
				return copiedRuntime.runPromise(effect)
			}

			/**
			 * Helper for the copied client
			 * @template A
			 * @template E
			 * @param {(client: import('./types.js').MemoryClientShape) => Effect.Effect<A, E, never>} fn
			 * @returns {Effect.Effect<A, E, MemoryClientService>}
			 */
			const withCopiedClient = (fn) =>
				Effect.gen(function* () {
					const client = yield* MemoryClientService
					return yield* fn(client)
				})

			// Return a new client wrapper that uses the copied shape
			return {
				ready: () => runCopiedEffect(withCopiedClient((c) => c.ready)),
				getBlockNumber: () => runCopiedEffect(withCopiedClient((c) => c.getBlockNumber)),
				getChainId: () => runCopiedEffect(withCopiedClient((c) => c.getChainId)),
				tevmGetAccount: (params) => runCopiedEffect(withCopiedClient((c) => c.getAccount(params))),
				tevmSetAccount: (params) => runCopiedEffect(withCopiedClient((c) => c.setAccount(params))),
				getBalance: (params) => runCopiedEffect(withCopiedClient((c) => c.getBalance(params))),
				getCode: (params) => runCopiedEffect(withCopiedClient((c) => c.getCode(params))),
				getStorageAt: (params) => runCopiedEffect(withCopiedClient((c) => c.getStorageAt(params))),
				takeSnapshot: () => runCopiedEffect(withCopiedClient((c) => c.takeSnapshot())),
				revertToSnapshot: (snapshotId) => runCopiedEffect(withCopiedClient((c) => c.revertToSnapshot(snapshotId))),
				// Recursive deep copy works because the copied shape has its own deepCopy method
				deepCopy: async function() {
					const nestedCopiedShape = await runCopiedEffect(withCopiedClient((c) => c.deepCopy()))
					const nestedLayer = Layer.succeed(MemoryClientService, nestedCopiedShape)
					const nestedRuntime = ManagedRuntime.make(nestedLayer)
					// Return a simplified client for deep nested copies
					return createDeepCopyClient(nestedRuntime)
				},
				destroy: () => copiedRuntime.dispose(),
				effect: {
					runtime: copiedRuntime,
					layer: copiedLayer,
				},
			}
		},

		destroy: () => managedRuntime.dispose(),

		effect: {
			runtime: managedRuntime,
			layer,
		},
	}
}
