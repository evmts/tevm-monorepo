import type { Storage } from './Storage.js'
import { createSyncStoragePersister } from './createSyncStoragePersister.js'
import type { SerializableTevmState } from '@tevm/state'
import { describe, expect, it } from 'bun:test'

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
})
