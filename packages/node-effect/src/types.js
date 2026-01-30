/**
 * @module @tevm/node-effect/types
 * @description Type definitions for the node-effect package
 */

/**
 * Address type for Ethereum addresses.
 * @typedef {`0x${string}`} Address
 */

/**
 * Hex type for hex-encoded strings.
 * @typedef {`0x${string}`} Hex
 */

/**
 * ImpersonationShape interface for Effect-based impersonation state management.
 *
 * This interface provides Effect-wrapped methods for managing account impersonation
 * state in a Tevm node. Impersonation allows transactions to be sent as if they
 * were signed by any address.
 *
 * @typedef {Object} ImpersonationShape
 * @property {import('effect').Effect.Effect<Address | undefined>} getImpersonatedAccount - Get the currently impersonated account
 * @property {(address: Address | undefined) => import('effect').Effect.Effect<void>} setImpersonatedAccount - Set the impersonated account
 * @property {import('effect').Effect.Effect<boolean>} getAutoImpersonate - Get whether auto-impersonation is enabled
 * @property {(enabled: boolean) => import('effect').Effect.Effect<void>} setAutoImpersonate - Set auto-impersonation mode
 * @property {() => import('effect').Effect.Effect<ImpersonationShape>} deepCopy - Create a deep copy of the impersonation state
 */

/**
 * Configuration options for ImpersonationLive layer.
 * @typedef {Object} ImpersonationLiveOptions
 * @property {Address} [initialAccount] - Initial account to impersonate
 * @property {boolean} [autoImpersonate] - Enable auto-impersonation by default
 */

/**
 * BlockParamsShape interface for Effect-based block parameter management.
 *
 * This interface provides Effect-wrapped methods for managing block parameters
 * that override defaults for the next block to be mined.
 *
 * @typedef {Object} BlockParamsShape
 * @property {import('effect').Effect.Effect<bigint | undefined>} getNextBlockTimestamp - Get the next block timestamp override
 * @property {(ts: bigint | undefined) => import('effect').Effect.Effect<void>} setNextBlockTimestamp - Set the next block timestamp override
 * @property {import('effect').Effect.Effect<bigint | undefined>} getNextBlockGasLimit - Get the next block gas limit override
 * @property {(gl: bigint | undefined) => import('effect').Effect.Effect<void>} setNextBlockGasLimit - Set the next block gas limit override
 * @property {import('effect').Effect.Effect<bigint | undefined>} getNextBlockBaseFeePerGas - Get the next block base fee per gas override
 * @property {(bf: bigint | undefined) => import('effect').Effect.Effect<void>} setNextBlockBaseFeePerGas - Set the next block base fee per gas override
 * @property {import('effect').Effect.Effect<bigint | undefined>} getMinGasPrice - Get the minimum gas price
 * @property {(price: bigint | undefined) => import('effect').Effect.Effect<void>} setMinGasPrice - Set the minimum gas price
 * @property {import('effect').Effect.Effect<bigint | undefined>} getBlockTimestampInterval - Get the block timestamp interval
 * @property {(interval: bigint | undefined) => import('effect').Effect.Effect<void>} setBlockTimestampInterval - Set the block timestamp interval
 * @property {import('effect').Effect.Effect<void>} clearNextBlockOverrides - Clear all next block overrides (called after mining)
 * @property {() => import('effect').Effect.Effect<BlockParamsShape>} deepCopy - Create a deep copy of the block params state
 */

/**
 * Configuration options for BlockParamsLive layer.
 * @typedef {Object} BlockParamsLiveOptions
 * @property {bigint} [nextBlockTimestamp] - Initial next block timestamp override
 * @property {bigint} [nextBlockGasLimit] - Initial next block gas limit override
 * @property {bigint} [nextBlockBaseFeePerGas] - Initial next block base fee per gas override
 * @property {bigint} [minGasPrice] - Initial minimum gas price
 * @property {bigint} [blockTimestampInterval] - Initial block timestamp interval
 */

/**
 * Snapshot data stored for a snapshot ID.
 * @typedef {Object} Snapshot
 * @property {Hex} stateRoot - The state root at snapshot time
 * @property {import('@tevm/state').TevmState} state - The full state dump at snapshot time
 */

/**
 * SnapshotShape interface for Effect-based snapshot management.
 *
 * This interface provides Effect-wrapped methods for managing EVM state snapshots.
 * Snapshots allow reverting to a previous state, useful for testing and simulation.
 *
 * @typedef {Object} SnapshotShape
 * @property {() => import('effect').Effect.Effect<Hex, never, import('@tevm/state-effect').StateManagerService>} takeSnapshot - Take a snapshot and return its ID
 * @property {(id: Hex) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').SnapshotNotFoundError, import('@tevm/state-effect').StateManagerService>} revertToSnapshot - Revert to a snapshot by ID
 * @property {(id: Hex) => import('effect').Effect.Effect<Snapshot | undefined>} getSnapshot - Get a snapshot by ID
 * @property {import('effect').Effect.Effect<Map<Hex, Snapshot>>} getAllSnapshots - Get all snapshots
 * @property {() => import('effect').Effect.Effect<SnapshotShape>} deepCopy - Create a deep copy of the snapshot state
 */

/**
 * Filter type for classifying filters.
 * @typedef {'PendingTransaction' | 'Block' | 'Log'} FilterType
 */

/**
 * Log entry stored in a filter.
 * Uses bigint for blockNumber, logIndex, and transactionIndex for consistency.
 *
 * @typedef {Object} FilterLog
 * @property {Hex} address - Address that emitted the log
 * @property {Hex} blockHash - Block hash containing the log
 * @property {bigint} blockNumber - Block number containing the log
 * @property {Hex} data - Non-indexed log data
 * @property {bigint} logIndex - Index of the log within the block
 * @property {boolean} removed - Whether the log was removed due to a chain reorganization
 * @property {[Hex, ...Hex[]]} topics - Indexed log topics
 * @property {Hex} transactionHash - Transaction hash that created the log
 * @property {bigint} transactionIndex - Index of the transaction within the block
 */

/**
 * Parameters for creating a log filter.
 *
 * @typedef {Object} LogFilterParams
 * @property {Hex} [address] - Address to filter logs from
 * @property {Hex | Hex[]} [topics] - Topics to filter by
 * @property {bigint | Hex} [fromBlock] - Block number or tag to start from
 * @property {bigint | Hex} [toBlock] - Block number or tag to end at
 */

/**
 * Internal representation of a registered filter.
 * Adapted from go-ethereum filter system.
 *
 * @typedef {Object} Filter
 * @property {Hex} id - Id of the filter
 * @property {FilterType} type - The type of the filter
 * @property {number} created - Creation timestamp
 * @property {LogFilterParams} [logsCriteria] - Criteria for log filtering
 * @property {Array<FilterLog>} logs - Stored logs
 * @property {Array<unknown>} tx - Stored transactions
 * @property {Array<unknown>} blocks - Stored blocks
 * @property {Object} installed - Installation metadata
 * @property {Error | undefined} err - Error if any
 * @property {Array<(...args: Array<unknown>) => unknown>} registeredListeners - Listeners registered for the filter
 */

/**
 * FilterShape interface for Effect-based filter management.
 *
 * This interface provides Effect-wrapped methods for managing blockchain event filters.
 * Filters are used to track new blocks, pending transactions, and contract logs.
 *
 * @typedef {Object} FilterShape
 * @property {(params?: LogFilterParams) => import('effect').Effect.Effect<Hex>} createLogFilter - Create a log filter
 * @property {() => import('effect').Effect.Effect<Hex>} createBlockFilter - Create a block filter
 * @property {() => import('effect').Effect.Effect<Hex>} createPendingTransactionFilter - Create a pending transaction filter
 * @property {(id: Hex) => import('effect').Effect.Effect<Filter | undefined>} get - Get a filter by ID
 * @property {(id: Hex) => import('effect').Effect.Effect<boolean>} remove - Remove a filter by ID
 * @property {(id: Hex) => import('effect').Effect.Effect<Array<FilterLog>, import('@tevm/errors-effect').FilterNotFoundError>} getChanges - Get and clear log changes for a filter
 * @property {(id: Hex) => import('effect').Effect.Effect<Array<unknown>, import('@tevm/errors-effect').FilterNotFoundError>} getBlockChanges - Get and clear block changes for a block filter
 * @property {(id: Hex) => import('effect').Effect.Effect<Array<unknown>, import('@tevm/errors-effect').FilterNotFoundError>} getPendingTransactionChanges - Get and clear tx changes for a pending tx filter
 * @property {(id: Hex, log: FilterLog) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').FilterNotFoundError>} addLog - Add a log to a filter
 * @property {(id: Hex, block: unknown) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').FilterNotFoundError>} addBlock - Add a block to a block filter
 * @property {(id: Hex, tx: unknown) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').FilterNotFoundError>} addPendingTransaction - Add a tx to a pending tx filter
 * @property {import('effect').Effect.Effect<Map<Hex, Filter>>} getAllFilters - Get all filters
 * @property {() => import('effect').Effect.Effect<FilterShape>} deepCopy - Create a deep copy of the filter state
 */

export {}
