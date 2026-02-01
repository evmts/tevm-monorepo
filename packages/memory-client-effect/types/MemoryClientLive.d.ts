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
export const MemoryClientLive: Layer.Layer<any, never, any>;
export type ActionServices = {
    getAccount: (params: import("@tevm/actions-effect").GetAccountParams) => import("effect").Effect.Effect<import("@tevm/actions-effect").GetAccountSuccess, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError>;
    setAccount: (params: import("@tevm/actions-effect").SetAccountParams) => import("effect").Effect.Effect<import("@tevm/actions-effect").SetAccountSuccess, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError>;
    getBalance: (params: import("@tevm/actions-effect").GetBalanceParams) => import("effect").Effect.Effect<bigint, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError>;
    getCode: (params: import("@tevm/actions-effect").GetCodeParams) => import("effect").Effect.Effect<import("./types.js").Hex, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError>;
    getStorageAt: (params: import("@tevm/actions-effect").GetStorageAtParams) => import("effect").Effect.Effect<import("./types.js").Hex, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError>;
};
import { Layer } from 'effect';
//# sourceMappingURL=MemoryClientLive.d.ts.map