import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'
import { ContractCache } from '../ContractCache.js'
import { createBaseState } from '../createBaseState.js'

/**
 * Returns a new instance of the ForkStateManager with the same opts and all storage copied over
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {() => import('../BaseState.js').BaseState}
 */
export const shallowCopy = (baseState) => () => {
	const newState = createBaseState(baseState._options)
	newState._caches.contracts = new ContractCache()
	newState._caches.storage = new StorageCache({
		size: 100000,
		type: CacheType.ORDERED_MAP,
	})
	newState._caches.accounts = new AccountCache({
		size: 100000,
		type: CacheType.ORDERED_MAP,
	})
	return newState
}
