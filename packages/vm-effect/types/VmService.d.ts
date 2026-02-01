/**
 * @module @tevm/vm-effect/VmService
 * @description Effect Context.Tag for VM service
 */
/**
 * @typedef {import('./types.js').VmShape} VmShape
 */
/**
 * VmService identifier type for Effect Context.Tag
 * @typedef {{ readonly _tag: '@tevm/vm-effect/VmService' }} VmServiceId
 */
/**
 * VmService Context Tag for Effect-based dependency injection.
 *
 * This tag is used to inject the VmShape into Effect computations,
 * enabling type-safe access to VM operations.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { VmService } from '@tevm/vm-effect'
 *
 * const program = Effect.gen(function* () {
 *   const vmService = yield* VmService
 *   yield* vmService.ready
 *
 *   // Execute a transaction
 *   const result = yield* vmService.runTx({
 *     tx: signedTx
 *   })
 *   console.log('Gas used:', result.totalGasSpent)
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Using with layer composition
 * import { Layer, Effect } from 'effect'
 * import { VmService, VmLive } from '@tevm/vm-effect'
 * import { EvmLive } from '@tevm/evm-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { BlockchainLocal } from '@tevm/blockchain-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const vmService = yield* VmService
 *   yield* vmService.ready
 *   console.log('VM ready')
 * })
 *
 * // Build layer stack
 * const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
 * const blockchainLayer = Layer.provide(BlockchainLocal(), CommonLocal)
 * const evmLayer = Layer.provide(EvmLive(), Layer.mergeAll(stateLayer, blockchainLayer, CommonLocal))
 * const vmLayer = Layer.provide(VmLive(), Layer.mergeAll(evmLayer, stateLayer, blockchainLayer, CommonLocal))
 *
 * Effect.runPromise(program.pipe(Effect.provide(vmLayer)))
 * ```
 *
 * @type {Context.Tag<VmServiceId, VmShape>}
 */
export const VmService: Context.Tag<VmServiceId, VmShape>;
export type VmShape = import("./types.js").VmShape;
/**
 * VmService identifier type for Effect Context.Tag
 */
export type VmServiceId = {
    readonly _tag: "@tevm/vm-effect/VmService";
};
import { Context } from 'effect';
//# sourceMappingURL=VmService.d.ts.map