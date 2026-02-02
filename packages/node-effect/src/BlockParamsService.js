import { Context } from 'effect'

/**
 * @module @tevm/node-effect/BlockParamsService
 * @description Effect Context.Tag for BlockParams service
 */

/**
 * @typedef {import('./types.js').BlockParamsShape} BlockParamsShape
 */

/**
 * BlockParamsService Context Tag for Effect-based dependency injection.
 *
 * This tag is used to inject the BlockParamsShape into Effect computations,
 * enabling type-safe access to block parameter override operations.
 *
 * Block parameters allow overriding defaults for the next mined block, including:
 * - Timestamp
 * - Gas limit
 * - Base fee per gas (EIP-1559)
 * - Minimum gas price
 * - Block timestamp interval (for auto-mining)
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { BlockParamsService } from '@tevm/node-effect'
 *
 * const program = Effect.gen(function* () {
 *   const blockParams = yield* BlockParamsService
 *   yield* blockParams.setNextBlockTimestamp(1700000000n)
 *   const ts = yield* blockParams.getNextBlockTimestamp
 *   console.log('Next block timestamp:', ts)
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Setting gas parameters
 * import { Effect, Layer } from 'effect'
 * import { BlockParamsService, BlockParamsLive } from '@tevm/node-effect'
 *
 * const program = Effect.gen(function* () {
 *   const blockParams = yield* BlockParamsService
 *   yield* blockParams.setNextBlockGasLimit(30000000n)
 *   yield* blockParams.setNextBlockBaseFeePerGas(1000000000n) // 1 gwei
 *   return 'configured'
 * })
 *
 * const layer = BlockParamsLive()
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 */
export const BlockParamsService = Context.GenericTag(
	'@tevm/node-effect/BlockParamsService',
)
