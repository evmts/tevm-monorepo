/**
 * @module @tevm/decorators-effect/EthActionsLive
 * Live implementation of the EthActions service
 */

import { Effect, Layer } from 'effect'
import { EthActionsService } from './EthActionsService.js'
import { VmService } from '@tevm/vm-effect'
import { CommonService } from '@tevm/common-effect'
import {
	GetBalanceService,
	GetCodeService,
	GetStorageAtService,
} from '@tevm/actions-effect'
import { InternalError } from '@tevm/errors-effect'

/**
 * Live implementation of EthActionsService.
 *
 * Provides Effect-based wrappers around standard Ethereum JSON-RPC methods.
 * This layer depends on:
 * - StateManagerService for state access
 * - VmService for execution
 * - CommonService for chain configuration
 * - Action services for specific operations
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { EthActionsService, EthActionsLive } from '@tevm/decorators-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { VmLive } from '@tevm/vm-effect'
 * import { CommonFromConfig } from '@tevm/common-effect'
 * import { BlockchainLocal } from '@tevm/blockchain-effect'
 * import { EvmLive } from '@tevm/evm-effect'
 *
 * // Build layer composition (VmLive requires CommonService, StateManagerService, BlockchainService, EvmService)
 * const commonLayer = CommonFromConfig({ chainId: 1, hardfork: 'prague' })
 * const stateLayer = Layer.provide(StateManagerLocal(), commonLayer)
 * const blockchainLayer = Layer.provide(BlockchainLocal(), commonLayer)
 * const evmLayer = Layer.provide(EvmLive(), Layer.mergeAll(stateLayer, blockchainLayer, commonLayer))
 * const vmLayer = Layer.provide(VmLive(), Layer.mergeAll(evmLayer, stateLayer, blockchainLayer, commonLayer))
 *
 * // Then provide EthActionsLive with its dependencies
 * const fullLayer = Layer.provide(EthActionsLive, Layer.mergeAll(vmLayer, stateLayer, commonLayer))
 *
 * const program = Effect.gen(function* () {
 *   const ethActions = yield* EthActionsService
 *   return yield* ethActions.blockNumber()
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
 * ```
 *
 * @type {Layer.Layer<EthActionsService, never, VmService | CommonService | GetBalanceService | GetCodeService | GetStorageAtService>}
 */
export const EthActionsLive = Layer.effect(
	EthActionsService,
	Effect.gen(function* () {
		const vm = yield* VmService
		const common = yield* CommonService
		const getBalanceService = yield* GetBalanceService
		const getCodeService = yield* GetCodeService
		const getStorageAtService = yield* GetStorageAtService

		return {
			blockNumber: () =>
				Effect.gen(function* () {
					// Access the underlying VM's blockchain to get the canonical head block
					// VmShape doesn't expose getBlock() directly - use vm.vm.blockchain
					const block = yield* Effect.tryPromise({
						try: () => vm.vm.blockchain.getCanonicalHeadBlock(),
						catch: (e) =>
							new InternalError({
								message: `Failed to get block: ${e instanceof Error ? e.message : String(e)}`,
								cause: e instanceof Error ? e : undefined,
							}),
					})
					return block.header.number
				}),

			call: (params) =>
				Effect.gen(function* () {
					// Execute call using EVM's runCall directly for simulation
					// This doesn't require a signed transaction - it's a stateless call
					const hexToBytes = (/** @type {string | undefined} */ hex) => {
						if (!hex || hex === '0x') return new Uint8Array()
						const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex
						const normalizedHex = cleanHex.length % 2 === 1 ? '0' + cleanHex : cleanHex
						const bytes = new Uint8Array(normalizedHex.length / 2)
						for (let i = 0; i < bytes.length; i++) {
							bytes[i] = parseInt(normalizedHex.substring(i * 2, i * 2 + 2), 16)
						}
						return bytes
					}

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
								message: `eth_call failed: ${e instanceof Error ? e.message : String(e)}`,
								cause: e instanceof Error ? e : undefined,
							}),
					})

					// Convert result to hex string
					const bytesToHex = (/** @type {Uint8Array} */ bytes) => {
						if (!bytes || bytes.length === 0) return '0x'
						return '0x' + Buffer.from(bytes).toString('hex')
					}
					return bytesToHex(result.execResult?.returnValue ?? new Uint8Array())
				}),

			chainId: () => Effect.succeed(BigInt(common.chainId)),

			gasPrice: () =>
				Effect.gen(function* () {
					// Default gas price (1 gwei) for in-memory simulation
					// Note: In a real Ethereum network, gas price would be dynamically
					// calculated based on network conditions. For local in-memory execution,
					// a fixed value is appropriate as there's no network congestion to model.
					return 1000000000n
				}),

			getBalance: (params) => getBalanceService.getBalance(params),

			getCode: (params) => getCodeService.getCode(params),

			getStorageAt: (params) => getStorageAtService.getStorageAt(params),
		}
	})
)
