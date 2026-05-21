import { createAddress } from '@tevm/address'
import {
	createAccount,
	createAddressFromString,
	EthjsAccount,
	EthjsAddress,
	hexToBytes,
	toBytes,
} from '@tevm/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BaseState } from '../BaseState.js'
import { createBaseState } from '../createBaseState.js'
import * as getAccountModule from './getAccount.js'
import { getContractStorage } from './getContractStorage.js'
import { putAccount } from './putAccount.js'
import { putContractStorage } from './putContractStorage.js'

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
const createMockForkTransport = (storage: string | null = '0x1234') => ({
	request: vi.fn(async ({ method }: { method: string }) => {
		if (method === 'eth_getBlockByNumber') {
			return mockBlock
		}
		if (method === 'eth_getProof') {
			return {
				address: '0x4200000000000000000000000000000000000010',
				accountProof: [],
				balance: '0x0',
				codeHash: `0x${'11'.repeat(32)}`,
				nonce: '0x1',
				storageHash: `0x${'22'.repeat(32)}`,
				storageProof: [],
			}
		}
		if (method === 'eth_getStorageAt') {
			return storage
		}
		throw new Error(`Unexpected RPC method: ${method}`)
	}),
})

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
		expect(await getContractStorage(baseState)(address, newKey)).toEqual(new Uint8Array())
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
		expect(await getContractStorage(baseState)(newAddress, key)).toEqual(new Uint8Array())
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
		expect(await getContractStorage(baseState)(contractAddress, key)).toEqual(new Uint8Array())
	})
})

describe('getContractStorage forking', () => {
	let baseState: BaseState
	let knownContractAddress: EthjsAddress
	let knownStorageKey: Uint8Array

	beforeEach(async () => {
		baseState = createBaseState({
			loggingLevel: 'warn',
			fork: {
				transport: createMockForkTransport(),
				blockTag: 1n,
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
		expect(result).toEqual(hexToBytes('0x1234'))

		// Second call - should use cache
		const cachedResult = await getContractStorage(baseState)(knownContractAddress, knownStorageKey)

		// The second result should match the first
		expect(cachedResult).toEqual(result)
	})

	it('should return empty Uint8Array if the account does not exist and no fork transport', async () => {
		const noForkBaseState = createBaseState({
			loggingLevel: 'warn',
		})
		expect(await getContractStorage(noForkBaseState)(knownContractAddress, knownStorageKey)).toEqual(new Uint8Array())
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
				transport: createMockForkTransport(null),
				blockTag: 1n,
			},
		})

		// Call getContractStorage - it should handle the null response
		const result = await getContractStorage(testState)(testAddress, testKey)

		// Verify the result is the canonical empty storage value.
		expect(result).toEqual(new Uint8Array())

		expect(testState.options.fork?.transport.request).toHaveBeenCalled()
	})
})
