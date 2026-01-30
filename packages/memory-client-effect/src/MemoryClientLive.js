/**
 * @module @tevm/memory-client-effect/MemoryClientLive
 * Layer implementation for the Effect-based memory client
 */

import { Effect, Layer, Ref } from 'effect'
import { MemoryClientService } from './MemoryClientService.js'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { CommonService } from '@tevm/common-effect'
// Note: Action services are created inline in createActionServices() to ensure
// deepCopy creates services bound to the copied state manager
import { SnapshotService } from '@tevm/node-effect'
import { InvalidParamsError, InternalError } from '@tevm/errors-effect'

/**
 * Helper to convert address to EthjsAddress
 * @param {string} address - Hex address string
 * @returns {Promise<import('@tevm/utils').EthjsAddress>}
 */
const createEthjsAddress = async (address) => {
	const { createAddressFromString } = await import('@tevm/utils')
	return createAddressFromString(address)
}

/**
 * Validates an Ethereum address
 * @param {string} address
 * @returns {boolean}
 */
const isValidAddress = (address) => {
	return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Converts bytes to hex string
 * @param {Uint8Array} bytes
 * @returns {import('./types.js').Hex}
 */
const bytesToHex = (bytes) => {
	if (!bytes || bytes.length === 0) return /** @type {import('./types.js').Hex} */ ('0x')
	return /** @type {import('./types.js').Hex} */ ('0x' + Buffer.from(bytes).toString('hex'))
}

/**
 * Creates action service wrappers bound to a specific StateManagerShape.
 * This allows deepCopy to create services that operate on the copied state.
 *
 * @param {import('@tevm/state-effect').StateManagerShape} stateManager
 * @returns {Object} Action service implementations
 */
const createActionServices = (stateManager) => {
	return {
		/**
		 * Get account implementation using the provided stateManager
		 * @param {import('@tevm/actions-effect').GetAccountParams} params
		 * @returns {import('effect').Effect.Effect<import('@tevm/actions-effect').GetAccountSuccess, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>}
		 */
		getAccount: (params) =>
			Effect.gen(function* () {
				// Validate address
				if (!params.address || !isValidAddress(params.address)) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getAccount',
							params,
							message: `Invalid address: ${params.address}`,
						})
					)
				}

				const ethjsAddress = yield* Effect.promise(() => createEthjsAddress(params.address.toLowerCase()))

				const account = yield* stateManager.getAccount(ethjsAddress).pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to get account: ${e instanceof Error ? e.message : String(e)}`,
								cause: e instanceof Error ? e : undefined,
							})
					)
				)

				const code = yield* stateManager.getCode(ethjsAddress).pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to get code: ${e instanceof Error ? e.message : String(e)}`,
								cause: e instanceof Error ? e : undefined,
							})
					)
				)

				const nonce = account?.nonce ?? 0n
				const balance = account?.balance ?? 0n
				const storageRoot = account ? bytesToHex(account.storageRoot) : '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
				const codeHash = account ? bytesToHex(account.codeHash) : '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

				return {
					address: /** @type {import('./types.js').Address} */ (params.address.toLowerCase()),
					nonce,
					balance,
					deployedBytecode: bytesToHex(code),
					storageRoot: /** @type {import('./types.js').Hex} */ (storageRoot),
					codeHash: /** @type {import('./types.js').Hex} */ (codeHash),
					isContract: code.length > 0,
					isEmpty: nonce === 0n && balance === 0n && code.length === 0,
					storage: undefined,
				}
			}),

		/**
		 * Set account implementation using the provided stateManager
		 * @param {import('@tevm/actions-effect').SetAccountParams} params
		 * @returns {import('effect').Effect.Effect<import('@tevm/actions-effect').SetAccountSuccess, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>}
		 */
		setAccount: (params) =>
			Effect.gen(function* () {
				// Validate address
				if (!params.address || !isValidAddress(params.address)) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'setAccount',
							params,
							message: `Invalid address: ${params.address}`,
						})
					)
				}

				const ethjsAddress = yield* Effect.promise(() => createEthjsAddress(params.address.toLowerCase()))
				const { Account } = yield* Effect.promise(() => import('@ethereumjs/util'))

				// Create checkpoint for atomic operation
				yield* stateManager.checkpoint()

				try {
					const account = new Account(params.nonce ?? 0n, params.balance ?? 0n)
					yield* stateManager.putAccount(ethjsAddress, account).pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to put account: ${e instanceof Error ? e.message : String(e)}`,
									cause: e instanceof Error ? e : undefined,
								})
						)
					)

					// Set code if provided
					if (params.deployedBytecode) {
						const codeHex = params.deployedBytecode.startsWith('0x')
							? params.deployedBytecode.slice(2)
							: params.deployedBytecode
						const normalizedHex = codeHex.length % 2 === 1 ? '0' + codeHex : codeHex
						const codeBytes = new Uint8Array(normalizedHex.length / 2)
						for (let i = 0; i < codeBytes.length; i++) {
							codeBytes[i] = parseInt(normalizedHex.substring(i * 2, i * 2 + 2), 16)
						}
						yield* stateManager.putCode(ethjsAddress, codeBytes).pipe(
							Effect.mapError(
								(e) =>
									new InternalError({
										message: `Failed to put code: ${e instanceof Error ? e.message : String(e)}`,
										cause: e instanceof Error ? e : undefined,
									})
							)
						)
					}

					// Set storage if provided
					if (params.state) {
						for (const [key, value] of Object.entries(params.state)) {
							const keyHex = key.startsWith('0x') ? key.slice(2) : key
							const valueHex = value.startsWith('0x') ? value.slice(2) : value
							const keyBytes = new Uint8Array(32)
							const valueBytes = new Uint8Array(32)

							const normalizedKey = keyHex.padStart(64, '0')
							const normalizedValue = valueHex.padStart(64, '0')

							for (let i = 0; i < 32; i++) {
								keyBytes[i] = parseInt(normalizedKey.substring(i * 2, i * 2 + 2), 16)
								valueBytes[i] = parseInt(normalizedValue.substring(i * 2, i * 2 + 2), 16)
							}

							yield* stateManager.putStorage(ethjsAddress, keyBytes, valueBytes).pipe(
								Effect.mapError(
									(e) =>
										new InternalError({
											message: `Failed to put storage: ${e instanceof Error ? e.message : String(e)}`,
											cause: e instanceof Error ? e : undefined,
										})
								)
							)
						}
					}

					yield* stateManager.commit()

					return {
						address: /** @type {import('./types.js').Address} */ (params.address.toLowerCase()),
					}
				} catch (error) {
					yield* stateManager.revert()
					throw error
				}
			}),

		/**
		 * Get balance implementation using the provided stateManager
		 * @param {import('@tevm/actions-effect').GetBalanceParams} params
		 * @returns {import('effect').Effect.Effect<bigint, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>}
		 */
		getBalance: (params) =>
			Effect.gen(function* () {
				// Validate address
				if (!params.address || !isValidAddress(params.address)) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getBalance',
							params,
							message: `Invalid address: ${params.address}`,
						})
					)
				}

				const ethjsAddress = yield* Effect.promise(() => createEthjsAddress(params.address.toLowerCase()))

				const account = yield* stateManager.getAccount(ethjsAddress).pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to get account: ${e instanceof Error ? e.message : String(e)}`,
								cause: e instanceof Error ? e : undefined,
							})
					)
				)

				return account?.balance ?? 0n
			}),

		/**
		 * Get code implementation using the provided stateManager
		 * @param {import('@tevm/actions-effect').GetCodeParams} params
		 * @returns {import('effect').Effect.Effect<import('./types.js').Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>}
		 */
		getCode: (params) =>
			Effect.gen(function* () {
				// Validate address
				if (!params.address || !isValidAddress(params.address)) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getCode',
							params,
							message: `Invalid address: ${params.address}`,
						})
					)
				}

				const ethjsAddress = yield* Effect.promise(() => createEthjsAddress(params.address.toLowerCase()))

				const code = yield* stateManager.getCode(ethjsAddress).pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to get code: ${e instanceof Error ? e.message : String(e)}`,
								cause: e instanceof Error ? e : undefined,
							})
					)
				)

				return bytesToHex(code)
			}),

		/**
		 * Get storage at implementation using the provided stateManager
		 * @param {import('@tevm/actions-effect').GetStorageAtParams} params
		 * @returns {import('effect').Effect.Effect<import('./types.js').Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>}
		 */
		getStorageAt: (params) =>
			Effect.gen(function* () {
				// Validate address
				if (!params.address || !isValidAddress(params.address)) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getStorageAt',
							params,
							message: `Invalid address: ${params.address}`,
						})
					)
				}

				// Validate position
				if (params.position === undefined) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getStorageAt',
							params,
							message: 'Missing required field: position',
						})
					)
				}

				const ethjsAddress = yield* Effect.promise(() => createEthjsAddress(params.address.toLowerCase()))

				// Convert position to bytes
				const positionHex = params.position.startsWith('0x')
					? params.position.slice(2)
					: params.position
				const normalizedHex = positionHex.length % 2 === 1 ? '0' + positionHex : positionHex
				const positionBytes = new Uint8Array(32)
				const paddedHex = normalizedHex.padStart(64, '0')
				for (let i = 0; i < 32; i++) {
					positionBytes[i] = parseInt(paddedHex.substring(i * 2, i * 2 + 2), 16)
				}

				const storage = yield* stateManager.getStorage(ethjsAddress, positionBytes).pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to get storage: ${e instanceof Error ? e.message : String(e)}`,
								cause: e instanceof Error ? e : undefined,
							})
					)
				)

				// Pad storage to 32 bytes for consistent return
				const paddedStorage = new Uint8Array(32)
				paddedStorage.set(storage, 32 - storage.length)
				return bytesToHex(paddedStorage)
			}),
	}
}

/**
 * Creates the MemoryClientShape factory function
 * @param {Object} deps - Dependencies
 * @param {import('@tevm/state-effect').StateManagerShape} deps.stateManager
 * @param {import('@tevm/vm-effect').VmShape} deps.vm
 * @param {import('@tevm/common-effect').CommonShape} deps.common
 * @param {import('@tevm/node-effect').SnapshotShape} deps.snapshotService
 * @param {Ref.Ref<boolean>} deps.readyRef
 * @returns {import('./types.js').MemoryClientShape}
 */
const createMemoryClientShape = (deps) => {
	const {
		stateManager,
		vm,
		common,
		snapshotService,
		readyRef,
	} = deps

	// Create action services bound to THIS stateManager instance
	// This ensures deepCopy creates services that operate on the copied state
	const actionServices = createActionServices(stateManager)

	return {
		ready: Ref.get(readyRef),

		getBlockNumber: Effect.gen(function* () {
			// Access the underlying VM's blockchain to get the canonical head block
			// VmShape doesn't expose getBlock() directly - use vm.vm.blockchain
			const block = yield* Effect.promise(() => vm.vm.blockchain.getCanonicalHeadBlock())
			return block.header.number
		}),

		getChainId: Effect.succeed(BigInt(common.chainId)),

		getAccount: (params) => actionServices.getAccount(params),

		setAccount: (params) => actionServices.setAccount(params),

		getBalance: (params) => actionServices.getBalance(params),

		getCode: (params) => actionServices.getCode(params),

		getStorageAt: (params) => actionServices.getStorageAt(params),

		takeSnapshot: () => snapshotService.takeSnapshot(),

		revertToSnapshot: (snapshotId) => snapshotService.revertToSnapshot(snapshotId),

		deepCopy: () =>
			Effect.gen(function* () {
				// Create deep copies of all state
				const stateManagerCopy = yield* stateManager.deepCopy()
				const vmCopy = yield* vm.deepCopy()
				const snapshotCopy = yield* snapshotService.deepCopy()
				const currentReady = yield* Ref.get(readyRef)
				const newReadyRef = yield* Ref.make(currentReady)

				// Return new shape with copied state
				// Action services will be recreated with the new stateManagerCopy
				return createMemoryClientShape({
					stateManager: stateManagerCopy,
					vm: vmCopy,
					common,
					snapshotService: snapshotCopy,
					readyRef: newReadyRef,
				})
			}),

		dispose: Effect.sync(() => {
			// Cleanup resources if needed
		}),
	}
}

/**
 * Creates a live layer for the MemoryClientService.
 *
 * This layer composes all underlying TEVM Effect services:
 * - StateManagerService: Account state management
 * - VmService: EVM execution
 * - CommonService: Chain configuration
 * - SnapshotService: State snapshot/restore
 *
 * Action services (getAccount, setAccount, getBalance, getCode, getStorageAt) are
 * created inline and bound to the StateManagerShape. This ensures deepCopy creates
 * services that properly operate on the copied state.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { MemoryClientService, MemoryClientLive } from '@tevm/memory-client-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { VmLive } from '@tevm/vm-effect'
 * import { CommonFromConfig } from '@tevm/common-effect'
 * import { BlockchainLocal } from '@tevm/blockchain-effect'
 * import { EvmLive } from '@tevm/evm-effect'
 *
 * // Compose layers - VmLive requires CommonService, StateManagerService, BlockchainService, EvmService
 * const commonLayer = CommonFromConfig({ chainId: 1, hardfork: 'prague' })
 * const stateLayer = Layer.provide(StateManagerLocal(), commonLayer)
 * const blockchainLayer = Layer.provide(BlockchainLocal(), commonLayer)
 * const evmLayer = Layer.provide(EvmLive(), Layer.mergeAll(stateLayer, blockchainLayer, commonLayer))
 * const vmLayer = Layer.provide(VmLive(), Layer.mergeAll(evmLayer, stateLayer, blockchainLayer, commonLayer))
 * // ... compose remaining layers
 *
 * const program = Effect.gen(function* () {
 *   const client = yield* MemoryClientService
 *   yield* client.ready
 *   return yield* client.getBlockNumber
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
 * ```
 *
 * @returns {Layer.Layer<
 *   MemoryClientService,
 *   never,
 *   StateManagerService | VmService | CommonService | SnapshotService
 * >}
 */
export const MemoryClientLive = Layer.effect(
	MemoryClientService,
	Effect.gen(function* () {
		// Get all required services
		const stateManager = yield* StateManagerService
		const vm = yield* VmService
		const common = yield* CommonService
		const snapshotService = yield* SnapshotService

		// Create ready state ref
		const readyRef = yield* Ref.make(true)

		// Create and return the client shape
		// Action services are created inline using createActionServices
		return createMemoryClientShape({
			stateManager,
			vm,
			common,
			snapshotService,
			readyRef,
		})
	})
)
