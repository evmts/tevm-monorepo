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
    takeSnapshot: () => import("effect").Effect.Effect<Hex, import("@tevm/errors-effect").StorageError, never>;
    /**
     * - Revert to a snapshot by ID
     */
    revertToSnapshot: (id: Hex) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").SnapshotNotFoundError | import("@tevm/errors-effect").StateRootNotFoundError, never>;
    /**
     * - Get a snapshot by ID
     */
    getSnapshot: (id: Hex) => import("effect").Effect.Effect<Snapshot | undefined>;
    /**
     * - Get all snapshots
     */
    getAllSnapshots: import("effect").Effect.Effect<Map<Hex, Snapshot>>;
    /**
     * - Create a deep copy of the snapshot state
     */
    deepCopy: () => import("effect").Effect.Effect<SnapshotShape>;
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
/**
 * FilterShape interface for Effect-based filter management.
 *
 * This interface provides Effect-wrapped methods for managing blockchain event filters.
 * Filters are used to track new blocks, pending transactions, and contract logs.
 */
export type FilterShape = {
    /**
     * - Create a log filter
     */
    createLogFilter: (params?: LogFilterParams) => import("effect").Effect.Effect<Hex>;
    /**
     * - Create a block filter
     */
    createBlockFilter: () => import("effect").Effect.Effect<Hex>;
    /**
     * - Create a pending transaction filter
     */
    createPendingTransactionFilter: () => import("effect").Effect.Effect<Hex>;
    /**
     * - Get a filter by ID
     */
    get: (id: Hex) => import("effect").Effect.Effect<Filter | undefined>;
    /**
     * - Remove a filter by ID
     */
    remove: (id: Hex) => import("effect").Effect.Effect<boolean>;
    /**
     * - Get and clear log changes for a filter
     */
    getChanges: (id: Hex) => import("effect").Effect.Effect<Array<FilterLog>, import("@tevm/errors-effect").FilterNotFoundError | import("@tevm/errors-effect").InvalidFilterTypeError>;
    /**
     * - Get and clear block changes for a block filter
     */
    getBlockChanges: (id: Hex) => import("effect").Effect.Effect<Array<unknown>, import("@tevm/errors-effect").FilterNotFoundError | import("@tevm/errors-effect").InvalidFilterTypeError>;
    /**
     * - Get and clear tx changes for a pending tx filter
     */
    getPendingTransactionChanges: (id: Hex) => import("effect").Effect.Effect<Array<unknown>, import("@tevm/errors-effect").FilterNotFoundError | import("@tevm/errors-effect").InvalidFilterTypeError>;
    /**
     * - Add a log to a filter
     */
    addLog: (id: Hex, log: FilterLog) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").FilterNotFoundError>;
    /**
     * - Add a block to a block filter
     */
    addBlock: (id: Hex, block: unknown) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").FilterNotFoundError>;
    /**
     * - Add a tx to a pending tx filter
     */
    addPendingTransaction: (id: Hex, tx: unknown) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").FilterNotFoundError>;
    /**
     * - Get all filters
     */
    getAllFilters: import("effect").Effect.Effect<Map<Hex, Filter>>;
    /**
     * - Create a deep copy of the filter state
     */
    deepCopy: () => import("effect").Effect.Effect<FilterShape>;
};
//# sourceMappingURL=types.d.ts.map