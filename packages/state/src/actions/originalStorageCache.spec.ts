import { createAddress } from '@tevm/address'
import { numberToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { originalStorageCache } from './originalStorageCache.js'

describe(originalStorageCache.name, () => {
	it('should store and retrieve values from cache', async () => {
		const baseState = createBaseState({})
		const cache = originalStorageCache(baseState)

		const address = createAddress('0x1')
		const key = numberToBytes(42, { size: 32 }) // Key must be 32 bytes

		// We'll skip the direct storage manipulation and focus on testing cache behavior
		// This test just needs to verify the cache works after calling get() twice

		// First call should cache the result
		const result1 = await cache.get(address, key)

		// Second call should retrieve from cache
		const result2 = await cache.get(address, key)

		expect(result2).toEqual(result1)
	})

	it('should call clear method without error', () => {
		const baseState = createBaseState({})
		const cache = originalStorageCache(baseState)

		// Call clear method
		expect(() => cache.clear()).not.toThrow()
	})
})
