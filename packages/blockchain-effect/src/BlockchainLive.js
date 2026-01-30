import { Effect, Layer } from 'effect'
import { createChain } from '@tevm/blockchain'
import { CommonService } from '@tevm/common-effect'
import { TransportService, ForkConfigService } from '@tevm/transport-effect'
import { BlockNotFoundError, InvalidBlockError } from '@tevm/errors-effect'
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
 * @returns {Layer.Layer<BlockchainService, never, CommonService | TransportService | ForkConfigService>} Layer providing BlockchainService
 */
export const BlockchainLive = (options = {}) => {
	return Layer.effect(
		BlockchainService,
		Effect.gen(function* () {
			const { common } = yield* CommonService
			const transport = yield* TransportService
			const forkConfig = yield* ForkConfigService

			const chain = yield* Effect.promise(() =>
				createChain({
					common: options.common ?? common,
					genesisBlock: options.genesisBlock,
					genesisStateRoot: options.genesisStateRoot,
					fork: {
						transport: {
							request: (method, params) =>
								Effect.runPromise(transport.request(method, params)),
						},
						blockTag: forkConfig.blockTag,
					},
				}),
			)

			// Wait for the chain to be ready
			yield* Effect.promise(() => chain.ready())

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
							try: () => chainInstance.getBlockByTag(blockId),
							catch: (error) =>
								new BlockNotFoundError({
									message: `Block not found: ${String(blockId)}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					getBlockByHash: (hash) =>
						Effect.tryPromise({
							try: () => chainInstance.getBlock(hash),
							catch: (error) =>
								new BlockNotFoundError({
									message: `Block not found for hash: ${hash}`,
									cause: /** @type {Error} */ (error),
								}),
						}),

					putBlock: (block) => Effect.promise(() => chainInstance.putBlock(block)),

					getCanonicalHeadBlock: () => Effect.promise(() => chainInstance.getCanonicalHeadBlock()),

					getIteratorHead: (name) => Effect.promise(() => chainInstance.getIteratorHead(name)),

					setIteratorHead: (tag, headHash) => Effect.promise(() => chainInstance.setIteratorHead(tag, headHash)),

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
							const copiedChain = yield* Effect.promise(() => chainInstance.deepCopy())
							return createShape(copiedChain)
						}),

					shallowCopy: () => createShape(chainInstance.shallowCopy()),

					ready: Effect.promise(() => chainInstance.ready()),
				}
				return shape
			}

			return createShape(chain)
		}),
	)
}
