/**
 * @module @tevm/memory-client-effect/types
 * Type definitions for the Effect-based memory client
 */

/**
 * Hex string type
 * @typedef {`0x${string}`} Hex
 */

/**
 * Address type (20 bytes hex)
 * @typedef {Hex} Address
 */

/**
 * Block parameter type
 * @typedef {bigint | Hex | 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'} BlockParam
 */

/**
 * Options for creating a memory client
 * @typedef {Object} MemoryClientOptions
 * @property {Object} [fork] - Fork configuration
 * @property {string} [fork.url] - RPC URL to fork from
 * @property {bigint | Hex | 'latest'} [fork.blockNumber] - Block number to fork from
 * @property {number} [fork.chainId] - Chain ID to use
 * @property {Object} [common] - Common chain configuration
 * @property {number} [common.chainId] - Chain ID
 * @property {string} [common.hardfork] - Hardfork to use (default: 'prague')
 * @property {number[]} [common.eips] - EIPs to enable
 * @property {import('@tevm/logger-effect').LogLevel} [loggingLevel] - Logging level
 * @property {boolean} [allowUnlimitedContractSize] - Allow unlimited contract size
 * @property {Address} [miningConfig.address] - Mining reward address
 * @property {boolean} [profiler] - Enable EVM profiler
 */

/**
 * Shape of the MemoryClient service - provides access to all tevm functionality
 * @typedef {Object} MemoryClientShape
 * @property {import('effect').Effect.Effect<boolean, never, never>} ready - Check if client is ready
 * @property {import('effect').Effect.Effect<bigint, import('@tevm/errors-effect').InternalError, never>} getBlockNumber - Get current block number
 * @property {import('effect').Effect.Effect<bigint, never, never>} getChainId - Get chain ID
 * @property {(params: import('@tevm/actions-effect').GetAccountParams) => import('effect').Effect.Effect<import('@tevm/actions-effect').GetAccountSuccess, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} getAccount - Get account info
 * @property {(params: import('@tevm/actions-effect').SetAccountParams) => import('effect').Effect.Effect<import('@tevm/actions-effect').SetAccountSuccess, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} setAccount - Set account state
 * @property {(params: import('@tevm/actions-effect').GetBalanceParams) => import('effect').Effect.Effect<bigint, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} getBalance - Get account balance
 * @property {(params: import('@tevm/actions-effect').GetCodeParams) => import('effect').Effect.Effect<Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} getCode - Get account code
 * @property {(params: import('@tevm/actions-effect').GetStorageAtParams) => import('effect').Effect.Effect<Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} getStorageAt - Get storage value
 * @property {() => import('effect').Effect.Effect<Hex, import('@tevm/errors-effect').StorageError, never>} takeSnapshot - Take state snapshot
 * @property {(snapshotId: Hex) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').SnapshotNotFoundError | import('@tevm/errors-effect').StateRootNotFoundError, never>} revertToSnapshot - Revert to snapshot
 * @property {() => import('effect').Effect.Effect<MemoryClientShape, never, never>} deepCopy - Create deep copy of client
 * @property {import('effect').Effect.Effect<void, never, never>} dispose - Dispose of client resources
 */

/**
 * Options for the MemoryClientLive layer
 * @typedef {Object} MemoryClientLiveOptions
 * @property {MemoryClientOptions} [options] - Memory client options
 */

export {}
