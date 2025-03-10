import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'
import { ContractCache } from '../ContractCache.js'
import { createBaseState } from '../createBaseState.js'

/**
 * Returns a new instance of the ForkStateManager with the same opts but no storage copied over.
 *
 * IMPORTANT: The fork cache is NOT copied but instead is shared between the original state
 * and the copied state. This is intentional and safe because:
 * 1. Fork cache is read-only relative to the forked blockchain state at a specific block
 * 2. Sharing the cache improves performance by preventing duplicate remote fetches
 * 3. It enables persistent caching of fork data across VM instances
 *
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {() => import('../BaseState.js').BaseState}
 */
export const shallowCopy = (baseState) => () => {
	const newState = createBaseState(baseState.options)
	newState.caches.contracts = new ContractCache()
	newState.caches.storage = new StorageCache({
		size: 100000,
		type: CacheType.LRU,
	})
	newState.caches.accounts = new AccountCache({
		size: 100000,
		type: CacheType.LRU,
	})

	// Share the fork cache object between instances rather than creating a new one
	// This is safe because the fork cache is conceptually read-only
	// relative to the forked blockchain at a specific block
	if (baseState.forkCache) {
		// Directly assign the same fork cache object
		newState.forkCache = baseState.forkCache
		baseState.logger.debug('Sharing fork cache reference between original and shallow copied state')
	}

	return newState
}
