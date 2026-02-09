/**
 * @module @tevm/state-effect/StateManagerShape
 * @description Documentation for the StateManagerShape interface
 */

/**
 * @typedef {import('./types.js').StateManagerShape} StateManagerShape
 */

/**
 * StateManagerShape Interface
 * ===========================
 *
 * The `StateManagerShape` interface defines the Effect-based API for state management operations.
 * All methods are wrapped in Effect for composable error handling and dependency injection.
 *
 * ## Properties
 *
 * ### stateManager
 * The underlying `@tevm/state` StateManager instance. Direct access is provided for
 * advanced use cases that need the raw Promise-based API.
 *
 * ### getAccount(address)
 * Get an account by its address. Returns `undefined` if the account doesn't exist.
 *
 * Returns: `Effect<Account | undefined, AccountNotFoundError>`
 *
 * ### putAccount(address, account)
 * Set or update an account at an address.
 *
 * Returns: `Effect<void, InternalError>`
 *
 * ### deleteAccount(address)
 * Delete an account at an address.
 *
 * Returns: `Effect<void, InternalError>`
 *
 * ### getStorage(address, slot)
 * Get the storage value at a specific address and slot.
 *
 * Returns: `Effect<Uint8Array, StorageError>`
 *
 * ### putStorage(address, slot, value)
 * Set a storage value at a specific address and slot.
 *
 * Returns: `Effect<void, StorageError>`
 *
 * ### clearStorage(address)
 * Clear all storage for an address.
 *
 * Returns: `Effect<void, StorageError>`
 *
 * ### getCode(address)
 * Get the bytecode at an address.
 *
 * Returns: `Effect<Uint8Array, InternalError>`
 *
 * ### putCode(address, code)
 * Set the bytecode at an address.
 *
 * Returns: `Effect<void, InternalError>`
 *
 * ### getStateRoot()
 * Get the current state root (merkle root of the state trie).
 *
 * Returns: `Effect<Uint8Array, StateRootNotFoundError>`
 *
 * ### setStateRoot(root)
 * Set the state root. Fails if the state root doesn't exist.
 *
 * Returns: `Effect<void, StateRootNotFoundError>`
 *
 * ### checkpoint()
 * Create a state checkpoint for atomic operations.
 * Call `commit()` to persist changes or `revert()` to undo them.
 *
 * Returns: `Effect<void, InternalError>`
 *
 * ### commit()
 * Commit the current checkpoint, persisting all changes since the last checkpoint.
 *
 * Returns: `Effect<void, InternalError>`
 *
 * ### revert()
 * Revert to the last checkpoint, undoing all changes.
 *
 * Returns: `Effect<void, InternalError>`
 *
 * ### dumpState()
 * Dump the entire state as a TevmState object.
 * Useful for testing, debugging, or state persistence.
 *
 * Returns: `Effect<TevmState, InternalError>`
 *
 * ### loadState(state)
 * Load state from a TevmState object.
 * Useful for restoring state from a dump.
 *
 * Returns: `Effect<void, InternalError>`
 *
 * ### ready
 * An Effect that completes when the state manager is fully initialized.
 *
 * Returns: `Effect<void, NodeNotReadyError>`
 *
 * ### deepCopy()
 * Create a deep copy of the state manager with independent state.
 *
 * Returns: `Effect<StateManagerShape, InternalError>`
 *
 * ### shallowCopy()
 * Create a shallow copy that shares state with the original.
 *
 * Returns: `StateManagerShape` (synchronous)
 *
 * ## Usage Example
 *
 * ```javascript
 * import { Effect } from 'effect'
 * import { StateManagerService } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const stateManager = yield* StateManagerService
 *
 *   // Wait for state manager to be ready
 *   yield* stateManager.ready
 *
 *   // Get the state root
 *   const stateRoot = yield* stateManager.getStateRoot()
 *   console.log('State root:', stateRoot)
 *
 *   // Atomic update with checkpoint
 *   yield* stateManager.checkpoint()
 *   try {
 *     yield* stateManager.putStorage(address, slot, value)
 *     yield* stateManager.commit()
 *   } catch {
 *     yield* stateManager.revert()
 *   }
 * })
 * ```
 */

export {}
