import { createAddress } from '@tevm/address'
import { transports } from '@tevm/test-utils'
import { EthjsAccount, EthjsAddress, createAccount, createAddressFromString } from '@tevm/utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import * as getAccountFromProviderModule from './getAccountFromProvider.js'
import { putAccount } from './putAccount.js'

afterEach(() => {
	vi.restoreAllMocks()
})

describe(getAccount.name, () => {
	it('Should get an account', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})

		const address = createAddressFromString(`0x${'01'.repeat(20)}`)
		const balance = 420n
		const nonce = 2n
		const account = createAccount({
			balance,
			nonce,
		})

		await putAccount(baseState)(address, account)

		expect(await getAccount(baseState)(address)).toEqual(account)
	})
})

describe(`${getAccount.name} forking`, () => {
	let baseState: ReturnType<typeof createBaseState>
	let address: EthjsAddress
	let account: EthjsAccount

	const knownAccount = createAddress('0x9430801EBAf509Ad49202aaBC5F5Bc6fd8A3dAf8')

	beforeEach(() => {
		baseState = createBaseState({
			loggingLevel: 'warn',
			fork: {
				transport: transports.optimism,
				blockTag: 122486679n,
			},
		})

		address = createAddress(`0x${'01'.repeat(20)}`)
		account = createAccount({
			balance: 420n,
			nonce: 2n,
		})
	})

	it('Should get an account', async () => {
		await putAccount(baseState)(address, account)
		expect(await getAccount(baseState)(address)).toEqual(account)
	})

	it('Should return undefined if account is not in cache and no fork transport', async () => {
		expect(await getAccount(createBaseState({}))(address)).toBeUndefined()
	})

	it('Should return undefined if skipFetchingFromFork is true and account is not in cache', async () => {
		expect(await getAccount(baseState, true)(knownAccount)).toBeUndefined()
	})

	it('Should fetch account from remote provider if not in cache and fork transport is provided', async () => {
		const result = await getAccount(baseState)(knownAccount)
		expect(result).toBeDefined()
		expect(result).toMatchSnapshot()
		const cachedResult = await getAccount(baseState)(knownAccount)
		expect(cachedResult).toEqual(result as any)
		// test that it indead is cached and we didn't fetch twice
		expect(await getAccount(baseState)(knownAccount)).toMatchSnapshot()
	})

	it('Should store fetched account in both main and fork caches', async () => {
		await getAccount(baseState)(knownAccount)

		// Check if account is in main cache
		expect(baseState.caches.accounts.get(knownAccount)).toBeDefined()

		// Check if account is in fork cache
		expect(baseState.forkCache.accounts.get(knownAccount)).toBeDefined()

		// Check the account values
		const mainCacheAccount = baseState.caches.accounts.get(knownAccount)
		const forkCacheAccount = baseState.forkCache.accounts.get(knownAccount)
		expect(mainCacheAccount).toEqual(forkCacheAccount)
	})

	it('Should check fork cache if account not found in main cache', async () => {
		// First fetch to populate both caches
		const result = await getAccount(baseState)(knownAccount)

		// Store fork cache entry
		const forkCacheEntry = baseState.forkCache.accounts.get(knownAccount)

		// Clear main cache but keep fork cache
		baseState.caches.accounts.clear()

		// Verify main cache is empty
		expect(baseState.caches.accounts.get(knownAccount)).toBeUndefined()

		// Verify fork cache still has the account
		expect(baseState.forkCache.accounts.get(knownAccount)).toEqual(forkCacheEntry)

		// Now fetch again - should get from fork cache and populate main cache
		const newResult = await getAccount(baseState)(knownAccount)

		// Should get same result as before
		expect(newResult?.nonce).toEqual(result?.nonce)
		expect(newResult?.balance).toEqual(result?.balance)

		// Main cache should now have the account again
		expect(baseState.caches.accounts.get(knownAccount)).toBeDefined()
	})

	it('Should handle empty accounts from fork cache', async () => {
		// Create an address that doesn't exist
		const emptyAddress = createAddress('0x0000000000000000000000000000000000000000')

		// First put an empty account in fork cache directly
		baseState.forkCache.accounts.put(emptyAddress, undefined)

		// Verify it's undefined in fork cache
		expect(baseState.forkCache.accounts.get(emptyAddress)).toEqual({ accountRLP: undefined })

		// Now fetch - should get undefined from fork cache and put in main cache
		const result = await getAccount(baseState)(emptyAddress)

		// Should be undefined
		expect(result).toBeUndefined()

		// Main cache should now have undefined for this address
		expect(baseState.caches.accounts.get(emptyAddress)).toBeDefined()
		expect(baseState.caches.accounts.get(emptyAddress)?.accountRLP).toBeUndefined()
	})

	it('Should handle empty accounts from remote provider', async () => {
		// Create an address for testing
		const testAddress = createAddress('0x1234567890123456789012345678901234567890')

		// Mock the getAccountFromProvider to return an empty account
		const mockEmptyAccount = createAccount({
			balance: 0n,
			nonce: 0n,
			codeHash: new Uint8Array(32).fill(0),
			storageRoot: new Uint8Array(32).fill(0),
		})

		const mockGetAccountFromProvider = vi.spyOn(getAccountFromProviderModule, 'getAccountFromProvider')
		mockGetAccountFromProvider.mockImplementation(() => async () => mockEmptyAccount)

		// Make sure both caches are empty
		baseState.caches.accounts.clear()
		baseState.forkCache.accounts.clear()

		// Call getAccount - should fetch from provider and recognize as empty
		const result = await getAccount(baseState)(testAddress)

		// Verify provider was called
		expect(mockGetAccountFromProvider).toHaveBeenCalledTimes(1)

		// Should return undefined for an empty account
		expect(result).toBeUndefined()

		// Both caches should have undefined stored for this address
		expect(baseState.caches.accounts.get(testAddress)?.accountRLP).toBeUndefined()
		expect(baseState.forkCache.accounts.get(testAddress)?.accountRLP).toBeUndefined()
	})
})
