/**
 * @module @tevm/blockchain-effect
 * @description Effect.ts services for type-safe, composable blockchain operations in TEVM
 *
 * This package provides Effect.ts-based blockchain services for managing blockchain
 * state in TEVM. It wraps the `@tevm/blockchain` package with Effect-based methods
 * for composable error handling and dependency injection.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { BlockchainService, BlockchainLocal } from '@tevm/blockchain-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * // Create program that uses blockchain
 * const program = Effect.gen(function* () {
 *   const blockchain = yield* BlockchainService
 *
 *   // Wait for blockchain to be ready
 *   yield* blockchain.ready
 *
 *   // Get the genesis block
 *   const genesisBlock = yield* blockchain.getBlock('earliest')
 *   console.log('Genesis block number:', genesisBlock.header.number)
 *
 *   // Get the latest block
 *   const latestBlock = yield* blockchain.getCanonicalHeadBlock()
 *   console.log('Latest block number:', latestBlock.header.number)
 * })
 *
 * // Run with local (non-fork) blockchain
 * const layer = Layer.provide(BlockchainLocal(), CommonLocal)
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @example
 * ```javascript
 * // Fork mode with HttpTransport
 * import { HttpTransport, ForkConfigFromRpc } from '@tevm/transport-effect'
 * import { CommonFromFork } from '@tevm/common-effect'
 * import { BlockchainLive } from '@tevm/blockchain-effect'
 *
 * // Build layer stack for forking
 * const transportLayer = HttpTransport({ url: 'https://mainnet.optimism.io' })
 * const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)
 * const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
 * const blockchainLayer = Layer.provide(
 *   BlockchainLive(),
 *   Layer.mergeAll(commonLayer, transportLayer, forkConfigLayer)
 * )
 *
 * // Run program with forking support
 * Effect.runPromise(program.pipe(Effect.provide(blockchainLayer)))
 * ```
 */

// Re-export types
/**
 * @typedef {import('./types.js').Hex} Hex
 * @typedef {import('./types.js').BlockTag} BlockTag
 * @typedef {import('./types.js').BlockId} BlockId
 * @typedef {import('./types.js').BlockchainShape} BlockchainShape
 * @typedef {import('./types.js').BlockchainLiveOptions} BlockchainLiveOptions
 * @typedef {import('./types.js').BlockchainLocalOptions} BlockchainLocalOptions
 */

// Blockchain exports
export { BlockchainService } from './BlockchainService.js'
export { BlockchainLive } from './BlockchainLive.js'
export { BlockchainLocal } from './BlockchainLocal.js'
