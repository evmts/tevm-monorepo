import { Effect, Layer, Ref } from 'effect'
import { SnapshotNotFoundError, StateRootNotFoundError, StorageError } from '@tevm/errors-effect'
import { StateManagerService } from '@tevm/state-effect'
import { SnapshotService } from './SnapshotService.js'

/**
 * @module @tevm/node-effect/SnapshotLive
 * @description Layer that creates SnapshotService using Effect Refs
 */

/**
 * @typedef {import('./types.js').SnapshotShape} SnapshotShape
 * @typedef {import('./types.js').Snapshot} Snapshot
 * @typedef {import('./types.js').Hex} Hex
 */

/**
 * Converts a number to a hex string.
 * @param {number} num - The number to convert
 * @returns {Hex} The hex string
 */
const toHex = (num) => /** @type {Hex} */ (`0x${num.toString(16)}`)

/**
 * Converts a Uint8Array to a hex string.
 * @param {Uint8Array} bytes - The bytes to convert
 * @returns {Hex} The hex string
 */
const bytesToHex = (bytes) => /** @type {Hex} */ (`0x${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`)

/**
 * Validates that a string contains only valid hexadecimal characters.
 * @param {string} str - The string to validate (without 0x prefix)
 * @returns {boolean} True if valid hex, false otherwise
 */
const isValidHex = (str) => /^[0-9a-fA-F]*$/.test(str)

/**
 * Converts a hex string to a Uint8Array.
 * Assumes hex string starts with '0x' prefix (as per Hex type definition).
 * @param {Hex} hex - The hex string to convert (must start with '0x')
 * @returns {Uint8Array} The bytes
 * @throws {Error} If hex string contains invalid characters (Issue #295 fix)
 */
const hexToBytes = (hex) => {
	const str = hex.slice(2) // Remove '0x' prefix
	// Validate hex characters BEFORE parsing to prevent silent data corruption (Issue #295 fix)
	/* c8 ignore start - defensive code: bytesToHex always produces valid hex */
	if (!isValidHex(str)) {
		throw new Error(`Invalid hex string: ${hex}. Contains non-hexadecimal characters.`)
	}
	/* c8 ignore stop */
	// Normalize odd-length hex strings by left-padding with a single '0'
	// This prevents silent data truncation (e.g., "0xabc" becomes "0abc" -> [0x0a, 0xbc])
	const normalizedStr = str.length % 2 === 1 ? '0' + str : str
	const bytes = new Uint8Array(normalizedStr.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(normalizedStr.slice(i * 2, i * 2 + 2), 16)
	}
	return bytes
}

/**
 * Creates a SnapshotService layer using Effect Refs for state management.
 *
 * This layer creates a service that manages EVM state snapshots with Refs:
 * - snapshots: Map of snapshot ID to snapshot data
 * - counter: Counter for generating unique snapshot IDs
 *
 * The service requires StateManagerService for state operations.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { SnapshotService, SnapshotLive } from '@tevm/node-effect'
 * import { StateManagerService, StateManagerLocal } from '@tevm/state-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const snapshot = yield* SnapshotService
 *   const id = yield* snapshot.takeSnapshot()
 *   console.log('Snapshot taken:', id)
 *   // Do operations...
 *   yield* snapshot.revertToSnapshot(id)
 *   console.log('Reverted to snapshot')
 * })
 *
 * const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
 * const layer = Layer.provide(SnapshotLive(), stateLayer)
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 */
export const SnapshotLive = () => {
	return Layer.effect(
		SnapshotService,
		Effect.gen(function* () {
			// Get StateManagerService dependency
			const stateManager = yield* StateManagerService

			// Create Refs for mutable state
			/** @type {Ref.Ref<Map<Hex, Snapshot>>} */
			const snapshotsRef = yield* Ref.make(new Map())
			/** @type {Ref.Ref<number>} */
			const counterRef = yield* Ref.make(1)

			/**
			 * Creates a SnapshotShape from Refs.
			 * This helper enables the deepCopy pattern.
			 *
			 * @param {Ref.Ref<Map<Hex, Snapshot>>} snapsRef
			 * @param {Ref.Ref<number>} ctrRef
			 * @param {import('@tevm/state-effect').StateManagerShape} stateMgr - The state manager to use for snapshot operations
			 */
			const createShape = (snapsRef, ctrRef, stateMgr) => {
				const shape = {
					takeSnapshot: () =>
						Effect.gen(function* () {
							// Generate unique ID first (atomic operation)
							const id = yield* Ref.getAndUpdate(ctrRef, (n) => n + 1)
							const hexId = toHex(id)

							// Create checkpoint to ensure atomic read of state root and state.
							// This prevents race conditions where concurrent operations could modify
							// state between getStateRoot and dumpState, causing inconsistent snapshots.
							yield* stateMgr.checkpoint()

							// Get current state with proper cleanup on failure.
							// The tapError is placed AFTER flatMap so it catches errors from both
							// Effect.all (getStateRoot/dumpState) AND commit(). This ensures the checkpoint
							// is properly reverted if any operation fails, preventing dangling checkpoints. (Issue #53 fix)
							const { stateRoot, state } = yield* Effect.all({
								stateRoot: stateMgr.getStateRoot(),
								state: stateMgr.dumpState(),
							}).pipe(
								Effect.flatMap((result) =>
									stateMgr.commit().pipe(Effect.map(() => result))
								),
								Effect.tapError(() => stateMgr.revert().pipe(Effect.catchAll(() => Effect.void))),
							)

							// Store snapshot
							yield* Ref.update(snapsRef, (map) => {
								const newMap = new Map(map)
								newMap.set(hexId, {
									stateRoot: bytesToHex(stateRoot),
									state,
								})
								return newMap
							})

							return hexId
						}).pipe(
							// Catch any defects (unhandled errors from state operations like checkpoint,
							// getStateRoot, dumpState) and convert them to typed StorageError.
							// This ensures the error type signature is accurate and errors are recoverable.
							Effect.catchAllDefect((defect) =>
								Effect.fail(
									new StorageError({
										message: `Failed to take snapshot: ${defect instanceof Error ? defect.message : String(defect)}`,
										cause: defect,
									}),
								),
							),
						),

					revertToSnapshot: (/** @type {Hex} */ id) =>
						Effect.gen(function* () {
							// Step 1: Read snapshot WITHOUT deleting it
							// This ensures we don't lose the snapshot if setStateRoot fails
							const snapshots = yield* Ref.get(snapsRef)
							const snapshot = snapshots.get(id)

							// Step 2: Check if snapshot exists BEFORE parsing the ID
							// This validates the ID format implicitly and avoids NaN from invalid hex
							if (!snapshot) {
								return yield* Effect.fail(
									new SnapshotNotFoundError({
										snapshotId: id,
										message: `Snapshot with id ${id} not found`,
									}),
								)
							}

							// Step 3: Parse the ID only after confirming snapshot exists
							// At this point, id is guaranteed to be a valid hex string since it was used as a key
							const targetNum = parseInt(id.slice(2), 16)

							// Step 4: Restore state ATOMICALLY using checkpoint/commit/revert pattern (Issue #P3-381 fix)
							// Both setStateRoot AND loadState must succeed together. If either fails, the state
							// is rolled back to prevent inconsistency where stateRoot is updated but account data isn't.
							// We must call BOTH operations to ensure full state restoration - setStateRoot alone may not
							// be sufficient if state manager's storage has been flushed or in fork mode. (Issue #220 fix)
							yield* stateMgr.checkpoint()
							yield* Effect.all([
								stateMgr.setStateRoot(hexToBytes(snapshot.stateRoot)),
								stateMgr.loadState(snapshot.state),
							]).pipe(
								Effect.flatMap(() => stateMgr.commit()),
								Effect.catchAllDefect((defect) =>
									// Rollback on defect before re-throwing typed error
									stateMgr.revert().pipe(
										Effect.catchAll(() => Effect.void), // Ignore revert errors
										Effect.flatMap(() =>
											Effect.fail(
												new StateRootNotFoundError({
													stateRoot: snapshot.stateRoot,
													message: `Failed to restore state: ${defect instanceof Error ? defect.message : String(defect)}`,
													cause: defect,
												}),
											),
										),
									),
								),
								Effect.catchAll((error) =>
									// Rollback on typed error before re-throwing
									stateMgr.revert().pipe(
										Effect.catchAll(() => Effect.void), // Ignore revert errors
										Effect.flatMap(() => Effect.fail(error)),
									),
								),
							)

							// Step 5: ONLY after setStateRoot succeeds, delete the snapshot and subsequent ones
							// This ensures we don't lose snapshots on setStateRoot failure
							yield* Ref.update(snapsRef, (map) => {
								const newMap = new Map(map)
								for (const [key] of newMap) {
									const keyNum = parseInt(key.slice(2), 16)
									// Add NaN check to prevent corrupted entries from being retained (Issue #293 fix)
									// If key contains invalid hex, delete it to prevent memory leak
									if (Number.isNaN(keyNum) || keyNum >= targetNum) {
										newMap.delete(key)
									}
								}
								return newMap
							})
						}),

					getSnapshot: (/** @type {Hex} */ id) => Ref.get(snapsRef).pipe(Effect.map((m) => m.get(id))),

					getAllSnapshots: Ref.get(snapsRef),

					/**
					 * Create a deep copy of the snapshot state.
					 *
					 * IMPORTANT: You must pass the new stateManager if the parent's stateManager was also
					 * deep-copied, otherwise snapshots will operate on the original stateManager. (Issue #234 fix)
					 *
					 * @param {import('@tevm/state-effect').StateManagerShape} [newStateManager] - Optional new state manager to use for the copy
					 * @returns {import('effect').Effect.Effect<SnapshotShape>}
					 */
					deepCopy: (newStateManager) =>
						Effect.gen(function* () {
							// Read current values atomically using Effect.all to get consistent snapshot (Issue #296 fix)
							// This prevents reading values at different points in time if other fibers modify them
							const { snapshots, counter } = yield* Effect.all({
								snapshots: Ref.get(snapsRef),
								counter: Ref.get(ctrRef),
							})

							// Deep copy the snapshots Map by copying each snapshot and its state
							/** @type {Map<Hex, Snapshot>} */
							const newSnapshots = new Map()
							for (const [id, snapshot] of snapshots) {
								// Deep copy the state object (TevmState = { [address]: AccountStorage })
								/** @type {Record<string, any>} */
								const newState = {}
								for (const [address, accountStorage] of Object.entries(snapshot.state)) {
									// Deep copy AccountStorage with bigint values preserved
									newState[address] = {
										nonce: accountStorage.nonce,
										balance: accountStorage.balance,
										storageRoot: accountStorage.storageRoot,
										codeHash: accountStorage.codeHash,
										...(accountStorage.deployedBytecode && { deployedBytecode: accountStorage.deployedBytecode }),
										// Deep copy storage if present (StorageDump is { [slot]: value })
										...(accountStorage.storage && {
											storage: { ...accountStorage.storage },
										}),
									}
								}
								// Create new Snapshot with copied state
								newSnapshots.set(id, {
									stateRoot: snapshot.stateRoot,
									state: newState,
								})
							}

							// Create new Refs with deeply copied values
							const newSnapshotsRef = yield* Ref.make(newSnapshots)
							const newCounterRef = yield* Ref.make(counter)

							// Return new shape using the new stateManager if provided, otherwise use current one (Issue #234 fix)
							return createShape(newSnapshotsRef, newCounterRef, newStateManager ?? stateMgr)
						}),
				}
				return shape
			}

			return createShape(snapshotsRef, counterRef, stateManager)
		}),
	)
}
