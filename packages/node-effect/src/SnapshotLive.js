import { Effect, Layer, Ref } from 'effect'
import { SnapshotNotFoundError } from '@tevm/errors-effect'
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
 * Converts a hex string to a Uint8Array.
 * Assumes hex string starts with '0x' prefix (as per Hex type definition).
 * @param {Hex} hex - The hex string to convert (must start with '0x')
 * @returns {Uint8Array} The bytes
 */
const hexToBytes = (hex) => {
	const str = hex.slice(2) // Remove '0x' prefix
	const bytes = new Uint8Array(str.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(str.slice(i * 2, i * 2 + 2), 16)
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
 * @returns {Layer.Layer<SnapshotService, never, StateManagerService>} Layer providing SnapshotService
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
			 * @returns {SnapshotShape}
			 */
			const createShape = (snapsRef, ctrRef) => {
				/** @type {SnapshotShape} */
				const shape = {
					takeSnapshot: () =>
						Effect.gen(function* () {
							// Generate unique ID
							const id = yield* Ref.getAndUpdate(ctrRef, (n) => n + 1)
							const hexId = toHex(id)

							// Get current state
							const stateRoot = yield* stateManager.getStateRoot()
							const state = yield* stateManager.dumpState()

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
						}),

					revertToSnapshot: (id) =>
						Effect.gen(function* () {
							// Atomically get snapshot and remove it along with all subsequent snapshots
							// Using Ref.modify to avoid TOCTOU race condition
							const targetNum = parseInt(id.slice(2), 16)

							/** @type {Snapshot | undefined} */
							const snapshot = yield* Ref.modify(snapsRef, (map) => {
								const foundSnapshot = map.get(id)
								if (!foundSnapshot) {
									// Return undefined and keep map unchanged
									return [undefined, map]
								}
								// Remove this snapshot and all subsequent ones
								const newMap = new Map(map)
								for (const [key] of newMap) {
									if (parseInt(key.slice(2), 16) >= targetNum) {
										newMap.delete(key)
									}
								}
								return [foundSnapshot, newMap]
							})

							// Check if snapshot was found
							if (!snapshot) {
								return yield* Effect.fail(
									new SnapshotNotFoundError({
										snapshotId: id,
										message: `Snapshot with id ${id} not found`,
									}),
								)
							}

							// Restore state (snapshot data is immutable so this is safe after the atomic read)
							yield* stateManager.setStateRoot(hexToBytes(snapshot.stateRoot))
						}),

					getSnapshot: (id) => Ref.get(snapsRef).pipe(Effect.map((m) => m.get(id))),

					getAllSnapshots: Ref.get(snapsRef),

					deepCopy: () =>
						Effect.gen(function* () {
							// Read current values
							const snapshots = yield* Ref.get(snapsRef)
							const counter = yield* Ref.get(ctrRef)

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

							// Return new shape
							return createShape(newSnapshotsRef, newCounterRef)
						}),
				}
				return shape
			}

			return createShape(snapshotsRef, counterRef)
		}),
	)
}
