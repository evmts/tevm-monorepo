import { describe, it, expect } from 'vitest'
import { Effect, Layer, Exit } from 'effect'
import { SnapshotService } from './SnapshotService.js'
import { SnapshotLive } from './SnapshotLive.js'
import { StateManagerService } from '@tevm/state-effect'
import { SnapshotNotFoundError, StateRootNotFoundError } from '@tevm/errors-effect'

/**
 * Create a mock StateManagerService that fails on dumpState for testing the revert branch.
 * Used to verify that checkpoint is reverted when takeSnapshot fails.
 */
const createFailingStateManagerLayer = () => {
	let checkpointCalled = false
	let commitCalled = false
	let revertCalled = false

	return {
		layer: Layer.succeed(
			StateManagerService,
			{
				stateManager: null as unknown,
				getStateRoot: () => Effect.sync(() => new Uint8Array(32)),
				setStateRoot: () => Effect.sync(() => undefined),
				dumpState: () => Effect.fail(new Error('Simulated dumpState failure')),
				loadState: () => Effect.sync(() => undefined),
				getAccount: () => Effect.sync(() => undefined),
				putAccount: () => Effect.sync(() => undefined),
				deleteAccount: () => Effect.sync(() => undefined),
				getStorage: () => Effect.sync(() => new Uint8Array()),
				putStorage: () => Effect.sync(() => undefined),
				clearStorage: () => Effect.sync(() => undefined),
				getCode: () => Effect.sync(() => new Uint8Array()),
				putCode: () => Effect.sync(() => undefined),
				checkpoint: () => Effect.sync(() => { checkpointCalled = true }),
				commit: () => Effect.sync(() => { commitCalled = true }),
				revert: () => Effect.sync(() => { revertCalled = true }),
				ready: Effect.sync(() => undefined),
				deepCopy: () => Effect.die(new Error('Not implemented')),
				shallowCopy: () => { throw new Error('Not implemented') },
			} as unknown as import('@tevm/state-effect').StateManagerShape,
		),
		getCheckpointCalled: () => checkpointCalled,
		getCommitCalled: () => commitCalled,
		getRevertCalled: () => revertCalled,
	}
}

/**
 * Create a mock StateManagerService that causes a defect (thrown error) during snapshot.
 * This is used to test the catchAllDefect handler in SnapshotLive.takeSnapshot.
 */
const createDefectStateManagerLayer = () => {
	return Layer.succeed(
		StateManagerService,
		{
			stateManager: null as unknown,
			// getStateRoot throws synchronously inside Effect.sync, which becomes a defect
			getStateRoot: () => Effect.sync(() => { throw new Error('Simulated defect in getStateRoot') }),
			setStateRoot: () => Effect.sync(() => undefined),
			dumpState: () => Effect.sync(() => ({})),
			loadState: () => Effect.sync(() => undefined),
			getAccount: () => Effect.sync(() => undefined),
			putAccount: () => Effect.sync(() => undefined),
			deleteAccount: () => Effect.sync(() => undefined),
			getStorage: () => Effect.sync(() => new Uint8Array()),
			putStorage: () => Effect.sync(() => undefined),
			clearStorage: () => Effect.sync(() => undefined),
			getCode: () => Effect.sync(() => new Uint8Array()),
			putCode: () => Effect.sync(() => undefined),
			checkpoint: () => Effect.sync(() => undefined),
			commit: () => Effect.sync(() => undefined),
			revert: () => Effect.sync(() => undefined),
			ready: Effect.sync(() => undefined),
			deepCopy: () => Effect.die(new Error('Not implemented')),
			shallowCopy: () => { throw new Error('Not implemented') },
		} as unknown as import('@tevm/state-effect').StateManagerShape,
	)
}

/**
 * Create a mock StateManagerService that fails on commit() for testing Issue #53.
 * Used to verify that checkpoint is reverted when commit fails in takeSnapshot.
 */
const createCommitFailingStateManagerLayer = () => {
	let checkpointCalled = false
	let revertCalled = false

	return {
		layer: Layer.succeed(
			StateManagerService,
			{
				stateManager: null as unknown,
				getStateRoot: () => Effect.sync(() => new Uint8Array(32)),
				setStateRoot: () => Effect.sync(() => undefined),
				dumpState: () => Effect.sync(() => ({})),
				loadState: () => Effect.sync(() => undefined),
				getAccount: () => Effect.sync(() => undefined),
				putAccount: () => Effect.sync(() => undefined),
				deleteAccount: () => Effect.sync(() => undefined),
				getStorage: () => Effect.sync(() => new Uint8Array()),
				putStorage: () => Effect.sync(() => undefined),
				clearStorage: () => Effect.sync(() => undefined),
				getCode: () => Effect.sync(() => new Uint8Array()),
				putCode: () => Effect.sync(() => undefined),
				checkpoint: () => Effect.sync(() => { checkpointCalled = true }),
				commit: () => Effect.fail(new Error('Simulated commit failure')),
				revert: () => Effect.sync(() => { revertCalled = true }),
				ready: Effect.sync(() => undefined),
				deepCopy: () => Effect.die(new Error('Not implemented')),
				shallowCopy: () => { throw new Error('Not implemented') },
			} as unknown as import('@tevm/state-effect').StateManagerShape,
		),
		getCheckpointCalled: () => checkpointCalled,
		getRevertCalled: () => revertCalled,
	}
}

/**
 * Create a mock StateManagerService that causes a non-Error defect (string) during snapshot.
 * This is used to test the catchAllDefect handler branch for non-Error defects.
 */
const createNonErrorDefectStateManagerLayer = () => {
	return Layer.succeed(
		StateManagerService,
		{
			stateManager: null as unknown,
			// getStateRoot throws a string (non-Error) synchronously inside Effect.sync, which becomes a defect
			getStateRoot: () => Effect.sync(() => { throw 'Non-Error defect string' }),
			setStateRoot: () => Effect.sync(() => undefined),
			dumpState: () => Effect.sync(() => ({})),
			loadState: () => Effect.sync(() => undefined),
			getAccount: () => Effect.sync(() => undefined),
			putAccount: () => Effect.sync(() => undefined),
			deleteAccount: () => Effect.sync(() => undefined),
			getStorage: () => Effect.sync(() => new Uint8Array()),
			putStorage: () => Effect.sync(() => undefined),
			clearStorage: () => Effect.sync(() => undefined),
			getCode: () => Effect.sync(() => new Uint8Array()),
			putCode: () => Effect.sync(() => undefined),
			checkpoint: () => Effect.sync(() => undefined),
			commit: () => Effect.sync(() => undefined),
			revert: () => Effect.sync(() => undefined),
			ready: Effect.sync(() => undefined),
			deepCopy: () => Effect.die(new Error('Not implemented')),
			shallowCopy: () => { throw new Error('Not implemented') },
		} as unknown as import('@tevm/state-effect').StateManagerShape,
	)
}

/**
 * Create a mock StateManagerService that fails on setStateRoot for testing revertToSnapshot.
 * Used to verify that StateRootNotFoundError is returned when setStateRoot throws a defect.
 */
const createSetStateRootDefectLayer = () => {
	let currentStateRoot = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
	let stateVersion = 0

	return Layer.succeed(
		StateManagerService,
		{
			stateManager: null as unknown,
			getStateRoot: () => Effect.sync(() => currentStateRoot),
			// setStateRoot throws synchronously inside Effect.sync, which becomes a defect
			setStateRoot: () => Effect.sync(() => { throw new Error('Simulated setStateRoot failure') }),
			dumpState: () => Effect.sync(() => {
				stateVersion++
				return { version: stateVersion }
			}),
			loadState: () => Effect.sync(() => undefined),
			getAccount: () => Effect.sync(() => undefined),
			putAccount: () => Effect.sync(() => undefined),
			deleteAccount: () => Effect.sync(() => undefined),
			getStorage: () => Effect.sync(() => new Uint8Array()),
			putStorage: () => Effect.sync(() => undefined),
			clearStorage: () => Effect.sync(() => undefined),
			getCode: () => Effect.sync(() => new Uint8Array()),
			putCode: () => Effect.sync(() => undefined),
			checkpoint: () => Effect.sync(() => undefined),
			commit: () => Effect.sync(() => undefined),
			revert: () => Effect.sync(() => undefined),
			ready: Effect.sync(() => undefined),
			deepCopy: () => Effect.die(new Error('Not implemented')),
			shallowCopy: () => { throw new Error('Not implemented') },
		} as unknown as import('@tevm/state-effect').StateManagerShape,
	)
}

/**
 * Create a mock StateManagerService that fails on setStateRoot with a non-Error defect.
 * Used to test the non-Error branch of the catchAllDefect handler in revertToSnapshot.
 */
const createSetStateRootNonErrorDefectLayer = () => {
	let currentStateRoot = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
	let stateVersion = 0

	return Layer.succeed(
		StateManagerService,
		{
			stateManager: null as unknown,
			getStateRoot: () => Effect.sync(() => currentStateRoot),
			// setStateRoot throws a string (non-Error) synchronously inside Effect.sync, which becomes a defect
			setStateRoot: () => Effect.sync(() => { throw 'Non-Error setStateRoot failure' }),
			dumpState: () => Effect.sync(() => {
				stateVersion++
				return { version: stateVersion }
			}),
			loadState: () => Effect.sync(() => undefined),
			getAccount: () => Effect.sync(() => undefined),
			putAccount: () => Effect.sync(() => undefined),
			deleteAccount: () => Effect.sync(() => undefined),
			getStorage: () => Effect.sync(() => new Uint8Array()),
			putStorage: () => Effect.sync(() => undefined),
			clearStorage: () => Effect.sync(() => undefined),
			getCode: () => Effect.sync(() => new Uint8Array()),
			putCode: () => Effect.sync(() => undefined),
			checkpoint: () => Effect.sync(() => undefined),
			commit: () => Effect.sync(() => undefined),
			revert: () => Effect.sync(() => undefined),
			ready: Effect.sync(() => undefined),
			deepCopy: () => Effect.die(new Error('Not implemented')),
			shallowCopy: () => { throw new Error('Not implemented') },
		} as unknown as import('@tevm/state-effect').StateManagerShape,
	)
}

/**
 * Create a mock StateManagerService for testing.
 * This simulates state management behavior without real EVM state.
 */
const createMockStateManagerLayer = (withStorage = false) => {
	let currentStateRoot = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
	let stateVersion = 0

	return Layer.succeed(
		StateManagerService,
		{
			stateManager: null as unknown,
			getStateRoot: () => Effect.sync(() => currentStateRoot),
			setStateRoot: (root: Uint8Array) => Effect.sync(() => {
				currentStateRoot = root
			}),
			dumpState: () => Effect.sync(() => {
				stateVersion++
				// Return proper TevmState structure with AccountStorage
				if (withStorage) {
					return {
						'0x1234567890123456789012345678901234567890': {
							nonce: 1n,
							balance: 1000000000000000000n,
							storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as `0x${string}`,
							codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' as `0x${string}`,
							deployedBytecode: '0x6080604052' as `0x${string}`,
							storage: {
								'0x0000000000000000000000000000000000000000000000000000000000000001': '0x0000000000000000000000000000000000000000000000000000000000000042'
							}
						}
					}
				}
				return { version: stateVersion }
			}),
			loadState: () => Effect.sync(() => undefined),
			getAccount: () => Effect.sync(() => undefined),
			putAccount: () => Effect.sync(() => undefined),
			deleteAccount: () => Effect.sync(() => undefined),
			getStorage: () => Effect.sync(() => new Uint8Array()),
			putStorage: () => Effect.sync(() => undefined),
			clearStorage: () => Effect.sync(() => undefined),
			getCode: () => Effect.sync(() => new Uint8Array()),
			putCode: () => Effect.sync(() => undefined),
			checkpoint: () => Effect.sync(() => undefined),
			commit: () => Effect.sync(() => undefined),
			revert: () => Effect.sync(() => undefined),
			ready: Effect.sync(() => undefined),
			deepCopy: () => Effect.die(new Error('Not implemented')),
			shallowCopy: () => { throw new Error('Not implemented') },
		} as unknown as import('@tevm/state-effect').StateManagerShape,
	)
}

describe('SnapshotLive', () => {
	const fullLayer = Layer.provide(SnapshotLive(), createMockStateManagerLayer())

	describe('layer creation', () => {
		it('should create a layer', () => {
			const layer = SnapshotLive()
			expect(layer).toBeDefined()
		})
	})

	describe('takeSnapshot', () => {
		it('should take a snapshot and return a hex ID', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				const id = yield* snapshot.takeSnapshot()
				return id
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('0x1')
		})

		it('should increment snapshot IDs', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				const id1 = yield* snapshot.takeSnapshot()
				const id2 = yield* snapshot.takeSnapshot()
				const id3 = yield* snapshot.takeSnapshot()
				return [id1, id2, id3]
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toEqual(['0x1', '0x2', '0x3'])
		})

		it('should revert checkpoint when dumpState fails', async () => {
			const failingMock = createFailingStateManagerLayer()
			const failingLayer = Layer.provide(SnapshotLive(), failingMock.layer)

			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				yield* snapshot.takeSnapshot()
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(failingLayer)))

			// The operation should fail
			expect(Exit.isFailure(exit)).toBe(true)

			// Checkpoint should have been called
			expect(failingMock.getCheckpointCalled()).toBe(true)

			// Commit should NOT have been called (because we failed)
			expect(failingMock.getCommitCalled()).toBe(false)

			// Revert SHOULD have been called (cleanup on failure)
			expect(failingMock.getRevertCalled()).toBe(true)
		})

		it('should convert defects to StorageError in takeSnapshot', async () => {
			const defectLayer = Layer.provide(SnapshotLive(), createDefectStateManagerLayer())

			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				yield* snapshot.takeSnapshot()
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(defectLayer)))

			// The operation should fail with a StorageError (converted from defect)
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as { _tag: string; message: string }
				expect(error._tag).toBe('StorageError')
				expect(error.message).toContain('Failed to take snapshot')
				expect(error.message).toContain('Simulated defect in getStateRoot')
			}
		})

		it('should convert non-Error defects to StorageError with String(defect)', async () => {
			const defectLayer = Layer.provide(SnapshotLive(), createNonErrorDefectStateManagerLayer())

			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				yield* snapshot.takeSnapshot()
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(defectLayer)))

			// The operation should fail with a StorageError (converted from non-Error defect)
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as { _tag: string; message: string }
				expect(error._tag).toBe('StorageError')
				expect(error.message).toContain('Failed to take snapshot')
				expect(error.message).toContain('Non-Error defect string')
			}
		})
	})

	describe('getSnapshot', () => {
		it('should return undefined for non-existent snapshot', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				return yield* snapshot.getSnapshot('0x999')
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeUndefined()
		})

		it('should return snapshot data for existing snapshot', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				const id = yield* snapshot.takeSnapshot()
				return yield* snapshot.getSnapshot(id)
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeDefined()
			expect(result?.stateRoot).toBe('0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f')
			expect(result?.state).toBeDefined()
		})
	})

	describe('getAllSnapshots', () => {
		it('should return empty map initially', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				return yield* snapshot.getAllSnapshots
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result.size).toBe(0)
		})

		it('should return all snapshots', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				yield* snapshot.takeSnapshot()
				yield* snapshot.takeSnapshot()
				yield* snapshot.takeSnapshot()
				return yield* snapshot.getAllSnapshots
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result.size).toBe(3)
			expect(result.has('0x1')).toBe(true)
			expect(result.has('0x2')).toBe(true)
			expect(result.has('0x3')).toBe(true)
		})
	})

	describe('revertToSnapshot', () => {
		it('should fail with SnapshotNotFoundError for non-existent snapshot', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				yield* snapshot.revertToSnapshot('0x999')
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(fullLayer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit)) {
				const error = exit.cause
				expect(error._tag).toBe('Fail')
			}
		})

		it('should set snapshotId property on SnapshotNotFoundError', async () => {
			const targetSnapshotId = '0x999'
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				yield* snapshot.revertToSnapshot(targetSnapshotId)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(fullLayer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as SnapshotNotFoundError
				expect(error._tag).toBe('SnapshotNotFoundError')
				expect(error.snapshotId).toBe(targetSnapshotId)
				expect(error.message).toContain(targetSnapshotId)
			}
		})

		it('should revert to existing snapshot', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				const id = yield* snapshot.takeSnapshot()
				yield* snapshot.revertToSnapshot(id)
				return 'success'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('success')
		})

		it('should delete reverted snapshot and all subsequent ones', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				yield* snapshot.takeSnapshot() // 0x1
				const id2 = yield* snapshot.takeSnapshot() // 0x2
				yield* snapshot.takeSnapshot() // 0x3

				yield* snapshot.revertToSnapshot(id2)

				const snapshots = yield* snapshot.getAllSnapshots
				return {
					size: snapshots.size,
					has1: snapshots.has('0x1'),
					has2: snapshots.has('0x2'),
					has3: snapshots.has('0x3'),
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result.size).toBe(1)
			expect(result.has1).toBe(true)
			expect(result.has2).toBe(false)
			expect(result.has3).toBe(false)
		})

		it('should handle even-length hex IDs correctly (e.g., 0x10)', async () => {
			// This test exercises the hexToBytes branch for even-length hex strings
			// IDs 0x1-0xf are odd-length (1 char), 0x10+ are even-length (2 chars)
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				// Create 16 snapshots to get to 0x10 (even-length hex)
				for (let i = 0; i < 16; i++) {
					yield* snapshot.takeSnapshot()
				}
				// Revert to 0x10 (even-length hex string)
				yield* snapshot.revertToSnapshot('0x10')
				const snapshots = yield* snapshot.getAllSnapshots
				return {
					size: snapshots.size,
					hasF: snapshots.has('0xf'),
					has10: snapshots.has('0x10'),
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			// After reverting to 0x10, snapshots 0x1-0xf should remain, 0x10 should be deleted
			expect(result.size).toBe(15)
			expect(result.hasF).toBe(true)
			expect(result.has10).toBe(false)
		})

		it('should convert setStateRoot defects to StateRootNotFoundError', async () => {
			const defectLayer = Layer.provide(SnapshotLive(), createSetStateRootDefectLayer())

			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				const id = yield* snapshot.takeSnapshot()
				// This should fail because setStateRoot throws
				yield* snapshot.revertToSnapshot(id)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(defectLayer)))

			// The operation should fail with a StateRootNotFoundError (converted from defect)
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as StateRootNotFoundError
				expect(error._tag).toBe('StateRootNotFoundError')
				expect(error.message).toContain('Failed to restore state root')
				expect(error.message).toContain('Simulated setStateRoot failure')
				// Verify the stateRoot from the snapshot is included
				expect(error.stateRoot).toBeDefined()
			}
		})

		it('should convert non-Error setStateRoot defects to StateRootNotFoundError with String(defect)', async () => {
			const defectLayer = Layer.provide(SnapshotLive(), createSetStateRootNonErrorDefectLayer())

			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				const id = yield* snapshot.takeSnapshot()
				// This should fail because setStateRoot throws a non-Error
				yield* snapshot.revertToSnapshot(id)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(defectLayer)))

			// The operation should fail with a StateRootNotFoundError (converted from non-Error defect)
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as StateRootNotFoundError
				expect(error._tag).toBe('StateRootNotFoundError')
				expect(error.message).toContain('Failed to restore state root')
				expect(error.message).toContain('Non-Error setStateRoot failure')
			}
		})
	})

	describe('deepCopy', () => {
		it('should create an independent copy', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				yield* snapshot.takeSnapshot() // 0x1
				yield* snapshot.takeSnapshot() // 0x2

				// Create deep copy
				const copy = yield* snapshot.deepCopy()

				// Take more snapshots on original
				yield* snapshot.takeSnapshot() // 0x3

				// Check sizes are different
				const originalSnapshots = yield* snapshot.getAllSnapshots
				const copiedSnapshots = yield* copy.getAllSnapshots

				return {
					originalSize: originalSnapshots.size,
					copiedSize: copiedSnapshots.size,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result.originalSize).toBe(3)
			expect(result.copiedSize).toBe(2)
		})

		it('should preserve counter state', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				yield* snapshot.takeSnapshot() // 0x1
				yield* snapshot.takeSnapshot() // 0x2

				// Create deep copy
				const copy = yield* snapshot.deepCopy()

				// Take snapshot on copy
				const copyId = yield* copy.takeSnapshot()

				return copyId
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('0x3')
		})

		it('should deep copy snapshot state data - not share references', async () => {
			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				const snapshotId = yield* snapshot.takeSnapshot()

				// Create deep copy
				const copy = yield* snapshot.deepCopy()

				// Get the snapshot from both original and copy
				const originalSnapshot = yield* snapshot.getSnapshot(snapshotId)
				const copiedSnapshot = yield* copy.getSnapshot(snapshotId)

				// Verify both exist
				if (!originalSnapshot || !copiedSnapshot) {
					return { hasBoth: false, stateIsSameRef: true }
				}

				// Verify the state objects are NOT the same reference
				const stateIsSameRef = originalSnapshot.state === copiedSnapshot.state

				return { hasBoth: true, stateIsSameRef }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result.hasBoth).toBe(true)
			// The key test: state should NOT be the same reference after deep copy
			expect(result.stateIsSameRef).toBe(false)
		})

		it('should deep copy AccountStorage including storage and deployedBytecode', async () => {
			// Use mock with storage to test deep copy of AccountStorage fields
			const layerWithStorage = Layer.provide(SnapshotLive(), createMockStateManagerLayer(true))

			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				const snapshotId = yield* snapshot.takeSnapshot()

				// Create deep copy
				const copy = yield* snapshot.deepCopy()

				// Get the snapshot from both
				const originalSnapshot = yield* snapshot.getSnapshot(snapshotId)
				const copiedSnapshot = yield* copy.getSnapshot(snapshotId)

				if (!originalSnapshot || !copiedSnapshot) {
					return { hasBoth: false, accountsNotSameRef: false, storageNotSameRef: false }
				}

				const address = '0x1234567890123456789012345678901234567890'
				const originalAccount = (originalSnapshot.state as Record<string, any>)[address]
				const copiedAccount = (copiedSnapshot.state as Record<string, any>)[address]

				if (!originalAccount || !copiedAccount) {
					return { hasBoth: false, accountsNotSameRef: false, storageNotSameRef: false }
				}

				// Verify account objects are different references
				const accountsNotSameRef = originalAccount !== copiedAccount
				// Verify storage objects are different references
				const storageNotSameRef = originalAccount.storage !== copiedAccount.storage

				// Verify values are preserved
				const valuesPreserved =
					copiedAccount.nonce === 1n &&
					copiedAccount.balance === 1000000000000000000n &&
					copiedAccount.deployedBytecode === '0x6080604052'

				return { hasBoth: true, accountsNotSameRef, storageNotSameRef, valuesPreserved }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layerWithStorage)))
			expect(result.hasBoth).toBe(true)
			expect(result.accountsNotSameRef).toBe(true)
			expect(result.storageNotSameRef).toBe(true)
			expect(result.valuesPreserved).toBe(true)
		})
	})

	describe('commit failure handling (Issue #53)', () => {
		it('should call revert when commit fails in takeSnapshot', async () => {
			const { layer: mockLayer, getCheckpointCalled, getRevertCalled } = createCommitFailingStateManagerLayer()
			const testLayer = Layer.provide(SnapshotLive(), mockLayer)

			const program = Effect.gen(function* () {
				const snapshot = yield* SnapshotService
				return yield* snapshot.takeSnapshot()
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			// Verify the operation failed
			expect(Exit.isFailure(result)).toBe(true)
			// Verify checkpoint was called
			expect(getCheckpointCalled()).toBe(true)
			// Verify revert was called to clean up the dangling checkpoint
			expect(getRevertCalled()).toBe(true)
		})
	})
})
