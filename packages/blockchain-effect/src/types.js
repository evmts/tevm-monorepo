/**
 * @module @tevm/blockchain-effect/types
 * @description Type definitions for the blockchain-effect package
 */

/**
 * Ethereum hex string type (0x prefixed)
 * @typedef {`0x${string}`} Hex
 */

/**
 * Block tag type for specifying blocks
 * @typedef {'latest' | 'earliest' | 'pending' | 'safe' | 'finalized' | 'forked'} BlockTag
 */

/**
 * Block identifier type - can be a number, bigint, Uint8Array hash, or hex string
 * @typedef {number | bigint | Uint8Array | Hex | BlockTag} BlockId
 */

/**
 * Blockchain shape interface for Effect-based blockchain operations.
 *
 * This interface provides Effect-wrapped methods for interacting with the
 * blockchain, including block retrieval, storage, and validation.
 *
 * @typedef {Object} BlockchainShape
 * @property {import('@tevm/blockchain').Chain} chain - The underlying Chain instance
 * @property {(blockId: BlockId) => import('effect').Effect.Effect<import('@tevm/block').Block, import('@tevm/errors-effect').BlockNotFoundError>} getBlock - Get a block by its ID (number, hash, or tag)
 * @property {(hash: Hex) => import('effect').Effect.Effect<import('@tevm/block').Block, import('@tevm/errors-effect').BlockNotFoundError>} getBlockByHash - Get a block by its hash
 * @property {(block: import('@tevm/block').Block) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').InvalidBlockError>} putBlock - Add a block to the blockchain
 * @property {() => import('effect').Effect.Effect<import('@tevm/block').Block, import('@tevm/errors-effect').BlockNotFoundError>} getCanonicalHeadBlock - Get the latest block in the canonical chain
 * @property {(name?: string) => import('effect').Effect.Effect<import('@tevm/block').Block, import('@tevm/errors-effect').BlockNotFoundError>} getIteratorHead - Get the current iterator head block
 * @property {(tag: string, headHash: Uint8Array) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').InvalidBlockError>} setIteratorHead - Set the iterator head position
 * @property {(blockHash: Uint8Array) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').BlockNotFoundError>} delBlock - Delete a block from the blockchain
 * @property {(header: import('@tevm/block').BlockHeader, height?: bigint) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').InvalidBlockError>} validateHeader - Validate a block header
 * @property {() => import('effect').Effect.Effect<BlockchainShape, import('@tevm/errors-effect').InvalidBlockError>} deepCopy - Create a deep copy of the blockchain
 * @property {() => BlockchainShape} shallowCopy - Create a shallow copy of the blockchain
 * @property {import('effect').Effect.Effect<void, import('@tevm/errors-effect').InvalidBlockError>} ready - Effect that completes when the blockchain is ready
 * @property {(start: bigint, end: bigint) => AsyncIterable<import('@tevm/block').Block>} iterator - Iterate through blocks in a range from start to end (inclusive)
 */

/**
 * Configuration options for BlockchainLive layer
 * @typedef {Object} BlockchainLiveOptions
 * @property {import('@tevm/common').Common} [common] - Optional Common instance (auto-detected from CommonService if not provided)
 * @property {import('@tevm/block').Block} [genesisBlock] - Optional genesis block override
 * @property {Uint8Array} [genesisStateRoot] - Optional genesis state root override
 */

/**
 * Configuration options for BlockchainLocal layer
 * @typedef {Object} BlockchainLocalOptions
 * @property {import('@tevm/block').Block} [genesisBlock] - Optional genesis block override
 * @property {Uint8Array} [genesisStateRoot] - Optional genesis state root override
 */

export {}
