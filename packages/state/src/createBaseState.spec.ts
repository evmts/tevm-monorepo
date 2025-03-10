import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'
import { InternalError } from '@tevm/errors'
import { describe, expect, it } from 'vitest'
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

	it('should throw when setting a non-existent state root', () => {
		const baseState = createBaseState({})
		const nonExistentRoot = '0x1234567890123456789012345678901234567890123456789012345678901234'

		// Verify that the root doesn't exist in stateRoots map
		expect(baseState.stateRoots.has(nonExistentRoot)).toBe(false)

		// Attempt to set the non-existent root should throw
		expect(() => {
			baseState.setCurrentStateRoot(nonExistentRoot)
		}).toThrow(InternalError)

		// Verify error message
		try {
			baseState.setCurrentStateRoot(nonExistentRoot)
		} catch (e: any) {
			expect(e.message).toContain('Cannot set state root to non existing state root')
		}
	})
})
