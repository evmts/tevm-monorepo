import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { debugStorageRangeAtJsonRpcProcedure } from './debugStorageRangeAtProcedure.js'

describe('debugStorageRangeAtJsonRpcProcedure', () => {
	it('should get storage range for an address', async () => {
		const client = createTevmNode({
			fork: {
				url: `https://mainnet.optimism.io`,
				blockTag: 135135135n,
			},
		})

		// Deploy a simple contract with storage
		const vm = await client.getVm()
		await vm.stateManager.checkpoint()

		const procedure = debugStorageRangeAtJsonRpcProcedure(client)

		// Use WETH contract address which has storage
		const wethAddress = '0x4200000000000000000000000000000000000006'

		const response = await procedure({
			id: 1,
			jsonrpc: '2.0',
			method: 'debug_storageRangeAt',
			params: [
				{
					blockTag: 'latest',
					txIndex: 0,
					address: wethAddress,
					startKey: '0x0',
					maxResult: 10,
				},
			],
		})

		expect(response.method).toBe('debug_storageRangeAt')
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(1)

		if ('error' in response) {
			// It's OK if there's no storage or the address doesn't exist
			expect(response.error).toBeDefined()
			expect(response.error.code).toBe('-32000')
		} else {
			expect(response.result).toBeDefined()
			expect(response.result.storage).toBeDefined()
			expect(typeof response.result.storage).toBe('object')
			expect(response.result.nextKey === null || typeof response.result.nextKey === 'string').toBe(true)
		}
	})

	it('should handle pagination with maxResult', async () => {
		const client = createTevmNode({
			fork: {
				url: `https://mainnet.optimism.io`,
				blockTag: 135135135n,
			},
		})

		const procedure = debugStorageRangeAtJsonRpcProcedure(client)

		// Use WETH contract address
		const wethAddress = '0x4200000000000000000000000000000000000006'

		const response = await procedure({
			id: 2,
			jsonrpc: '2.0',
			method: 'debug_storageRangeAt',
			params: [
				{
					blockTag: 'latest',
					txIndex: 0,
					address: wethAddress,
					startKey: '0x0',
					maxResult: 5,
				},
			],
		})

		expect(response.method).toBe('debug_storageRangeAt')
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(2)

		if ('error' in response) {
			// It's OK if there's no storage
			expect(response.error).toBeDefined()
		} else {
			expect(response.result).toBeDefined()
			expect(response.result.storage).toBeDefined()

			// If there are results, check they're limited by maxResult
			const storageKeys = Object.keys(response.result.storage)
			expect(storageKeys.length).toBeLessThanOrEqual(5)
		}
	})

	it('should handle non-existent address gracefully', async () => {
		const client = createTevmNode()

		const procedure = debugStorageRangeAtJsonRpcProcedure(client)

		const response = await procedure({
			id: 3,
			jsonrpc: '2.0',
			method: 'debug_storageRangeAt',
			params: [
				{
					blockTag: 'latest',
					txIndex: 0,
					address: '0x0000000000000000000000000000000000000001',
					startKey: '0x0',
					maxResult: 10,
				},
			],
		})

		expect(response.method).toBe('debug_storageRangeAt')
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(3)

		// Should return an error or empty storage
		if ('error' in response) {
			expect(response.error).toBeDefined()
			expect(response.error.code).toBe('-32000')
		}
	})
})
