import { createAddress } from '@tevm/address'
import { createAccount, createAddressFromString, EthjsAccount, EthjsAddress, hexToBytes } from '@tevm/utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import * as getAccountFromProviderModule from './getAccountFromProvider.js'
import { putAccount } from './putAccount.js'

const mockBlock = {
	hash: `0x${'11'.repeat(32)}`,
	parentHash: `0x${'00'.repeat(32)}`,
	sha3Uncles: `0x${'00'.repeat(32)}`,
	miner: `0x${'00'.repeat(20)}`,
	stateRoot: `0x${'00'.repeat(32)}`,
	transactionsRoot: `0x${'00'.repeat(32)}`,
	receiptsRoot: `0x${'00'.repeat(32)}`,
	logsBloom: `0x${'00'.repeat(256)}`,
	difficulty: '0x0',
	number: '0x1',
	gasLimit: '0x1',
	gasUsed: '0x0',
	timestamp: '0x1',
	extraData: '0x',
	mixHash: `0x${'00'.repeat(32)}`,
	nonce: '0x0000000000000000',
	transactions: [],
	uncles: [],
}
const mockProof = {
	address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
	accountProof: [],
	balance: '0x1a4',
	codeHash: `0x${'00'.repeat(32)}`,
	nonce: '0x2',
	storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	storageProof: [],
}
const emptyCodeHash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
const emptyStorageRoot = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
const createMockForkTransport = () => ({
	request: vi.fn(async ({ method }: { method: string }) => {
		if (method === 'eth_getBlockByNumber') {
			return mockBlock
		}
		if (method === 'eth_getProof') {
			return mockProof
		}
		throw new Error(`Unexpected RPC method: ${method}`)
	}),
})

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

	const knownAccount = createAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')

	beforeEach(async () => {
		baseState = createBaseState({
			loggingLevel: 'warn',
			fork: {
				transport: createMockForkTransport(),
				blockTag: 1n,
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
		const cachedResult = await getAccount(baseState)(knownAccount)
		expect(cachedResult).toEqual(result)
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
			codeHash: hexToBytes(emptyCodeHash),
			storageRoot: hexToBytes(emptyStorageRoot),
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
