/**
 * @module @tevm/state-effect/types
 * @description Type definitions for the state-effect package
 */

/**
 * Ethereum hex string type (0x prefixed)
 * @typedef {`0x${string}`} Hex
 */

/**
 * Ethereum address type (20 bytes hex string)
 * @typedef {Hex} Address
 */

/**
 * 32-byte storage slot identifier
 * @typedef {Uint8Array} Bytes32
 */

/**
 * StateManager shape interface for Effect-based state operations.
 *
 * This interface provides Effect-wrapped methods for interacting with the
 * Ethereum state, including account, storage, and code operations.
 *
 * @typedef {Object} StateManagerShape
 * @property {import('@tevm/state').StateManager} stateManager - The underlying StateManager instance
 * @property {(address: Address) => import('effect').Effect.Effect<import('@tevm/utils').EthjsAccount | undefined>} getAccount - Get an account by address
 * @property {(address: Address, account: import('@tevm/utils').EthjsAccount) => import('effect').Effect.Effect<void>} putAccount - Set an account at an address
 * @property {(address: Address) => import('effect').Effect.Effect<void>} deleteAccount - Delete an account at an address
 * @property {(address: Address, slot: Uint8Array) => import('effect').Effect.Effect<Uint8Array>} getStorage - Get storage value at address and slot
 * @property {(address: Address, slot: Uint8Array, value: Uint8Array) => import('effect').Effect.Effect<void>} putStorage - Set storage value at address and slot
 * @property {(address: Address) => import('effect').Effect.Effect<void>} clearStorage - Clear all storage for an address
 * @property {(address: Address) => import('effect').Effect.Effect<Uint8Array>} getCode - Get the code at an address
 * @property {(address: Address, code: Uint8Array) => import('effect').Effect.Effect<void>} putCode - Set the code at an address
 * @property {() => import('effect').Effect.Effect<Uint8Array>} getStateRoot - Get the current state root
 * @property {(root: Uint8Array) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').StateRootNotFoundError>} setStateRoot - Set the state root
 * @property {() => import('effect').Effect.Effect<void>} checkpoint - Create a state checkpoint
 * @property {() => import('effect').Effect.Effect<void>} commit - Commit the current checkpoint
 * @property {() => import('effect').Effect.Effect<void>} revert - Revert to the last checkpoint
 * @property {() => import('effect').Effect.Effect<import('@tevm/state').TevmState>} dumpState - Dump the entire state
 * @property {(state: import('@tevm/state').TevmState) => import('effect').Effect.Effect<void>} loadState - Load state from a dump
 * @property {import('effect').Effect.Effect<void>} ready - Effect that completes when the state manager is ready
 * @property {() => import('effect').Effect.Effect<StateManagerShape>} deepCopy - Create a deep copy of the state manager
 * @property {() => StateManagerShape} shallowCopy - Create a shallow copy of the state manager
 */

/**
 * Configuration options for StateManagerLocal layer
 * @typedef {Object} StateManagerLocalOptions
 * @property {Uint8Array} [genesisStateRoot] - Optional genesis state root override
 * @property {boolean} [loggingEnabled] - Enable logging for state operations
 */

/**
 * Configuration options for StateManagerLive layer
 * @typedef {Object} StateManagerLiveOptions
 * @property {Uint8Array} [genesisStateRoot] - Optional genesis state root override
 * @property {boolean} [loggingEnabled] - Enable logging for state operations
 */

export {}
