import { createChain } from '@tevm/blockchain'
import { CommonService } from '@tevm/common-effect'
import { BlockNotFoundError, InvalidBlockError } from '@tevm/errors-effect'
import { ForkConfigService, TransportService } from '@tevm/transport-effect'
import { Effect, Layer } from 'effect'
import { BlockchainService } from './BlockchainService.js'

/**
 * @module @tevm/blockchain-effect/BlockchainLive
 * @description Layer that creates BlockchainService for fork mode
 */

/**
 * @typedef {import('./types.js').BlockchainShape} BlockchainShape
 * @typedef {import('./types.js').BlockchainLiveOptions} BlockchainLiveOptions
 * @typedef {import('./types.js').BlockId} BlockId
 */

/**
 * Creates a BlockchainService layer for fork mode.
 *
 * This layer creates a blockchain that forks from a remote network via RPC.
 * When blocks are requested that don't exist locally, they are fetched from
 * the remote network and cached locally.
 *
 * The layer requires:
 * - CommonService - Chain configuration
 * - TransportService - RPC transport for fetching remote blocks
 * - ForkConfigService - Fork configuration (chain ID, block number)
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { BlockchainService, BlockchainLive } from '@tevm/blockchain-effect'
 * import { HttpTransport, ForkConfigFromRpc, ForkConfigService, TransportService } from '@tevm/transport-effect'
 * import { CommonService, CommonFromFork } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const blockchain = yield* BlockchainService
 *   yield* blockchain.ready
 *
 *   // Get block from forked network
 *   const block = yield* blockchain.getBlock(18000000n)
 *   console.log('Forked block:', block.header.number)
 *
 *   // Get latest block
 *   const latestBlock = yield* blockchain.getCanonicalHeadBlock()
 *   console.log('Latest block:', latestBlock.header.number)
 * })
 *
 * // Build layer stack
 * const transportLayer = HttpTransport({ url: 'https://mainnet.optimism.io' })
 * const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)
 * const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
 * const blockchainLayer = Layer.provide(
 *   BlockchainLive(),
 *   Layer.mergeAll(commonLayer, transportLayer, forkConfigLayer)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(blockchainLayer)))
 * ```
 *
 * @example
 * ```javascript
 * // With custom options
 * const blockchainLayer = Layer.provide(
 *   BlockchainLive({
 *     genesisStateRoot: customStateRoot,
 *   }),
 *   requiredLayers
 * )
 * ```
 *
 * @param {BlockchainLiveOptions} [options] - Configuration options
 * @returns {Layer.Layer<BlockchainService, import('@tevm/errors-effect').InvalidBlockError, CommonService | TransportService | ForkConfigService>} Layer providing BlockchainService
 */
export const BlockchainLive = (options = {}) => {
	return Layer.effect(
		BlockchainService,
		Effect.gen(function* () {
			const { common } = yield* CommonService
			const transport = yield* TransportService
			const forkConfig = yield* ForkConfigService

			/** @type {import('@tevm/blockchain').ChainOptions} */
			const chainOptions = {
				common: options.common ?? common,
				fork: {
					transport: {
						// Note: Effect.runPromise is used here as a boundary between Effect and non-Effect code.
						// The createChain function expects a Promise-based transport, so we must convert.
						// Issue #314 fix: Preserve ForkError properties through Promise boundary by enriching
						// the thrown error with the original typed error's properties.
						request: (method, params) =>
							Effect.runPromise(
								transport.request(method, params).pipe(
									Effect.tapError((error) =>
										Effect.logError(`Fork transport error: ${method}`, { error, method, params }),
									),
									// Issue #314: Catch typed ForkError and convert to enriched Error that preserves context
									Effect.catchTag('ForkError', (forkError) => {
										const enrichedError =
											/** @type {Error & { method?: string; code?: number; docsPath?: string; __isForkError?: boolean }} */ (
												new Error(forkError.message)
											)
										enrichedError.method = forkError.method
										enrichedError.code = forkError.code
										enrichedError.docsPath = forkError.docsPath
										enrichedError.cause = forkError.cause
										enrichedError.__isForkError = true
										return Effect.fail(enrichedError)
									}),
								),
							),
					},
					blockTag: forkConfig.blockTag,
				},
			}
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
					 * For fork mode, blocks may be fetched from the remote network if not cached locally.
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
