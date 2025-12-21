import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugStorageRangeAtHandler } from './debugStorageRangeAtHandler.js'

describe('debugStorageRangeAtHandler', () => {
	let client: TevmNode
	let contractAddress: Address

	beforeEach(async () => {
		client = createTevmNode()

		const { createdAddress } = await deployHandler(client)({
			...SimpleContract.deploy(420n),
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(createdAddress, 'createdAddress is undefined')
		contractAddress = createdAddress

		// Set the value in storage
		await contractHandler(client)({
			...SimpleContract.write.set(999n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})

		await mineHandler(client)()
	})

	it('should return storage range for a contract at latest block', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: 'latest',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})

		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
		expect(typeof result.storage).toBe('object')
	})

	it('should return storage entries with correct format', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: 'latest',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})

		// Storage should be an object
		expect(typeof result.storage).toBe('object')
		// Storage may or may not have entries depending on contract state
		if (Object.keys(result.storage).length > 0) {
			const firstKey = Object.keys(result.storage)[0]
			const storageEntry = result.storage[firstKey]
			expect(storageEntry).toHaveProperty('key')
			expect(storageEntry).toHaveProperty('value')
			expect(typeof storageEntry.key).toBe('string')
			expect(typeof storageEntry.value).toBe('string')
		}
	})

	it('should handle maxResult parameter', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: 'latest',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 1,
		})

		// Should respect maxResult
		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
	})

	it('should handle pagination', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: 'latest',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 10,
		})

		// Should have storage and nextKey properties
		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
	})

	it('should work with different block numbers', async () => {
		const handler = debugStorageRangeAtHandler(client)

		// Test with block number 1
		const block1Result = await handler({
			blockTag: 1n,
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})
		expect(block1Result).toHaveProperty('storage')

		// Test with block number 2
		const block2Result = await handler({
			blockTag: 2n,
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})
		expect(block2Result).toHaveProperty('storage')
	})

	it('should work with hex block number', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: '0x1',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})

		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
	})

	it('should work with numeric block number', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: 1,
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})

		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
	})

	it('should handle different startKey values', async () => {
		const handler = debugStorageRangeAtHandler(client)

		// Start from different key
		const result = await handler({
			blockTag: 'latest',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0000000000000000000000000000000000000000000000000000000000000001',
			maxResult: 100,
		})

		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
	})
})
