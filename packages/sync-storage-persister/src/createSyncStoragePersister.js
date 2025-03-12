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
		/**
		 * @param {import('@tevm/state').SerializableTevmState | undefined} persistedState
		 * @param {(error: Error | undefined) => void} [onError]
		 * @returns {Error | undefined}
		 */
		persistTevmState: throttle((persistedState, onError) => {
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
			if (onError && error) {
				onError(error)
			}
			return error
		}, throttleTime),
		/**
		 * @returns {import('@tevm/state').SerializableTevmState | undefined}
		 */
		restoreState: () => {
			const cacheString = storage.getItem(key)
			if (!cacheString) {
				return
			}
			return deserialize(cacheString)
		},
		/**
		 * @returns {Error | undefined}
		 */
		removePersistedState: () => {
			try {
				storage.removeItem(key)
				return undefined
			} catch (e) {
				return /** @type {Error} */ (e)
			}
		},
	}
}
