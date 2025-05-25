import { createAddress } from '@tevm/address'
import { transports } from '@tevm/test-utils'
import { EthjsAccount, EthjsAddress, createAccount, createAddressFromString, hexToBytes, toBytes } from '@tevm/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BaseState } from '../BaseState.js'
import { createBaseState } from '../createBaseState.js'
import * as getAccountModule from './getAccount.js'
import { getContractStorage } from './getContractStorage.js'
import * as getForkClientModule from './getForkClient.js'
import { putAccount } from './putAccount.js'
import { putContractStorage } from './putContractStorage.js'

describe('getContractStorage', () => {
	let baseState: BaseState
	let address: EthjsAddress
	let key: Uint8Array
	let value: Uint8Array
	let account: EthjsAccount

	beforeEach(async () => {
		baseState = createBaseState({
			loggingLevel: 'warn',
		})

		address = createAddress('01'.repeat(20))
		key = hexToBytes(`0x${'02'.repeat(32)}`)
		value = hexToBytes('0x1234')
		account = createAccount({
			balance: 420n,
			nonce: 2n,
		})

		await putAccount(baseState)(address, account)
		await putContractStorage(baseState)(address, key, value)
	})

	it('should get the storage value associated with the provided address and key', async () => {
		expect(await getContractStorage(baseState)(address, key)).toEqual(value)
	})

	it('should return empty Uint8Array if the storage does not exist', async () => {
		const newKey = hexToBytes(`0x${'03'.repeat(32)}`)
		expect(await getContractStorage(baseState)(address, newKey)).toEqual(Uint8Array.from([0]))
	})

	it('should throw an error if the key is not 32 bytes long', async () => {
		const invalidKey = hexToBytes('0x1234')
		const err = await getContractStorage(baseState)(address, invalidKey).catch((e) => e)
		expect(err).toBeInstanceOf(Error)
		expect(err.message).toMatchSnapshot()
	})

	it('should return empty Uint8Array if the account is not a contract', async () => {
		const newAddress = createAddressFromString(`0x${'02'.repeat(20)}`)
		await putAccount(baseState)(newAddress, createAccount({ balance: 100n, nonce: 1n }))
		expect(await getContractStorage(baseState)(newAddress, key)).toEqual(Uint8Array.from([0]))
	})

	it('should return empty Uint8Array when contract exists but forking is disabled', async () => {
		// Create an account with code hash that would make isContract() return true
		const contractAddress = createAddressFromString(`0x${'cc'.repeat(20)}`)
		const contractAccount = createAccount({
			balance: 0n,
			nonce: 0n,
			// Non-zero code hash makes isContract() return true
			codeHash: new Uint8Array(32).fill(1),
		})

		// Put the contract account in state
		await putAccount(baseState)(contractAddress, contractAccount)

		// Verify this is treated as a contract
		expect((await getAccountModule.getAccount(baseState)(contractAddress))?.isContract()).toBe(true)

		// The state has no fork configuration
		expect(baseState.options.fork?.transport).toBeUndefined()

		// Should return empty storage since we're not in fork mode
		expect(await getContractStorage(baseState)(contractAddress, key)).toEqual(Uint8Array.from([0]))
	})
})

describe('getContractStorage forking', () => {
	let baseState: BaseState
	let knownContractAddress: EthjsAddress
	let knownStorageKey: Uint8Array

	beforeEach(() => {
		// Use a fixed block tag to ensure consistent responses
		const specificBlockTag = 110000000n

		baseState = createBaseState({
			loggingLevel: 'warn',
			fork: {
				transport: transports.optimism,
				blockTag: specificBlockTag,
			},
		})

		// Known L2StandardBridge contract on Optimism
		knownContractAddress = createAddressFromString('0x4200000000000000000000000000000000000010')
		// Storage slot 0 should have a consistent value at this block
		knownStorageKey = toBytes(0, { size: 32 })
	})

	it('should fetch storage from remote provider if not in cache and fork transport is provided', async () => {
		// First call - should fetch from remote provider
		const result = await getContractStorage(baseState)(knownContractAddress, knownStorageKey)
		expect(result).toBeDefined()

		// Verify the value using inline snapshot, let the test runner fill it in
		expect(result[0]).toMatchInlineSnapshot('0')

		// Second call - should use cache
		const cachedResult = await getContractStorage(baseState)(knownContractAddress, knownStorageKey)

		// The second result should match the first
		expect(cachedResult[0]).toMatchInlineSnapshot('0')
	})

	it('should return empty Uint8Array if the account does not exist and no fork transport', async () => {
		const noForkBaseState = createBaseState({
			loggingLevel: 'warn',
		})
		expect(await getContractStorage(noForkBaseState)(knownContractAddress, knownStorageKey)).toEqual(
			Uint8Array.from([0]),
		)
	})

	it('should store fetched storage value in both main and fork caches', async () => {
		// First call - should fetch from remote and store in both caches
		await getContractStorage(baseState)(knownContractAddress, knownStorageKey)

		// Check main cache contains a value
		expect(baseState.caches.storage.get(knownContractAddress, knownStorageKey)).toBeDefined()

		// Check fork cache contains a value
		expect(baseState.forkCache.storage.get(knownContractAddress, knownStorageKey)).toBeDefined()
	})

	it('should check fork cache if value not found in main cache', async () => {
		// First call - should fetch from remote and store in both caches
		await getContractStorage(baseState)(knownContractAddress, knownStorageKey)

		// Save fork cache value reference
		const forkCacheValue = baseState.forkCache.storage.get(knownContractAddress, knownStorageKey)
		expect(forkCacheValue).toBeDefined()

		// Clear main cache but keep fork cache
		baseState.caches.storage.clear()

		// Verify main cache is empty
		expect(baseState.caches.storage.get(knownContractAddress, knownStorageKey)).toBeUndefined()

		// Second call - should get from fork cache and populate main cache
		await getContractStorage(baseState)(knownContractAddress, knownStorageKey)

		// Main cache should now have a value again
		expect(baseState.caches.storage.get(knownContractAddress, knownStorageKey)).toBeDefined()
	})

	it('should handle null result from getStorageAt', async () => {
		// Create a test address and storage key
		const testAddress = createAddress('0x9999999999999999999999999999999999999999')
		const testKey = new Uint8Array(32).fill(42)

		// Create a state with fork configuration
		const testState = createBaseState({
			fork: {
				transport: transports.optimism,
				blockTag: 1n,
			},
		})

		// Mock getAccount to return our contract account
		// Use a factory approach for isContract to avoid the error
		const mockAccount = {
			isContract: () => true,
		}

		// Mock the getAccount module
		const getAccountSpy = vi.spyOn(getAccountModule, 'getAccount')
		getAccountSpy.mockImplementation(() => () => Promise.resolve(mockAccount) as any)

		// Mock getForkClient to return a client that returns null from getStorageAt
		const mockForkClient = {
			getStorageAt: vi.fn().mockResolvedValue(null),
		}

		const getForkClientSpy = vi.spyOn(getForkClientModule, 'getForkClient')
		getForkClientSpy.mockReturnValue(mockForkClient as any)

		// Call getContractStorage - it should handle the null response
		const result = await getContractStorage(testState)(testAddress, testKey)

		// Verify the result is equivalent to hexToBytes('0x0')
		expect(result).toEqual(hexToBytes('0x0'))

		// Verify our mock was called
		expect(mockForkClient.getStorageAt).toHaveBeenCalled()

		// Restore original implementations
		getForkClientSpy.mockRestore()
		getAccountSpy.mockRestore()
	})
})
