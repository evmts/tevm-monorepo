import { describe, expect, it } from 'bun:test'
import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'
import { ContractCache } from './ContractCache.js'
import { createBaseState } from './createBaseState.js'

describe(createBaseState.name, () => {
	it('should be able to pass in custom caches', () => {
		const contractCache = new ContractCache(new StorageCache({ size: 100, type: CacheType.LRU }))
		const storageCache = new StorageCache({ size: 100, type: CacheType.LRU })
		const accountsCache = new AccountCache({ size: 100, type: CacheType.LRU })
		const state = createBaseState({
			contractCache,
			storageCache,
			accountsCache,
		})
		expect(state.caches.storage).toBe(storageCache)
		expect(state.caches.contracts).toBe(contractCache)
		expect(state.caches.accounts).toBe(accountsCache)
	})
})
