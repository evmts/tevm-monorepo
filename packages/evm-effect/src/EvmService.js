import { Context } from 'effect'

/**
 * @module @tevm/evm-effect/EvmService
 * @description Effect Context.Tag for EVM service
 */

/**
 * @typedef {import('./types.js').EvmShape} EvmShape
 */

/**
 * EvmService identifier type for Effect Context.Tag
 * @typedef {{ readonly _tag: '@tevm/evm-effect/EvmService' }} EvmServiceId
 */

/**
 * EvmService Context Tag for Effect-based dependency injection.
 *
 * This tag is used to inject the EvmShape into Effect computations,
 * enabling type-safe access to EVM execution operations.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { EvmService } from '@tevm/evm-effect'
 *
 * const program = Effect.gen(function* () {
 *   const evmService = yield* EvmService
 *
 *   // Execute a call
 *   const result = yield* evmService.runCall({
 *     to: address,
 *     data: calldata,
 *     gasLimit: 1000000n
 *   })
 *   console.log('Call result:', result)
 *
 *   // Get active precompiles
 *   const precompiles = yield* evmService.getActivePrecompiles()
 *   console.log('Precompiles:', precompiles.size)
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Using with layer composition
 * import { Layer, Effect } from 'effect'
 * import { EvmService, EvmLive } from '@tevm/evm-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { BlockchainLocal } from '@tevm/blockchain-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const evmService = yield* EvmService
 *   const precompiles = yield* evmService.getActivePrecompiles()
 *   console.log('Active precompiles:', precompiles.size)
 * })
 *
 * // Build layer stack
 * const layer = EvmLive().pipe(
 *   Layer.provide(StateManagerLocal()),
 *   Layer.provide(BlockchainLocal()),
 *   Layer.provide(CommonLocal)
 * )
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @type {Context.Tag<EvmServiceId, EvmShape>}
 */
export const EvmService = /** @type {Context.Tag<EvmServiceId, EvmShape>} */ (
	Context.GenericTag('@tevm/evm-effect/EvmService')
)
