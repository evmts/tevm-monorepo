import { throttle } from './throttle.js'

/**
 * Creates a syncronous storage persister to be used in tevm clients
 * @param {import('./CreateSyncStoragePersisterOptions.js').CreateSyncStoragePersisterOptions} options
 * @returns {import('./SyncStoragePersister.js').SyncStoragePersister}
 */
export const createSyncStoragePersister = ({
	storage,
	key = 'REACT_QUERY_OFFLINE_CACHE',
	throttleTime = 1000,
	serialize = JSON.stringify,
	deserialize = JSON.parse,
}) => {
	/**
	 * @param {import('@tevm/state').SerializableTevmState} state
	 * @returns {Error | undefined}
	 */
	const trySave = (state) => {
		try {
			const serializedState = serialize(state)
			storage.setItem(key, serializedState)
			if (storage.getItem(key) !== serializedState) {
				throw new Error(
					'Detected a failure to save state. There appears to be a problem with the provided state persister',
				)
			}
			return undefined
		} catch (error) {
			return /** @type {Error}*/ (error)
		}
	}
	return {
		persistTevmState: throttle((persistedState) => {
			if (!persistedState) {
				return
			}
			// TODO make this configurable
			const retries = 3
			let error = trySave(persistedState)
			let errorCount = 0
			while (error && errorCount < retries) {
				errorCount++
				error = trySave(persistedState)
			}
			return error
		}, throttleTime),
		restoreState: () => {
			const cacheString = storage.getItem(key)
			if (!cacheString) {
				return
			}
			return deserialize(cacheString)
		},
		removePersistedState: () => {
			try {
				storage.removeItem(key)
				return undefined
			} catch (e) {
				return e
			}
		},
	}
}
