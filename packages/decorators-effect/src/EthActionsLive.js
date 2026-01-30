/**
 * @module @tevm/decorators-effect/EthActionsLive
 * Live implementation of the EthActions service
 */

import { Effect, Layer } from 'effect'
import { EthActionsService } from './EthActionsService.js'
import { StateManagerService } from '@tevm/state-effect'
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
 * import { CommonLive } from '@tevm/common-effect'
 *
 * const layer = EthActionsLive.pipe(
 *   Layer.provide(StateManagerLocal()),
 *   Layer.provide(VmLive()),
 *   Layer.provide(CommonLive({ chainId: 1 }))
 * )
 *
 * const program = Effect.gen(function* () {
 *   const ethActions = yield* EthActionsService
 *   return yield* ethActions.blockNumber()
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @type {Layer.Layer<EthActionsService, never, StateManagerService | VmService | CommonService | GetBalanceService | GetCodeService | GetStorageAtService>}
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
					const block = yield* vm.getBlock().pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to get block: ${e instanceof Error ? e.message : String(e)}`,
									cause: e instanceof Error ? e : undefined,
								})
						)
					)
					return block.header.number
				}),

			call: (params) =>
				Effect.gen(function* () {
					// Execute call via VM
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
										message: `eth_call failed: ${e instanceof Error ? e.message : String(e)}`,
										cause: e instanceof Error ? e : undefined,
									})
							)
						)
					return result.returnValue ?? '0x'
				}),

			chainId: () => Effect.succeed(BigInt(common.chainId)),

			gasPrice: () =>
				Effect.gen(function* () {
					// Default gas price (1 gwei)
					return 1000000000n
				}),

			getBalance: (params) => getBalanceService.getBalance(params),

			getCode: (params) => getCodeService.getCode(params),

			getStorageAt: (params) => getStorageAtService.getStorageAt(params),
		}
	})
)
