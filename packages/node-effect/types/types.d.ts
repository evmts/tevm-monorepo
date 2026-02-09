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
 * @property {() => import('effect').Effect.Effect<Hex, import('@tevm/errors-effect').StorageError | import('@tevm/errors-effect').StateRootNotFoundError | import('@tevm/errors-effect').InternalError, never>} takeSnapshot - Take a snapshot and return its ID
 * @property {(id: Hex) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').SnapshotNotFoundError | import('@tevm/errors-effect').StateRootNotFoundError | import('@tevm/errors-effect').InternalError, never>} revertToSnapshot - Revert to a snapshot by ID
 * @property {(id: Hex) => import('effect').Effect.Effect<Snapshot | undefined>} getSnapshot - Get a snapshot by ID
 * @property {import('effect').Effect.Effect<Map<Hex, Snapshot>>} getAllSnapshots - Get all snapshots
 * @property {(newStateManager?: import('@tevm/state-effect').StateManagerShape) => import('effect').Effect.Effect<SnapshotShape>} deepCopy - Create a deep copy of the snapshot state. IMPORTANT: You must pass the new stateManager if the parent's stateManager was also deep-copied, otherwise snapshots will operate on the original stateManager (Issue #234 fix)
 */
/**
 * FilterShape interface for Effect-based filter management.
 *
 * This interface provides Effect-wrapped methods for managing blockchain event filters
 * such as log filters, block filters, and pending transaction filters.
 *
 * @typedef {Object} FilterShape
 * @property {(params?: LogFilterParams) => import('effect').Effect.Effect<Hex>} createLogFilter - Create a new log filter with optional criteria
 * @property {() => import('effect').Effect.Effect<Hex>} createBlockFilter - Create a new block filter
 * @property {() => import('effect').Effect.Effect<Hex>} createPendingTransactionFilter - Create a new pending transaction filter
 * @property {(id: Hex) => import('effect').Effect.Effect<Filter | undefined>} get - Get a filter by ID
 * @property {(id: Hex) => import('effect').Effect.Effect<boolean>} remove - Remove a filter by ID, returns whether the filter was found
 * @property {(id: Hex) => import('effect').Effect.Effect<FilterLog[], import('@tevm/errors-effect').FilterNotFoundError | import('@tevm/errors-effect').InvalidFilterTypeError>} getChanges - Get log changes for a log filter
 * @property {(id: Hex) => import('effect').Effect.Effect<unknown[], import('@tevm/errors-effect').FilterNotFoundError | import('@tevm/errors-effect').InvalidFilterTypeError>} getBlockChanges - Get block changes for a block filter
 * @property {(id: Hex) => import('effect').Effect.Effect<unknown[], import('@tevm/errors-effect').FilterNotFoundError | import('@tevm/errors-effect').InvalidFilterTypeError>} getPendingTransactionChanges - Get pending transaction changes for a pending transaction filter
 * @property {(id: Hex, log: FilterLog) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').FilterNotFoundError | import('@tevm/errors-effect').InvalidFilterTypeError>} addLog - Add a log to a log filter
 * @property {(id: Hex, block: unknown) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').FilterNotFoundError | import('@tevm/errors-effect').InvalidFilterTypeError>} addBlock - Add a block to a block filter
 * @property {(id: Hex, tx: unknown) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').FilterNotFoundError | import('@tevm/errors-effect').InvalidFilterTypeError>} addPendingTransaction - Add a transaction to a pending transaction filter
 * @property {import('effect').Effect.Effect<Map<Hex, Filter>>} getAllFilters - Get all filters
 * @property {(expirationMs?: number) => import('effect').Effect.Effect<number>} cleanupExpiredFilters - Remove expired filters and return count of removed filters
 * @property {() => import('effect').Effect.Effect<FilterShape>} deepCopy - Create a deep copy of the filter state
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
 * @property {(Hex | Hex[] | null)[] | Hex} [topics] - Topics to filter by (supports nested arrays for OR matching per Ethereum JSON-RPC spec)
 * @property {bigint | Hex} [fromBlock] - Block number or tag to start from
 * @property {bigint | Hex} [toBlock] - Block number or tag to end at
 */
/**
 * Internal representation of a registered filter.
 * Adapted from go-ethereum filter system.
 *
 * Per the Ethereum JSON-RPC specification, filters typically expire after
 * 5 minutes of inactivity. The lastAccessed timestamp is used to track
 * when a filter was last accessed (created or queried for changes).
 *
 * @typedef {Object} Filter
 * @property {Hex} id - Id of the filter
 * @property {FilterType} type - The type of the filter
 * @property {number} created - Creation timestamp
 * @property {number} lastAccessed - Last access timestamp (updated on getChanges calls)
 * @property {LogFilterParams} [logsCriteria] - Criteria for log filtering
 * @property {Array<FilterLog>} logs - Stored logs
 * @property {Array<unknown>} tx - Stored transactions
 * @property {Array<unknown>} blocks - Stored blocks
 * @property {Object} installed - Installation metadata
 * @property {Error | undefined} err - Error if any
 * @property {Array<(...args: Array<unknown>) => unknown>} registeredListeners - Listeners registered for the filter
 */
/**
 * Default filter expiration timeout in milliseconds (5 minutes).
 * Per the Ethereum JSON-RPC specification, filters expire after 5 minutes of inactivity.
 * @type {number}
 */
export const DEFAULT_FILTER_EXPIRATION_MS: number;
/**
 * Address type for Ethereum addresses.
 */
export type Address = `0x${string}`;
/**
 * Hex type for hex-encoded strings.
 */
export type Hex = `0x${string}`;
/**
 * ImpersonationShape interface for Effect-based impersonation state management.
 *
 * This interface provides Effect-wrapped methods for managing account impersonation
 * state in a Tevm node. Impersonation allows transactions to be sent as if they
 * were signed by any address.
 */
export type ImpersonationShape = {
    /**
     * - Get the currently impersonated account
     */
    getImpersonatedAccount: import("effect").Effect.Effect<Address | undefined>;
    /**
     * - Set the impersonated account
     */
    setImpersonatedAccount: (address: Address | undefined) => import("effect").Effect.Effect<void>;
    /**
     * - Get whether auto-impersonation is enabled
     */
    getAutoImpersonate: import("effect").Effect.Effect<boolean>;
    /**
     * - Set auto-impersonation mode
     */
    setAutoImpersonate: (enabled: boolean) => import("effect").Effect.Effect<void>;
    /**
     * - Create a deep copy of the impersonation state
     */
    deepCopy: () => import("effect").Effect.Effect<ImpersonationShape>;
};
/**
 * Configuration options for ImpersonationLive layer.
 */
export type ImpersonationLiveOptions = {
    /**
     * - Initial account to impersonate
     */
    initialAccount?: Address;
    /**
     * - Enable auto-impersonation by default
     */
    autoImpersonate?: boolean;
};
/**
 * BlockParamsShape interface for Effect-based block parameter management.
 *
 * This interface provides Effect-wrapped methods for managing block parameters
 * that override defaults for the next block to be mined.
 */
export type BlockParamsShape = {
    /**
     * - Get the next block timestamp override
     */
    getNextBlockTimestamp: import("effect").Effect.Effect<bigint | undefined>;
    /**
     * - Set the next block timestamp override
     */
    setNextBlockTimestamp: (ts: bigint | undefined) => import("effect").Effect.Effect<void>;
    /**
     * - Get the next block gas limit override
     */
    getNextBlockGasLimit: import("effect").Effect.Effect<bigint | undefined>;
    /**
     * - Set the next block gas limit override
     */
    setNextBlockGasLimit: (gl: bigint | undefined) => import("effect").Effect.Effect<void>;
    /**
     * - Get the next block base fee per gas override
     */
    getNextBlockBaseFeePerGas: import("effect").Effect.Effect<bigint | undefined>;
    /**
     * - Set the next block base fee per gas override
     */
    setNextBlockBaseFeePerGas: (bf: bigint | undefined) => import("effect").Effect.Effect<void>;
    /**
     * - Get the minimum gas price
     */
    getMinGasPrice: import("effect").Effect.Effect<bigint | undefined>;
    /**
     * - Set the minimum gas price
     */
    setMinGasPrice: (price: bigint | undefined) => import("effect").Effect.Effect<void>;
    /**
     * - Get the block timestamp interval
     */
    getBlockTimestampInterval: import("effect").Effect.Effect<bigint | undefined>;
    /**
     * - Set the block timestamp interval
     */
    setBlockTimestampInterval: (interval: bigint | undefined) => import("effect").Effect.Effect<void>;
    /**
     * - Clear all next block overrides (called after mining)
     */
    clearNextBlockOverrides: import("effect").Effect.Effect<void>;
    /**
     * - Create a deep copy of the block params state
     */
    deepCopy: () => import("effect").Effect.Effect<BlockParamsShape>;
};
/**
 * Configuration options for BlockParamsLive layer.
 */
export type BlockParamsLiveOptions = {
    /**
     * - Initial next block timestamp override
     */
    nextBlockTimestamp?: bigint;
    /**
     * - Initial next block gas limit override
     */
    nextBlockGasLimit?: bigint;
    /**
     * - Initial next block base fee per gas override
     */
    nextBlockBaseFeePerGas?: bigint;
    /**
     * - Initial minimum gas price
     */
    minGasPrice?: bigint;
    /**
     * - Initial block timestamp interval
     */
    blockTimestampInterval?: bigint;
};
/**
 * Snapshot data stored for a snapshot ID.
 */
export type Snapshot = {
    /**
     * - The state root at snapshot time
     */
    stateRoot: Hex;
    /**
     * - The full state dump at snapshot time
     */
    state: import("@tevm/state").TevmState;
};
/**
 * SnapshotShape interface for Effect-based snapshot management.
 *
 * This interface provides Effect-wrapped methods for managing EVM state snapshots.
 * Snapshots allow reverting to a previous state, useful for testing and simulation.
 */
export type SnapshotShape = {
    /**
     * - Take a snapshot and return its ID
     */
    takeSnapshot: () => import("effect").Effect.Effect<Hex, import("@tevm/errors-effect").StorageError | import("@tevm/errors-effect").StateRootNotFoundError | import("@tevm/errors-effect").InternalError, never>;
    /**
     * - Revert to a snapshot by ID
     */
    revertToSnapshot: (id: Hex) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").SnapshotNotFoundError | import("@tevm/errors-effect").StateRootNotFoundError | import("@tevm/errors-effect").InternalError, never>;
    /**
     * - Get a snapshot by ID
     */
    getSnapshot: (id: Hex) => import("effect").Effect.Effect<Snapshot | undefined>;
    /**
     * - Get all snapshots
     */
    getAllSnapshots: import("effect").Effect.Effect<Map<Hex, Snapshot>>;
    /**
     * - Create a deep copy of the snapshot state. IMPORTANT: You must pass the new stateManager if the parent's stateManager was also deep-copied, otherwise snapshots will operate on the original stateManager (Issue #234 fix)
     */
    deepCopy: (newStateManager?: import("@tevm/state-effect").StateManagerShape) => import("effect").Effect.Effect<SnapshotShape>;
};
/**
 * FilterShape interface for Effect-based filter management.
 *
 * This interface provides Effect-wrapped methods for managing blockchain event filters
 * such as log filters, block filters, and pending transaction filters.
 */
export type FilterShape = {
    /**
     * - Create a new log filter with optional criteria
     */
    createLogFilter: (params?: LogFilterParams) => import("effect").Effect.Effect<Hex>;
    /**
     * - Create a new block filter
     */
    createBlockFilter: () => import("effect").Effect.Effect<Hex>;
    /**
     * - Create a new pending transaction filter
     */
    createPendingTransactionFilter: () => import("effect").Effect.Effect<Hex>;
    /**
     * - Get a filter by ID
     */
    get: (id: Hex) => import("effect").Effect.Effect<Filter | undefined>;
    /**
     * - Remove a filter by ID, returns whether the filter was found
     */
    remove: (id: Hex) => import("effect").Effect.Effect<boolean>;
    /**
     * - Get log changes for a log filter
     */
    getChanges: (id: Hex) => import("effect").Effect.Effect<FilterLog[], import("@tevm/errors-effect").FilterNotFoundError | import("@tevm/errors-effect").InvalidFilterTypeError>;
    /**
     * - Get block changes for a block filter
     */
    getBlockChanges: (id: Hex) => import("effect").Effect.Effect<unknown[], import("@tevm/errors-effect").FilterNotFoundError | import("@tevm/errors-effect").InvalidFilterTypeError>;
    /**
     * - Get pending transaction changes for a pending transaction filter
     */
    getPendingTransactionChanges: (id: Hex) => import("effect").Effect.Effect<unknown[], import("@tevm/errors-effect").FilterNotFoundError | import("@tevm/errors-effect").InvalidFilterTypeError>;
    /**
     * - Add a log to a log filter
     */
    addLog: (id: Hex, log: FilterLog) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").FilterNotFoundError | import("@tevm/errors-effect").InvalidFilterTypeError>;
    /**
     * - Add a block to a block filter
     */
    addBlock: (id: Hex, block: unknown) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").FilterNotFoundError | import("@tevm/errors-effect").InvalidFilterTypeError>;
    /**
     * - Add a transaction to a pending transaction filter
     */
    addPendingTransaction: (id: Hex, tx: unknown) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").FilterNotFoundError | import("@tevm/errors-effect").InvalidFilterTypeError>;
    /**
     * - Get all filters
     */
    getAllFilters: import("effect").Effect.Effect<Map<Hex, Filter>>;
    /**
     * - Remove expired filters and return count of removed filters
     */
    cleanupExpiredFilters: (expirationMs?: number) => import("effect").Effect.Effect<number>;
    /**
     * - Create a deep copy of the filter state
     */
    deepCopy: () => import("effect").Effect.Effect<FilterShape>;
};
/**
 * Filter type for classifying filters.
 */
export type FilterType = "PendingTransaction" | "Block" | "Log";
/**
 * Log entry stored in a filter.
 * Uses bigint for blockNumber, logIndex, and transactionIndex for consistency.
 */
export type FilterLog = {
    /**
     * - Address that emitted the log
     */
    address: Hex;
    /**
     * - Block hash containing the log
     */
    blockHash: Hex;
    /**
     * - Block number containing the log
     */
    blockNumber: bigint;
    /**
     * - Non-indexed log data
     */
    data: Hex;
    /**
     * - Index of the log within the block
     */
    logIndex: bigint;
    /**
     * - Whether the log was removed due to a chain reorganization
     */
    removed: boolean;
    /**
     * - Indexed log topics
     */
    topics: [Hex, ...Hex[]];
    /**
     * - Transaction hash that created the log
     */
    transactionHash: Hex;
    /**
     * - Index of the transaction within the block
     */
    transactionIndex: bigint;
};
/**
 * Parameters for creating a log filter.
 */
export type LogFilterParams = {
    /**
     * - Address to filter logs from
     */
    address?: Hex;
    /**
     * - Topics to filter by (supports nested arrays for OR matching per Ethereum JSON-RPC spec)
     */
    topics?: (Hex | Hex[] | null)[] | Hex;
    /**
     * - Block number or tag to start from
     */
    fromBlock?: bigint | Hex;
    /**
     * - Block number or tag to end at
     */
    toBlock?: bigint | Hex;
};
/**
 * Internal representation of a registered filter.
 * Adapted from go-ethereum filter system.
 *
 * Per the Ethereum JSON-RPC specification, filters typically expire after
 * 5 minutes of inactivity. The lastAccessed timestamp is used to track
 * when a filter was last accessed (created or queried for changes).
 */
export type Filter = {
    /**
     * - Id of the filter
     */
    id: Hex;
    /**
     * - The type of the filter
     */
    type: FilterType;
    /**
     * - Creation timestamp
     */
    created: number;
    /**
     * - Last access timestamp (updated on getChanges calls)
     */
    lastAccessed: number;
    /**
     * - Criteria for log filtering
     */
    logsCriteria?: LogFilterParams;
    /**
     * - Stored logs
     */
    logs: Array<FilterLog>;
    /**
     * - Stored transactions
     */
    tx: Array<unknown>;
    /**
     * - Stored blocks
     */
    blocks: Array<unknown>;
    /**
     * - Installation metadata
     */
    installed: Object;
    /**
     * - Error if any
     */
    err: Error | undefined;
    /**
     * - Listeners registered for the filter
     */
    registeredListeners: Array<(...args: Array<unknown>) => unknown>;
};
//# sourceMappingURL=types.d.ts.map