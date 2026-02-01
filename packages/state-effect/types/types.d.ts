/**
 * Ethereum hex string type (0x prefixed)
 */
export type Hex = `0x${string}`;
/**
 * Ethereum address type - can be either a hex string or an EthjsAddress instance.
 * The implementation will convert hex strings to EthjsAddress objects internally.
 */
export type Address = Hex | import("@tevm/utils").EthjsAddress;
/**
 * 32-byte storage slot identifier
 */
export type Bytes32 = Uint8Array;
/**
 * StateManager shape interface for Effect-based state operations.
 *
 * This interface provides Effect-wrapped methods for interacting with the
 * Ethereum state, including account, storage, and code operations.
 */
export type StateManagerShape = {
    /**
     * - The underlying StateManager instance
     */
    stateManager: import("@tevm/state").StateManager;
    /**
     * - Get an account by address
     */
    getAccount: (address: Address) => import("effect").Effect.Effect<import("@tevm/utils").EthjsAccount | undefined>;
    /**
     * - Set an account at an address
     */
    putAccount: (address: Address, account: import("@tevm/utils").EthjsAccount) => import("effect").Effect.Effect<void>;
    /**
     * - Delete an account at an address
     */
    deleteAccount: (address: Address) => import("effect").Effect.Effect<void>;
    /**
     * - Get storage value at address and slot
     */
    getStorage: (address: Address, slot: Uint8Array) => import("effect").Effect.Effect<Uint8Array>;
    /**
     * - Set storage value at address and slot
     */
    putStorage: (address: Address, slot: Uint8Array, value: Uint8Array) => import("effect").Effect.Effect<void>;
    /**
     * - Clear all storage for an address
     */
    clearStorage: (address: Address) => import("effect").Effect.Effect<void>;
    /**
     * - Get the code at an address
     */
    getCode: (address: Address) => import("effect").Effect.Effect<Uint8Array>;
    /**
     * - Set the code at an address
     */
    putCode: (address: Address, code: Uint8Array) => import("effect").Effect.Effect<void>;
    /**
     * - Get the current state root
     */
    getStateRoot: () => import("effect").Effect.Effect<Uint8Array>;
    /**
     * - Set the state root
     */
    setStateRoot: (root: Uint8Array) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").StateRootNotFoundError>;
    /**
     * - Create a state checkpoint
     */
    checkpoint: () => import("effect").Effect.Effect<void>;
    /**
     * - Commit the current checkpoint
     */
    commit: () => import("effect").Effect.Effect<void>;
    /**
     * - Revert to the last checkpoint
     */
    revert: () => import("effect").Effect.Effect<void>;
    /**
     * - Dump the entire state
     */
    dumpState: () => import("effect").Effect.Effect<import("@tevm/state").TevmState>;
    /**
     * - Load state from a dump
     */
    loadState: (state: import("@tevm/state").TevmState) => import("effect").Effect.Effect<void>;
    /**
     * - Effect that completes when the state manager is ready
     */
    ready: import("effect").Effect.Effect<void>;
    /**
     * - Create a deep copy of the state manager
     */
    deepCopy: () => import("effect").Effect.Effect<StateManagerShape>;
    /**
     * - Create a shallow copy of the state manager
     */
    shallowCopy: () => StateManagerShape;
};
/**
 * Configuration options for StateManagerLocal layer
 */
export type StateManagerLocalOptions = {
    /**
     * - Optional genesis state root override
     */
    genesisStateRoot?: Uint8Array;
    /**
     * - Enable logging for state operations
     */
    loggingEnabled?: boolean;
};
/**
 * Configuration options for StateManagerLive layer
 */
export type StateManagerLiveOptions = {
    /**
     * - Optional genesis state root override
     */
    genesisStateRoot?: Uint8Array;
    /**
     * - Enable logging for state operations
     */
    loggingEnabled?: boolean;
};
//# sourceMappingURL=types.d.ts.map