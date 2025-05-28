import { AccountCache, CacheType } from '@ethereumjs/statemanager'
import { createAddress } from '@tevm/address'
import { createAccount } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccountAddresses } from './getAccountAddresses.js'
import { putAccount } from './putAccount.js'

describe(getAccountAddresses.name, () => {
	it('should get all account addresses', async () => {
		const state = createBaseState({})

		await putAccount(state)(createAddress(1), createAccount({ balance: 420n }))
		await putAccount(state)(createAddress(11), createAccount({ balance: 420n }))
		await putAccount(state)(createAddress(111), createAccount({ balance: 420n }))
		await putAccount(state)(createAddress(1111), createAccount({ balance: 420n }))
		await putAccount(state)(createAddress(11111), createAccount({ balance: 420n }))
		await putAccount(state)(createAddress(111111), createAccount({ balance: 420n }))

		expect(getAccountAddresses(state)()).toEqual(
			new Set([
				createAddress(11).toString(),
				createAddress(111).toString(),
				createAddress(1111).toString(),
				createAddress(11111).toString(),
				createAddress(1).toString(),
				createAddress(111111).toString(),
			]),
		)
	})

	it('works with ordered map cache', async () => {
		const state = createBaseState({
			accountsCache: new AccountCache({
				size: 200,
				type: CacheType.ORDERED_MAP,
			}),
		})

		await putAccount(state)(createAddress(1), createAccount({ balance: 420n }))
		await putAccount(state)(createAddress(11), createAccount({ balance: 420n }))
		await putAccount(state)(createAddress(111), createAccount({ balance: 420n }))
		await putAccount(state)(createAddress(1111), createAccount({ balance: 420n }))
		await putAccount(state)(createAddress(11111), createAccount({ balance: 420n }))
		await putAccount(state)(createAddress(111111), createAccount({ balance: 420n }))

		expect(getAccountAddresses(state)()).toEqual(
			new Set([
				createAddress(1).toString(),
				createAddress(11).toString(),
				createAddress(111).toString(),
				createAddress(1111).toString(),
				createAddress(11111).toString(),
				createAddress(111111).toString(),
			]),
		)
	})

	it('works with empty state', async () => {
		const state = createBaseState({})

		// No accounts added
		expect(getAccountAddresses(state)()).toEqual(new Set())
	})

	it('works with custom cache type', async () => {
		const state = createBaseState({
			accountsCache: new AccountCache({
				size: 10,
				type: CacheType.ORDERED_MAP,
			}),
		})

		await putAccount(state)(createAddress(1), createAccount({ balance: 100n }))
		await putAccount(state)(createAddress(2), createAccount({ balance: 200n }))

		expect(getAccountAddresses(state)()).toEqual(new Set([createAddress(1).toString(), createAddress(2).toString()]))
	})

	it('handles deleted accounts properly', async () => {
		const state = createBaseState({})

		// Add accounts
		await putAccount(state)(createAddress(1), createAccount({ balance: 100n }))
		await putAccount(state)(createAddress(2), createAccount({ balance: 200n }))

		// Delete one account (by setting its properties to zero)
		await putAccount(state)(
			createAddress(1),
			createAccount({
				balance: 0n,
				nonce: 0n,
				storageRoot: new Uint8Array(32),
				codeHash: new Uint8Array(32),
			}),
		)

		// Should still include both addresses
		expect(getAccountAddresses(state)()).toEqual(new Set([createAddress(1).toString(), createAddress(2).toString()]))
	})

	it('works with LRU cache and handles both prefixed and unprefixed addresses', async () => {
		const state = createBaseState({
			accountsCache: new AccountCache({ size: 10, type: CacheType.LRU }),
		})

		// Add accounts
		await putAccount(state)(createAddress(1), createAccount({ balance: 100n }))
		await putAccount(state)(createAddress(2), createAccount({ balance: 200n }))

		// Verify the _lruCache property exists
		expect(state.caches.accounts._lruCache).toBeDefined()

		// Should include all addresses
		expect(getAccountAddresses(state)()).toEqual(new Set([createAddress(1).toString(), createAddress(2).toString()]))

		// Mock the rkeys method to return one prefixed and one unprefixed address
		// This is to test both branches of the condition in line 18
		const originalRkeys = state.caches.accounts._lruCache?.rkeys
		if (state.caches.accounts._lruCache) {
			;(state as any).caches.accounts._lruCache.rkeys = () => {
				return ['0x0000000000000000000000000000000000000001', '0000000000000000000000000000000000000002']
			}
		}

		// Call getAccountAddresses again
		const addresses = getAccountAddresses(state)()

		// Should still get the same addresses, properly normalized
		expect(addresses).toEqual(
			new Set(['0x0000000000000000000000000000000000000001', '0x0000000000000000000000000000000000000002']),
		)

		// Restore the original method
		if (state.caches.accounts._lruCache && originalRkeys) {
			state.caches.accounts._lruCache.rkeys = originalRkeys
		}
	})

	it('handles both prefixed and unprefixed addresses in OrderedMap forEach', async () => {
		const state = createBaseState({
			accountsCache: new AccountCache({
				size: 10,
				type: CacheType.ORDERED_MAP,
			}),
		})

		// Add accounts
		await putAccount(state)(createAddress(1), createAccount({ balance: 100n }))
		await putAccount(state)(createAddress(2), createAccount({ balance: 200n }))

		// Verify we have an ordered map cache
		expect(state.caches.accounts._orderedMapCache).toBeDefined()

		// Mock the forEach method of _orderedMapCache to test both prefixed and unprefixed addresses
		// This tests both branches of the condition in lines 13 and 23
		const originalForEach = state.caches.accounts._orderedMapCache?.forEach

		// Mock the forEach method to inject our test values
		if (state.caches.accounts._orderedMapCache) {
			state.caches.accounts._orderedMapCache.forEach = (callback) => {
				// @ts-expect-error
				callback(['0x0000000000000000000000000000000000000003'])
				// @ts-expect-error
				callback(['0000000000000000000000000000000000000004'])
			}
		}

		// Call getAccountAddresses
		const addresses = getAccountAddresses(state)()

		// Should get both addresses properly normalized
		expect(addresses).toEqual(
			new Set(['0x0000000000000000000000000000000000000003', '0x0000000000000000000000000000000000000004']),
		)

		// Restore the original method
		if (state.caches.accounts._orderedMapCache && originalForEach) {
			state.caches.accounts._orderedMapCache.forEach = originalForEach
		}
	})
})
