/**
 * @module @tevm/blockchain-effect/BlockchainShape
 * @description Documentation for the BlockchainShape interface
 */

/**
 * @typedef {import('./types.js').BlockchainShape} BlockchainShape
 */

/**
 * BlockchainShape Interface
 * =========================
 *
 * The `BlockchainShape` interface defines the Effect-based API for blockchain operations.
 * All methods are wrapped in Effect for composable error handling and dependency injection.
 *
 * ## Properties
 *
 * ### chain
 * The underlying `@tevm/blockchain` Chain instance. Direct access is provided for
 * advanced use cases that need the raw Promise-based API.
 *
 * ### getBlock(blockId)
 * Get a block by its identifier. The identifier can be:
 * - `number` - Block number
 * - `bigint` - Block number as bigint
 * - `Uint8Array` - Block hash
 * - `Hex` - Block hash as hex string
 * - `BlockTag` - Named tag ('latest', 'earliest', 'pending', 'safe', 'finalized')
 *
 * Returns: `Effect<Block, BlockNotFoundError>`
 *
 * ### getBlockByHash(hash)
 * Get a block by its hash (hex string).
 *
 * Returns: `Effect<Block, BlockNotFoundError>`
 *
 * ### putBlock(block)
 * Add a block to the blockchain.
 *
 * Returns: `Effect<void>`
 *
 * ### getCanonicalHeadBlock()
 * Get the latest block in the canonical chain.
 *
 * Returns: `Effect<Block>`
 *
 * ### getIteratorHead(name?)
 * Get the current iterator head block for the given name (default: 'vm').
 *
 * Returns: `Effect<Block>`
 *
 * ### setIteratorHead(tag, headHash)
 * Set the iterator head position for a given tag.
 *
 * Returns: `Effect<void>`
 *
 * ### delBlock(blockHash)
 * Delete a block and all its descendants from the blockchain.
 *
 * Returns: `Effect<void, BlockNotFoundError>`
 *
 * ### validateHeader(header, height?)
 * Validate a block header against its parent.
 *
 * Returns: `Effect<void, InvalidBlockError>`
 *
 * ### deepCopy()
 * Create a deep copy of the blockchain with independent state.
 *
 * Returns: `Effect<BlockchainShape>`
 *
 * ### shallowCopy()
 * Create a shallow copy that shares state with the original.
 *
 * Returns: `BlockchainShape` (synchronous)
 *
 * ### ready
 * An Effect that completes when the blockchain is fully initialized.
 *
 * Returns: `Effect<void>`
 *
 * ## Usage Example
 *
 * ```javascript
 * import { Effect } from 'effect'
 * import { BlockchainService } from '@tevm/blockchain-effect'
 *
 * const program = Effect.gen(function* () {
 *   const blockchain = yield* BlockchainService
 *
 *   // Wait for blockchain to be ready
 *   yield* blockchain.ready
 *
 *   // Get the latest block
 *   const latestBlock = yield* blockchain.getCanonicalHeadBlock()
 *   console.log('Latest block:', latestBlock.header.number)
 *
 *   // Get a specific block
 *   const block = yield* blockchain.getBlock('latest')
 *   console.log('Block hash:', block.hash())
 * })
 * ```
 */

export {}
