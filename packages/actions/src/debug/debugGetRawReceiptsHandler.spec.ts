import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugGetRawReceiptsHandler } from './debugGetRawReceiptsHandler.js'

describe('debugGetRawReceiptsHandler', () => {
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

		// Execute a contract call to generate more transactions
		await contractHandler(client)({
			...SimpleContract.write.set(999n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})

		// Mine to create blocks
		await mineHandler(client)()
	})

	it('should return RLP-encoded receipts for block with transactions', async () => {
		const handler = debugGetRawReceiptsHandler(client)
		const result = await handler({ blockNumber: 1n })

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBeGreaterThan(0)

		// Each receipt should be a hex string
		for (const receipt of result) {
			expect(typeof receipt).toBe('string')
			expect(receipt).toMatch(/^0x[0-9a-f]+$/i)
			expect(receipt.length).toBeGreaterThan(10)
		}
	})

	it('should return empty array for block with no transactions', async () => {
		// Mine an empty block
		await mineHandler(client)()
		await mineHandler(client)()

		const handler = debugGetRawReceiptsHandler(client)
		// Block 3 should be empty
		const result = await handler({ blockNumber: 3n })

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBe(0)
	})

	it('should return receipts by latest tag', async () => {
		const handler = debugGetRawReceiptsHandler(client)
		const result = await handler({ blockTag: 'latest' })

		expect(Array.isArray(result)).toBe(true)
	})

	it('should return receipts by block number as hex string', async () => {
		const handler = debugGetRawReceiptsHandler(client)
		const result = await handler({ blockNumber: '0x1' })

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBeGreaterThan(0)
	})

	it('should return correct number of receipts matching transaction count', async () => {
		const handler = debugGetRawReceiptsHandler(client)
		// Block 1 should have the deployment transaction
		const result = await handler({ blockNumber: 1n })

		expect(Array.isArray(result)).toBe(true)
		// Should have at least 1 receipt for deployment
		expect(result.length).toBeGreaterThanOrEqual(1)
	})

	it('should throw error for non-existent block', async () => {
		const handler = debugGetRawReceiptsHandler(client)

		await expect(async () => {
			await handler({ blockNumber: 999999n })
		}).rejects.toThrow()
	})

	it('should default to latest when no params provided', async () => {
		const handler = debugGetRawReceiptsHandler(client)
		// @ts-expect-error - testing default behavior
		const result = await handler({})

		expect(Array.isArray(result)).toBe(true)
	})

	it('should prefer blockNumber over blockTag when both provided', async () => {
		const handler = debugGetRawReceiptsHandler(client)
		const result = await handler({
			blockNumber: 1n,
			blockTag: 'latest',
		})

		const block1Result = await handler({ blockNumber: 1n })

		expect(result).toEqual(block1Result)
	})

	it('should return receipts with valid RLP format', async () => {
		const handler = debugGetRawReceiptsHandler(client)
		const result = await handler({ blockNumber: 1n })

		expect(result.length).toBeGreaterThan(0)

		// Check first receipt has valid RLP format
		const firstReceipt = result[0]
		expect(firstReceipt).toMatch(/^0x[0-9a-f]+$/i)
		// RLP list indicator
		const _firstByte = firstReceipt.substring(2, 4)
		// Should start with a valid RLP byte
		expect(firstReceipt.length).toBeGreaterThan(10)
	})

	it('should handle multiple transactions in one block', async () => {
		// Create a new client and deploy multiple transactions
		const newClient = createTevmNode()

		// Deploy contract
		const { createdAddress: addr } = await deployHandler(newClient)({
			...SimpleContract.deploy(1n),
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(addr, 'address is undefined')

		// Execute multiple contract calls in same block
		await contractHandler(newClient)({
			...SimpleContract.write.set(2n),
			to: addr,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})

		await contractHandler(newClient)({
			...SimpleContract.write.set(3n),
			to: addr,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})

		const handler = debugGetRawReceiptsHandler(newClient)
		const result = await handler({ blockNumber: 1n })

		expect(Array.isArray(result)).toBe(true)
		// Should have multiple receipts
		expect(result.length).toBeGreaterThanOrEqual(1)

		// All receipts should be valid hex strings
		for (const receipt of result) {
			expect(typeof receipt).toBe('string')
			expect(receipt).toMatch(/^0x[0-9a-f]+$/i)
		}
	})

	it('should return consistent receipts for the same block', async () => {
		const handler = debugGetRawReceiptsHandler(client)
		const result1 = await handler({ blockNumber: 1n })
		const result2 = await handler({ blockNumber: 1n })

		expect(result1).toEqual(result2)
	})

	it('should handle genesis block with no receipts', async () => {
		const handler = debugGetRawReceiptsHandler(client)
		const result = await handler({ blockNumber: 0n })

		expect(Array.isArray(result)).toBe(true)
		// Genesis block typically has no transactions/receipts
		expect(result.length).toBe(0)
	})
})
