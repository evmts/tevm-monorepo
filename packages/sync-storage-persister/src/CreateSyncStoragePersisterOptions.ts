import type { Storage } from './Storage.js'
import { type SerializableTevmState } from '@tevm/state'
// Adapted from tanstack query
/**
 * Options for creating a sync storage persister.
 */
export type CreateSyncStoragePersisterOptions = {
	/** The storage client used for setting and retrieving items from cache.
	 * For SSR pass in `undefined`. Note that window.localStorage can be
	 * `null` in Android WebViews depending on how they are configured.
	 */
	storage: Storage
	/** The key to use when storing the cache */
	key?: string
	/** To avoid spamming, pass a time in ms to throttle saving the cache to disk */
	throttleTime?: number
	/**
	 * How to serialize the data to storage.
	 * @default `JSON.stringify`
	 */
	serialize?: (client: SerializableTevmState) => string
	/**
	 * How to deserialize the data from storage.
	 * @default `JSON.parse`
	 */
	deserialize?: (cachedString: string) => SerializableTevmState
	// retry?: PersistRetryer
}
