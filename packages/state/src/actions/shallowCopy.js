import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'
import { ContractCache } from '../ContractCache.js'
import { createBaseState } from '../createBaseState.js'

/**
 * Returns a new instance of the ForkStateManager with the same opts but no storage copied over
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
	return newState
}
