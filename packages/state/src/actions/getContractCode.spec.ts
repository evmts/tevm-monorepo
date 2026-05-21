import { createAddress } from '@tevm/address'
import { SimpleContract } from '@tevm/test-utils'
import { hexToBytes } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getContractCode } from './getContractCode.js'
import { putContractCode } from './putContractCode.js'

const contract = SimpleContract.withAddress(`0x${'69'.repeat(20)}`)
const tokenAddress = createAddress(`0x42${'0'.repeat(36)}42`)
const emptyAddress = createAddress(`0x${'7654'.repeat(10)}`)
const remoteCode = '0x1234'
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

const createMockForkTransport = (codeByAddress: Record<string, string> = {}) => ({
	request: vi.fn(async ({ method, params }: { method: string; params?: readonly unknown[] }) => {
		if (method === 'eth_getBlockByNumber') {
			return mockBlock
		}
		if (method === 'eth_getCode') {
			return codeByAddress[String(params?.[0]).toLowerCase()] ?? '0x'
		}
		throw new Error(`Unexpected RPC method: ${method}`)
	}),
})

describe(getContractCode.name, () => {
	it('should return contract code from state', async () => {
		const state = createBaseState({})
		await putContractCode(state)(createAddress(contract.address), hexToBytes(contract.deployedBytecode))
		expect(await getContractCode(state)(createAddress(contract.address))).toEqual(hexToBytes(contract.deployedBytecode))
	})

	it('should return Empty bytes if no contract exists', async () => {
		const state = createBaseState({})
		expect(await getContractCode(state)(createAddress(contract.address))).toEqual(new Uint8Array())
	})

	it('should fetch and cache from live chain if in forked mode', async () => {
		const transport = createMockForkTransport({ [tokenAddress.toString().toLowerCase()]: remoteCode })
		const state = createBaseState({
			fork: {
				transport,
			},
		})
		const code = await getContractCode(state)(tokenAddress)
		expect(code).toEqual(hexToBytes(remoteCode))
		expect(state.caches.contracts.get(tokenAddress)).toBe(code)
	})

	it('should return empty bytes of the contract doesn not exist on forked chain. It should still cache the result', async () => {
		const state = createBaseState({
			fork: {
				transport: createMockForkTransport(),
			},
		})
		const code = await getContractCode(state)(emptyAddress)
		expect(code).toEqual(new Uint8Array())
		expect(state.caches.contracts.has(emptyAddress)).toBe(true)
		expect(await getContractCode(state)(emptyAddress)).toEqual(new Uint8Array())
	})

	it('supports skipping fetching from fork', async () => {
		const state = createBaseState({
			fork: {
				transport: createMockForkTransport({ [tokenAddress.toString().toLowerCase()]: remoteCode }),
			},
		})
		const skipFetching = true
		const code = await getContractCode(state, skipFetching)(tokenAddress)
		expect(code).toEqual(new Uint8Array())
		// shouldn't cache it if we skipped
		expect(state.caches.contracts.has(tokenAddress)).toBe(false)
	})

	it('should store fetched contract code in both main and fork caches', async () => {
		const transport = createMockForkTransport({ [tokenAddress.toString().toLowerCase()]: remoteCode })
		const state = createBaseState({
			fork: {
				transport,
			},
		})
		const code = await getContractCode(state)(tokenAddress)

		// Check main cache
		expect(state.caches.contracts.get(tokenAddress)).toBe(code)

		// Check fork cache
		expect(state.forkCache.contracts.get(tokenAddress)).toBe(code)
	})

	it('should check fork cache if code not found in main cache', async () => {
		const transport = createMockForkTransport({ [tokenAddress.toString().toLowerCase()]: remoteCode })
		const state = createBaseState({
			fork: {
				transport,
			},
		})

		// First fetch to populate both caches
		const code = await getContractCode(state)(tokenAddress)

		// Clear main cache but keep fork cache
		state.caches.contracts.clear()

		// Verify main cache is empty
		expect(state.caches.contracts.get(tokenAddress)).toBeUndefined()

		// Verify fork cache still has the code
		expect(state.forkCache.contracts.get(tokenAddress)).toBe(code)

		// Now fetch again - should get from fork cache and populate main cache
		const newCode = await getContractCode(state)(tokenAddress)
		expect(newCode).toBe(code)

		// Main cache should now have the code again
		expect(state.caches.contracts.get(tokenAddress)).toBe(code)
	})

	it('should store empty code in both caches when contract does not exist', async () => {
		const state = createBaseState({
			fork: {
				transport: createMockForkTransport(),
			},
		})
		await getContractCode(state)(emptyAddress)

		// Check main cache has empty code
		expect(state.caches.contracts.get(emptyAddress)).toEqual(new Uint8Array())

		// Check fork cache has empty code
		expect(state.forkCache.contracts.get(emptyAddress)).toEqual(new Uint8Array())
	})

	it('should return EMPTY_CODE if contracts.has(address) is true', async () => {
		// This tests lines 60-62 in getContractCode.js
		const state = createBaseState({
			fork: {
				transport: createMockForkTransport(),
			},
		})
		const testAddress = createAddress(`0x${'be'.repeat(20)}`)

		// Setup the contracts.has mock to return true
		vi.spyOn(state.caches.contracts, 'has').mockReturnValue(true)

		// We don't need to mock the client as we should never reach that code path

		// Call getContractCode
		const result = await getContractCode(state)(testAddress)

		// Should return empty code without calling getBytecode
		expect(result).toEqual(new Uint8Array())
	})

	it('should return empty code if address has already been cached in contracts but not forkContracts', async () => {
		const state = createBaseState({
			fork: {
				transport: createMockForkTransport(),
			},
		})
		const address = createAddress(`0x${'abcd'.repeat(10)}`)

		// Manually put an empty code entry in the main contracts cache
		state.caches.contracts.put(address, new Uint8Array())

		// This should trigger lines 60-62 in getContractCode.js
		const code = await getContractCode(state)(address)

		// Should return empty code without doing a remote call
		expect(code).toEqual(new Uint8Array())
	})
})
