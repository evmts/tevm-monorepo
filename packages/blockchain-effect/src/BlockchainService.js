import { Context } from 'effect'

/**
 * @module @tevm/blockchain-effect/BlockchainService
 * @description Effect.ts Context.Tag for the BlockchainService
 */

/**
 * @typedef {import('./types.js').BlockchainShape} BlockchainShape
 */

/**
 * The BlockchainService Context.Tag for Effect.ts dependency injection.
 *
 * This service provides a type-safe interface for blockchain operations including
 * block retrieval, storage, and validation. It wraps the `@tevm/blockchain` Chain
 * interface with Effect-based methods for composable error handling.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { BlockchainService, BlockchainLocal } from '@tevm/blockchain-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const blockchain = yield* BlockchainService
 *
 *   // Wait for blockchain to be ready
 *   yield* blockchain.ready
 *
 *   // Get the latest block
 *   const latestBlock = yield* blockchain.getCanonicalHeadBlock()
 *   console.log('Latest block number:', latestBlock.header.number)
 *
 *   // Get block by tag
 *   const genesisBlock = yield* blockchain.getBlock('earliest')
 *   console.log('Genesis block hash:', genesisBlock.hash())
 * })
 *
 * // Run with local blockchain (no forking)
 * import { Layer } from 'effect'
 *
 * const layer = Layer.provide(BlockchainLocal(), CommonLocal)
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @example
 * ```javascript
 * // Using BlockchainLive for fork mode
 * import { HttpTransport, ForkConfigFromRpc } from '@tevm/transport-effect'
 * import { CommonFromFork } from '@tevm/common-effect'
 * import { BlockchainLive, BlockchainService } from '@tevm/blockchain-effect'
 *
 * const program = Effect.gen(function* () {
 *   const blockchain = yield* BlockchainService
 *   yield* blockchain.ready
 *
 *   // This will fetch from the forked network if not cached locally
 *   const block = yield* blockchain.getBlock(18000000n)
 *   console.log('Forked block:', block.header.number)
 * })
 *
 * // Build the layer stack
 * const transportLayer = HttpTransport({ url: 'https://mainnet.optimism.io' })
 * const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)
 * const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
 * const blockchainLayer = Layer.provide(
 *   BlockchainLive(),
 *   Layer.merge(commonLayer, Layer.merge(transportLayer, forkConfigLayer))
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(blockchainLayer)))
 * ```
 *
 * @type {Context.Tag<BlockchainService, BlockchainShape>}
 */
export const BlockchainService = /** @type {Context.Tag<BlockchainService, BlockchainShape>} */ (
	Context.GenericTag('BlockchainService')
)
