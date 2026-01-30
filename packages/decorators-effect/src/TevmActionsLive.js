/**
 * @module @tevm/decorators-effect/TevmActionsLive
 * Live implementation of the TevmActions service
 */

import { Effect, Layer } from 'effect'
import { TevmActionsService } from './TevmActionsService.js'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import {
	GetAccountService,
	SetAccountService,
} from '@tevm/actions-effect'
import { InternalError } from '@tevm/errors-effect'

/**
 * Live implementation of TevmActionsService.
 *
 * Provides Effect-based wrappers around TEVM-specific operations.
 * This layer depends on:
 * - StateManagerService for state access
 * - VmService for execution
 * - GetAccountService for account queries
 * - SetAccountService for account mutations
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { TevmActionsService, TevmActionsLive } from '@tevm/decorators-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { VmLive } from '@tevm/vm-effect'
 *
 * const layer = TevmActionsLive.pipe(
 *   Layer.provide(StateManagerLocal()),
 *   Layer.provide(VmLive())
 * )
 *
 * const program = Effect.gen(function* () {
 *   const tevmActions = yield* TevmActionsService
 *   return yield* tevmActions.getAccount({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @type {Layer.Layer<TevmActionsService, never, StateManagerService | VmService | GetAccountService | SetAccountService>}
 */
export const TevmActionsLive = Layer.effect(
	TevmActionsService,
	Effect.gen(function* () {
		const stateManager = yield* StateManagerService
		const vm = yield* VmService
		const getAccountService = yield* GetAccountService
		const setAccountService = yield* SetAccountService

		return {
			call: (params) =>
				Effect.gen(function* () {
					const result = yield* vm
						.runTx({
							to: params.to,
							from: params.from,
							data: params.data,
							gas: params.gas,
							gasPrice: params.gasPrice,
							value: params.value,
						})
						.pipe(
							Effect.mapError(
								(e) =>
									new InternalError({
										message: `tevm_call failed: ${e instanceof Error ? e.message : String(e)}`,
										cause: e instanceof Error ? e : undefined,
									})
							)
						)

					return {
						rawData: result.returnValue ?? '0x',
						executionGasUsed: result.gasUsed ?? 0n,
						gas: result.gas,
						createdAddress: result.createdAddress,
						exceptionError: result.exceptionError,
					}
				}),

			getAccount: (params) =>
				getAccountService.getAccount(params).pipe(
					Effect.map((result) => ({
						address: result.address,
						nonce: result.nonce,
						balance: result.balance,
						deployedBytecode: result.deployedBytecode,
						storageRoot: result.storageRoot,
						codeHash: result.codeHash,
						isContract: result.isContract,
						isEmpty: result.isEmpty,
						storage: result.storage,
					}))
				),

			setAccount: (params) =>
				setAccountService.setAccount(params).pipe(
					Effect.map((result) => ({
						address: result.address,
					}))
				),

			dumpState: () =>
				Effect.gen(function* () {
					const stateRoot = yield* stateManager.getStateRoot().pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to dump state: ${e instanceof Error ? e.message : String(e)}`,
									cause: e instanceof Error ? e : undefined,
								})
						)
					)
					// Convert Uint8Array to hex string
					const hexString = Array.from(stateRoot)
						.map((b) => b.toString(16).padStart(2, '0'))
						.join('')
					return `0x${hexString}`
				}),

			loadState: (state) =>
				Effect.gen(function* () {
					// Parse hex string to Uint8Array
					const hex = state.startsWith('0x') ? state.slice(2) : state
					const bytes = new Uint8Array(hex.length / 2)
					for (let i = 0; i < bytes.length; i++) {
						bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
					}

					yield* stateManager.setStateRoot(bytes).pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to load state: ${e instanceof Error ? e.message : String(e)}`,
									cause: e instanceof Error ? e : undefined,
								})
						)
					)
				}),

			mine: (options = {}) =>
				Effect.gen(function* () {
					const blocks = options.blocks ?? 1
					for (let i = 0; i < blocks; i++) {
						yield* vm.buildBlock().pipe(
							Effect.mapError(
								(e) =>
									new InternalError({
										message: `Failed to mine block: ${e instanceof Error ? e.message : String(e)}`,
										cause: e instanceof Error ? e : undefined,
									})
							)
						)
					}
				}),
		}
	})
)
