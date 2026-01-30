/**
 * @module @tevm/memory-client-effect/MemoryClientLive
 * Layer implementation for the Effect-based memory client
 */

import { Effect, Layer, Ref } from 'effect'
import { MemoryClientService } from './MemoryClientService.js'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { CommonService } from '@tevm/common-effect'
import {
	GetAccountService,
	SetAccountService,
	GetBalanceService,
	GetCodeService,
	GetStorageAtService,
} from '@tevm/actions-effect'
import { SnapshotService } from '@tevm/node-effect'

/**
 * Converts a bigint to a hex string
 * @param {bigint} value - The value to convert
 * @returns {import('./types.js').Hex}
 */
const bigintToHex = (value) => {
	const hex = value.toString(16)
	return /** @type {import('./types.js').Hex} */ (`0x${hex}`)
}

/**
 * Creates the MemoryClientShape factory function
 * @param {Object} deps - Dependencies
 * @param {import('@tevm/state-effect').StateManagerShape} deps.stateManager
 * @param {import('@tevm/vm-effect').VmShape} deps.vm
 * @param {import('@tevm/common-effect').CommonShape} deps.common
 * @param {import('@tevm/actions-effect').GetAccountShape} deps.getAccountService
 * @param {import('@tevm/actions-effect').SetAccountShape} deps.setAccountService
 * @param {import('@tevm/actions-effect').GetBalanceShape} deps.getBalanceService
 * @param {import('@tevm/actions-effect').GetCodeShape} deps.getCodeService
 * @param {import('@tevm/actions-effect').GetStorageAtShape} deps.getStorageAtService
 * @param {import('@tevm/node-effect').SnapshotShape} deps.snapshotService
 * @param {Ref.Ref<boolean>} deps.readyRef
 * @returns {import('./types.js').MemoryClientShape}
 */
const createMemoryClientShape = (deps) => {
	const {
		stateManager,
		vm,
		common,
		getAccountService,
		setAccountService,
		getBalanceService,
		getCodeService,
		getStorageAtService,
		snapshotService,
		readyRef,
	} = deps

	return {
		ready: Ref.get(readyRef),

		getBlockNumber: Effect.gen(function* () {
			const block = yield* vm.getBlock()
			return block.header.number
		}),

		getChainId: Effect.succeed(BigInt(common.chainId)),

		getAccount: (params) => getAccountService.getAccount(params),

		setAccount: (params) => setAccountService.setAccount(params),

		getBalance: (params) => getBalanceService.getBalance(params),

		getCode: (params) => getCodeService.getCode(params),

		getStorageAt: (params) => getStorageAtService.getStorageAt(params),

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
				return createMemoryClientShape({
					stateManager: stateManagerCopy,
					vm: vmCopy,
					common,
					getAccountService,
					setAccountService,
					getBalanceService,
					getCodeService,
					getStorageAtService,
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
 * - Action services: getAccount, setAccount, getBalance, getCode, getStorageAt
 * - SnapshotService: State snapshot/restore
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { MemoryClientService, MemoryClientLive } from '@tevm/memory-client-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { VmLive } from '@tevm/vm-effect'
 * import { CommonLive } from '@tevm/common-effect'
 *
 * // Compose layers
 * const fullLayer = MemoryClientLive.pipe(
 *   Layer.provide(StateManagerLocal()),
 *   Layer.provide(VmLive()),
 *   Layer.provide(CommonLive()),
 *   // ... other required layers
 * )
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
 *   StateManagerService | VmService | CommonService | GetAccountService | SetAccountService | GetBalanceService | GetCodeService | GetStorageAtService | SnapshotService
 * >}
 */
export const MemoryClientLive = Layer.effect(
	MemoryClientService,
	Effect.gen(function* () {
		// Get all required services
		const stateManager = yield* StateManagerService
		const vm = yield* VmService
		const common = yield* CommonService
		const getAccountService = yield* GetAccountService
		const setAccountService = yield* SetAccountService
		const getBalanceService = yield* GetBalanceService
		const getCodeService = yield* GetCodeService
		const getStorageAtService = yield* GetStorageAtService
		const snapshotService = yield* SnapshotService

		// Create ready state ref
		const readyRef = yield* Ref.make(true)

		// Create and return the client shape
		return createMemoryClientShape({
			stateManager,
			vm,
			common,
			getAccountService,
			setAccountService,
			getBalanceService,
			getCodeService,
			getStorageAtService,
			snapshotService,
			readyRef,
		})
	})
)
