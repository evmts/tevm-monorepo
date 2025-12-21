import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugGetRawBlockHandler } from './debugGetRawBlockHandler.js'

describe('debugGetRawBlockHandler', () => {
	let client: TevmNode
	let _contractAddress: Address

	beforeEach(async () => {
		client = createTevmNode()

		const { createdAddress } = await deployHandler(client)({
			...SimpleContract.deploy(420n),
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(createdAddress, 'createdAddress is undefined')
		_contractAddress = createdAddress

		// Mine additional blocks
		await mineHandler(client)()
		await mineHandler(client)()
	})

	it('should return RLP-encoded block by latest tag', async () => {
		const handler = debugGetRawBlockHandler(client)
		const result = await handler({ blockTag: 'latest' })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		// RLP encoded data should be non-trivial length
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return RLP-encoded block by block number as bigint', async () => {
		const handler = debugGetRawBlockHandler(client)
		const result = await handler({ blockNumber: 1n })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return RLP-encoded block by block number as hex string', async () => {
		const handler = debugGetRawBlockHandler(client)
		const result = await handler({ blockNumber: '0x1' })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return RLP-encoded block for block 0', async () => {
		const handler = debugGetRawBlockHandler(client)
		const result = await handler({ blockNumber: 0n })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return different RLP data for different blocks', async () => {
		const handler = debugGetRawBlockHandler(client)
		const block0 = await handler({ blockNumber: 0n })
		const block1 = await handler({ blockNumber: 1n })
		const block2 = await handler({ blockNumber: 2n })

		expect(block0).not.toEqual(block1)
		expect(block1).not.toEqual(block2)
		expect(block0).not.toEqual(block2)
	})

	it('should throw error for non-existent block', async () => {
		const handler = debugGetRawBlockHandler(client)

		await expect(async () => {
			await handler({ blockNumber: 999999n })
		}).rejects.toThrow()
	})

	it('should default to latest when no params provided', async () => {
		const handler = debugGetRawBlockHandler(client)
		// @ts-expect-error - testing default behavior
		const result = await handler({})

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should prefer blockNumber over blockTag when both provided', async () => {
		const handler = debugGetRawBlockHandler(client)
		// When both are provided, blockNumber should take precedence
		const result = await handler({
			blockNumber: 1n,
			blockTag: 'latest',
		})

		const block1Result = await handler({ blockNumber: 1n })

		expect(result).toEqual(block1Result)
	})

	it('should handle block with transactions', async () => {
		const handler = debugGetRawBlockHandler(client)
		// Block 1 contains the deployment transaction
		const result = await handler({ blockNumber: 1n })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		// Block with transactions should be larger
		expect(result.length).toBeGreaterThan(100)
	})

	it('should handle block without transactions', async () => {
		const handler = debugGetRawBlockHandler(client)
		// Block 2 is an empty block from mining
		const result = await handler({ blockNumber: 2n })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return valid RLP that starts with expected format', async () => {
		const handler = debugGetRawBlockHandler(client)
		const result = await handler({ blockTag: 'latest' })

		// RLP encoded block should start with 0x and be hex
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		// First byte after 0x should indicate a list (0xf8 or 0xf9 typically for blocks)
		const firstByte = result.substring(2, 4)
		expect(['f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff']).toContain(firstByte.toLowerCase())
	})
})
