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

	it('should initialize with genesis state', async () => {
		// This test covers the branch when options.genesisState is provided
		const genesisState = {
			'0x1234567890123456789012345678901234567890': {
				balance: 100n,
				nonce: 0n,
				storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				storage: {},
			},
		}

		// Create base state with genesis state
		const baseState = createBaseState({
			genesisState: genesisState as any,
		})

		// Wait for initialization to complete
		await baseState.ready()

		// Verify the genesis state was applied
		expect(baseState.stateRoots.size).toBeGreaterThan(0)
	})

	it('should initialize with current state root', async () => {
		// This test covers the branch when options.currentStateRoot is provided
		// First create a state with some data
		const baseState1 = createBaseState({})
		await baseState1.ready()

		// Get the current state root
		const stateRoot = baseState1.getCurrentStateRoot()

		// Now create a new state using that state root
		const baseState2 = createBaseState({
			currentStateRoot: stateRoot,
		})

		// Wait for initialization
		await baseState2.ready()

		// Verify the current state root was set
		expect(baseState2.getCurrentStateRoot()).toBe(stateRoot)
	})
})
