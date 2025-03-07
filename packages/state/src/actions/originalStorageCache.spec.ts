import { createAddress } from '@tevm/address'
import { bytesToUnprefixedHex } from '@tevm/utils'
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
		const value = new Uint8Array([1, 2, 3, 4])

		// Store the value in the state (manually to avoid dependencies)
		const addressHex = bytesToUnprefixedHex(address.bytes)
		const keyHex = bytesToUnprefixedHex(key)

		const addressMap = new Map()
		addressMap.set(keyHex, value)
		baseState.stateManager._trie._db.put(addressHex, addressMap)

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
