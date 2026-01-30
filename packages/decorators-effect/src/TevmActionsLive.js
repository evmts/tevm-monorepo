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

		/**
		 * Converts hex string to bytes
		 * @param {string | undefined} hex
		 * @returns {Uint8Array}
		 */
		const hexToBytes = (hex) => {
			if (!hex || hex === '0x') return new Uint8Array()
			const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex
			const normalizedHex = cleanHex.length % 2 === 1 ? '0' + cleanHex : cleanHex
			const bytes = new Uint8Array(normalizedHex.length / 2)
			for (let i = 0; i < bytes.length; i++) {
				bytes[i] = parseInt(normalizedHex.substring(i * 2, i * 2 + 2), 16)
			}
			return bytes
		}

		/**
		 * Converts bytes to hex string
		 * @param {Uint8Array} bytes
		 * @returns {string}
		 */
		const bytesToHex = (bytes) => {
			if (!bytes || bytes.length === 0) return '0x'
			return '0x' + Buffer.from(bytes).toString('hex')
		}

		return {
			call: (params) =>
				Effect.gen(function* () {
					// Execute call using EVM's runCall directly for simulation
					// This doesn't require a signed transaction - it's a stateless call
					const { createAddress } = yield* Effect.promise(() => import('@tevm/address'))

					// Prepare call options for EVM runCall
					const callOpts = {
						to: params.to ? createAddress(params.to) : undefined,
						caller: params.from ? createAddress(params.from) : undefined,
						origin: params.from ? createAddress(params.from) : undefined,
						data: hexToBytes(params.data),
						gasLimit: params.gas ?? 30000000n,
						gasPrice: params.gasPrice ?? 0n,
						value: params.value ?? 0n,
					}

					const result = yield* Effect.tryPromise({
						try: () => vm.vm.evm.runCall(callOpts),
						catch: (e) =>
							new InternalError({
								message: `tevm_call failed: ${e instanceof Error ? e.message : String(e)}`,
								cause: e instanceof Error ? e : undefined,
							}),
					})

					const execResult = result.execResult ?? {}
					return {
						rawData: bytesToHex(execResult.returnValue ?? new Uint8Array()),
						executionGasUsed: execResult.executionGasUsed ?? 0n,
						gas: execResult.gas ?? 0n,
						createdAddress: result.createdAddress?.toString(),
						exceptionError: execResult.exceptionError,
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
