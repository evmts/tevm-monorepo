import type { SerializableTevmState } from '@tevm/state'
import { describe, expect, it, vi } from 'vitest'
import { createSyncStoragePersister } from './createSyncStoragePersister.js'
import type { Storage } from './Storage.js'

describe(createSyncStoragePersister.name, () => {
	// TODO we should test the async behavior of the throttle
	it('should persist the state', async () => {
		const map = new Map()
		const storage: Storage = {
			setItem: (item, value) => map.set(item, value),
			getItem: (item) => map.get(item),
			removeItem: (item) => map.delete(item),
		}
		const persister = createSyncStoragePersister({
			storage,
			key: 'test-key',
			deserialize: JSON.parse,
			serialize: JSON.stringify,
			throttleTime: 0,
		})
		const state: SerializableTevmState = {
			'0x420': {
				balance: '0x69',
				codeHash: '0xdeadbeef',
				nonce: '0x0',
				storageRoot: '0xdeadbeef',
				storage: {
					'0x420420': '0x42069',
				},
			},
		}
		persister.persistTevmState(state)
		// wait for the next async tick
		await new Promise((resolve) => setTimeout(resolve, 0))
		expect(map.get('test-key')).toEqual(JSON.stringify(state))
		expect(persister.restoreState()).toEqual(state)

		persister.removePersistedState()
		expect(persister.restoreState()).toBeUndefined()
	})

	it('should handle errors during saving', async () => {
		const storage: Storage = {
			setItem: vi.fn(() => {
				throw new Error('Failed to save')
			}),
			getItem: vi.fn(),
			removeItem: vi.fn(),
		}

		const persister = createSyncStoragePersister({
			storage,
			throttleTime: 0,
		})

		const state: SerializableTevmState = {
			'0x123': { balance: '0x1', nonce: '0x0', codeHash: '0x123', storageRoot: '0x456' },
		}

		let result: any
		persister.persistTevmState(state, (error: Error | undefined) => {
			result = error
		})

		await new Promise((resolve) => setTimeout(resolve, 0))

		expect(storage.setItem).toHaveBeenCalledTimes(4) // Initial + 3 retries
		expect(result).toBeInstanceOf(Error)
	})

	it('should handle undefined persistedState', async () => {
		const storage: Storage = {
			setItem: vi.fn(),
			getItem: vi.fn(),
			removeItem: vi.fn(),
		}

		const persister = createSyncStoragePersister({
			storage,
			throttleTime: 0,
		})

		const result = persister.persistTevmState(undefined)
		await new Promise((resolve) => setTimeout(resolve, 0))

		expect(storage.setItem).not.toHaveBeenCalled()
		expect(result).toBeUndefined()
	})

	it('should handle errors during removePersistedState', () => {
		const error = new Error('Failed to remove')
		const storage: Storage = {
			setItem: vi.fn(),
			getItem: vi.fn(),
			removeItem: vi.fn(() => {
				throw error
			}),
		}

		const persister = createSyncStoragePersister({
			storage,
		})

		const result = persister.removePersistedState()
		expect(storage.removeItem).toHaveBeenCalled()
		expect(result).toBe(error)
	})

	it('should handle null return from getItem during restore', () => {
		const storage: Storage = {
			setItem: vi.fn(),
			getItem: vi.fn(() => null),
			removeItem: vi.fn(),
		}

		const persister = createSyncStoragePersister({
			storage,
		})

		const result = persister.restoreState()
		expect(storage.getItem).toHaveBeenCalled()
		expect(result).toBeUndefined()
	})

	it('should handle saved state not matching during persist', async () => {
		const storage: Storage = {
			setItem: vi.fn(),
			getItem: vi.fn(() => 'different value'),
			removeItem: vi.fn(),
		}

		const persister = createSyncStoragePersister({
			storage,
			throttleTime: 0,
		})

		const state: SerializableTevmState = {
			'0x123': { balance: '0x1', nonce: '0x0', codeHash: '0x123', storageRoot: '0x456' },
		}

		let errorResult: any
		persister.persistTevmState(state, (error: Error | undefined) => {
			errorResult = error
		})
		await new Promise((resolve) => setTimeout(resolve, 0))

		expect(errorResult).toBeInstanceOf(Error)
		expect(errorResult.message).toContain('Detected a failure to save state')
	})
})
