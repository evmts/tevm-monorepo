import { Effect, Layer } from 'effect'
import { createChain } from '@tevm/blockchain'
import { CommonService } from '@tevm/common-effect'
import { BlockNotFoundError, InvalidBlockError } from '@tevm/errors-effect'
import { BlockchainService } from './BlockchainService.js'

/**
 * @module @tevm/blockchain-effect/BlockchainLocal
 * @description Layer that creates BlockchainService for local (non-fork) mode
 */

/**
 * @typedef {import('./types.js').BlockchainShape} BlockchainShape
 * @typedef {import('./types.js').BlockchainLocalOptions} BlockchainLocalOptions
 * @typedef {import('./types.js').BlockId} BlockId
 */

/**
 * Creates a BlockchainService layer for local (non-fork) mode.
 *
 * This layer creates a blockchain that starts from genesis without forking
 * from any remote network. It's suitable for:
 * - Local development and testing
 * - Deterministic test environments
 * - Scenarios that don't require existing mainnet state
 *
 * The layer requires CommonService to be provided for chain configuration.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { BlockchainService, BlockchainLocal } from '@tevm/blockchain-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const blockchain = yield* BlockchainService
 *   yield* blockchain.ready
 *
 *   const genesisBlock = yield* blockchain.getBlock('earliest')
 *   console.log('Genesis block number:', genesisBlock.header.number)
 * })
 *
 * // Run with local blockchain
 * const layer = Layer.provide(BlockchainLocal(), CommonLocal)
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @example
 * ```javascript
 * // With custom genesis block
 * import { createBlock } from '@tevm/block'
 *
 * const customGenesis = createBlock({ ... })
 * const layer = Layer.provide(
 *   BlockchainLocal({ genesisBlock: customGenesis }),
 *   CommonLocal
 * )
 * ```
 *
 * @param {BlockchainLocalOptions} [options] - Configuration options
 * @returns {Layer.Layer<BlockchainService, never, CommonService>} Layer providing BlockchainService
 */
export const BlockchainLocal = (options = {}) => {
	return Layer.effect(
		BlockchainService,
		Effect.gen(function* () {
			const { common } = yield* CommonService

			/** @type {import('@tevm/blockchain').ChainOptions} */
			const chainOptions = { common }
			if (options.genesisBlock !== undefined) {
				chainOptions.genesisBlock = options.genesisBlock
			}
			if (options.genesisStateRoot !== undefined) {
				chainOptions.genesisStateRoot = options.genesisStateRoot
			}
			const chain = yield* Effect.tryPromise({
				try: () => createChain(chainOptions),
				catch: (error) =>
					new InvalidBlockError({
						message: `Failed to initialize blockchain chain`,
						cause: /** @type {Error} */ (error),
					}),
			})

			// Wait for the chain to be ready
			yield* Effect.tryPromise({
				try: () => chain.ready(),
				catch: (error) =>
					new InvalidBlockError({
						message: `Chain failed to become ready`,
						cause: /** @type {Error} */ (error),
					}),
			})

			/**
			 * Helper to create BlockchainShape from a chain instance
			 * @param {import('@tevm/blockchain').Chain} chainInstance
			 * @returns {BlockchainShape}
			 */
			const createShape = (chainInstance) => {
				/** @type {BlockchainShape} */
				const shape = {
					chain: chainInstance,

					getBlock: (blockId) =>
						Effect.tryPromise({
							try: () =>
								chainInstance.getBlockByTag(
									/** @type {`0x${string}` | Uint8Array | number | bigint | 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'} */ (
										blockId
									),
								),
							catch: (error) =>
								new BlockNotFoundError({
									message: `Block not found: ${String(blockId)}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					getBlockByHash: (hash) =>
						Effect.tryPromise({
							try: () => chainInstance.getBlockByTag(hash),
							catch: (error) =>
								new BlockNotFoundError({
									message: `Block not found for hash: ${hash}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					putBlock: (block) =>
						Effect.tryPromise({
							try: () => chainInstance.putBlock(block),
							catch: (error) =>
								new InvalidBlockError({
									message: `Failed to add block to chain`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					getCanonicalHeadBlock: () =>
						Effect.tryPromise({
							try: () => chainInstance.getCanonicalHeadBlock(),
							catch: (error) =>
								new BlockNotFoundError({
									message: `Failed to get canonical head block`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					getIteratorHead: (name) =>
						Effect.tryPromise({
							try: () => chainInstance.getIteratorHead(name),
							catch: (error) =>
								new BlockNotFoundError({
									message: `Failed to get iterator head: ${name}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					setIteratorHead: (tag, headHash) =>
						Effect.tryPromise({
							try: () => chainInstance.setIteratorHead(tag, headHash),
							catch: (error) =>
								new InvalidBlockError({
									message: `Failed to set iterator head for ${tag}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					delBlock: (blockHash) =>
						Effect.tryPromise({
							try: () => chainInstance.delBlock(blockHash),
							catch: (error) =>
								new BlockNotFoundError({
									message: `Failed to delete block`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					validateHeader: (header, height) =>
						Effect.tryPromise({
							try: () => chainInstance.validateHeader(header, height),
							catch: (error) =>
								new InvalidBlockError({
									message: `Invalid block header`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					deepCopy: () =>
						Effect.gen(function* () {
							const copiedChain = yield* Effect.tryPromise({
								try: () => chainInstance.deepCopy(),
								catch: (error) =>
									new InvalidBlockError({
										message: `Failed to create deep copy of blockchain`,
										cause: /** @type {Error} */ (error),
									}),
							})
							return createShape(copiedChain)
						}),

					shallowCopy: () => createShape(chainInstance.shallowCopy()),

					ready: Effect.tryPromise({
						try: () => chainInstance.ready(),
						catch: (error) =>
							new InvalidBlockError({
								message: `Chain failed to become ready`,
								cause: /** @type {Error} */ (error),
							}),
					}),

					/**
					 * Iterate through blocks in a range from start to end (inclusive).
					 * Yields blocks that exist in the specified range.
					 * @param {bigint} start - Starting block number (inclusive)
					 * @param {bigint} end - Ending block number (inclusive)
					 * @returns {AsyncIterable<import('@tevm/block').Block>}
					 */
					iterator: (start, end) => {
						return {
							async *[Symbol.asyncIterator]() {
								const step = start <= end ? 1n : -1n
								for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
									try {
										const block = await chainInstance.getBlock(i)
										if (block) {
											yield block
										}
									} catch (error) {
										// Only silently continue for block-not-found errors
										// Re-throw all other errors (network errors, validation errors, etc.)
										const isBlockNotFound =
											error instanceof Error &&
											(error.name === 'UnknownBlock' ||
												error.name === 'UnknownBlockError' ||
												error.message?.toLowerCase().includes('block not found') ||
												error.message?.toLowerCase().includes('unknown block'))
										if (!isBlockNotFound) {
											throw error
										}
										// Block not found at this height, continue to next
									}
								}
							},
						}
					},
				}
				return shape
			}

			return createShape(chain)
		}),
	)
}
