/**
 * Hex string type
 */
export type Hex = `0x${string}`;
/**
 * Address type (20 bytes hex)
 */
export type Address = Hex;
/**
 * Block parameter type
 */
export type BlockParam = bigint | Hex | "latest" | "earliest" | "pending" | "safe" | "finalized";
/**
 * Options for creating a memory client
 */
export type MemoryClientOptions = {
    /**
     * - Fork configuration
     */
    fork?: {
        /**
         * - RPC URL to fork from
         */
        url?: string | undefined;
        /**
         * - Block number to fork from
         */
        blockNumber?: bigint | `0x${string}` | "latest" | undefined;
        /**
         * - Chain ID to use
         */
        chainId?: number | undefined;
    } | undefined;
    /**
     * - Common chain configuration
     */
    common?: {
        /**
         * - Chain ID
         */
        chainId?: number | undefined;
        /**
         * - Hardfork to use (default: 'prague')
         */
        hardfork?: string | undefined;
        /**
         * - EIPs to enable
         */
        eips?: number[] | undefined;
    } | undefined;
    /**
     * - Logging level
     */
    loggingLevel?: import("@tevm/logger-effect").LogLevel | undefined;
    /**
     * - Allow unlimited contract size
     */
    allowUnlimitedContractSize?: boolean | undefined;
    /**
     * - Mining reward address
     */
    address?: `0x${string}` | undefined;
    /**
     * - Enable EVM profiler
     */
    profiler?: boolean | undefined;
};
/**
 * Shape of the MemoryClient service - provides access to all tevm functionality
 */
export type MemoryClientShape = {
    /**
     * - Check if client is ready
     */
    ready: import("effect").Effect.Effect<boolean, never, never>;
    /**
     * - Get current block number
     */
    getBlockNumber: import("effect").Effect.Effect<bigint, import("@tevm/errors-effect").InternalError, never>;
    /**
     * - Get chain ID
     */
    getChainId: import("effect").Effect.Effect<bigint, never, never>;
    /**
     * - Get account info
     */
    getAccount: (params: import("@tevm/actions-effect").GetAccountParams) => import("effect").Effect.Effect<import("@tevm/actions-effect").GetAccountSuccess, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError, never>;
    /**
     * - Set account state
     */
    setAccount: (params: import("@tevm/actions-effect").SetAccountParams) => import("effect").Effect.Effect<import("@tevm/actions-effect").SetAccountSuccess, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError, never>;
    /**
     * - Get account balance
     */
    getBalance: (params: import("@tevm/actions-effect").GetBalanceParams) => import("effect").Effect.Effect<bigint, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError, never>;
    /**
     * - Get account code
     */
    getCode: (params: import("@tevm/actions-effect").GetCodeParams) => import("effect").Effect.Effect<Hex, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError, never>;
    /**
     * - Get storage value
     */
    getStorageAt: (params: import("@tevm/actions-effect").GetStorageAtParams) => import("effect").Effect.Effect<Hex, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError, never>;
    /**
     * - Take state snapshot
     */
    takeSnapshot: () => import("effect").Effect.Effect<Hex, import("@tevm/errors-effect").StorageError, never>;
    /**
     * - Revert to snapshot
     */
    revertToSnapshot: (snapshotId: Hex) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").SnapshotNotFoundError | import("@tevm/errors-effect").StateRootNotFoundError, never>;
    /**
     * - Create deep copy of client
     */
    deepCopy: () => import("effect").Effect.Effect<MemoryClientShape, never, never>;
    /**
     * - Dispose of client resources
     */
    dispose: import("effect").Effect.Effect<void, never, never>;
};
/**
 * Options for the MemoryClientLive layer
 */
export type MemoryClientLiveOptions = {
    /**
     * - Memory client options
     */
    options?: MemoryClientOptions | undefined;
};
//# sourceMappingURL=types.d.ts.map