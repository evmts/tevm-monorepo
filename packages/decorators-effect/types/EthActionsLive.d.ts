/**
 * Live implementation of EthActionsService.
 *
 * Provides Effect-based wrappers around standard Ethereum JSON-RPC methods.
 * This layer depends on:
 * - BlockchainService for blockchain state access
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
 * @type {Layer.Layer<EthActionsService, never, VmService | CommonService | BlockchainService | GetBalanceService | GetCodeService | GetStorageAtService>}
 */
export const EthActionsLive: Layer.Layer<EthActionsService, never, import("effect/Context").Tag<any, any> | import("effect/Context").Tag<any, any> | import("effect/Context").Tag<any, any> | import("effect/Context").Tag<any, any> | import("effect/Context").Tag<any, any> | import("effect/Context").Tag<any, any>>;
import { Layer } from 'effect';
import { EthActionsService } from './EthActionsService.js';
//# sourceMappingURL=EthActionsLive.d.ts.map