import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugGetRawHeaderHandler } from './debugGetRawHeaderHandler.js'

describe('debugGetRawHeaderHandler', () => {
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

	it('should return RLP-encoded header by latest tag', async () => {
		const handler = debugGetRawHeaderHandler(client)
		const result = await handler({ blockTag: 'latest' })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		// RLP encoded header should be non-trivial length
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return RLP-encoded header by block number as bigint', async () => {
		const handler = debugGetRawHeaderHandler(client)
		const result = await handler({ blockNumber: 1n })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return RLP-encoded header by block number as hex string', async () => {
		const handler = debugGetRawHeaderHandler(client)
		const result = await handler({ blockNumber: '0x1' })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return RLP-encoded header for block 0', async () => {
		const handler = debugGetRawHeaderHandler(client)
		const result = await handler({ blockNumber: 0n })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return different RLP data for different block headers', async () => {
		const handler = debugGetRawHeaderHandler(client)
		const header0 = await handler({ blockNumber: 0n })
		const header1 = await handler({ blockNumber: 1n })
		const header2 = await handler({ blockNumber: 2n })

		expect(header0).not.toEqual(header1)
		expect(header1).not.toEqual(header2)
		expect(header0).not.toEqual(header2)
	})

	it('should throw error for non-existent block', async () => {
		const handler = debugGetRawHeaderHandler(client)

		await expect(async () => {
			await handler({ blockNumber: 999999n })
		}).rejects.toThrow()
	})

	it('should default to latest when no params provided', async () => {
		const handler = debugGetRawHeaderHandler(client)
		// @ts-expect-error - testing default behavior
		const result = await handler({})

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should prefer blockNumber over blockTag when both provided', async () => {
		const handler = debugGetRawHeaderHandler(client)
		// When both are provided, blockNumber should take precedence
		const result = await handler({
			blockNumber: 1n,
			blockTag: 'latest',
		})

		const block1Result = await handler({ blockNumber: 1n })

		expect(result).toEqual(block1Result)
	})

	it('should return header that is smaller than full block RLP', async () => {
		const headerHandler = debugGetRawHeaderHandler(client)
		const header = await headerHandler({ blockNumber: 1n })

		// Header should be a reasonable size (typically 500-600 bytes for Ethereum headers)
		// But less than a full block with transactions
		expect(header.length).toBeGreaterThan(10)
		expect(header.length).toBeLessThan(2000) // Headers are typically under 1KB
	})

	it('should return valid RLP that starts with expected format', async () => {
		const handler = debugGetRawHeaderHandler(client)
		const result = await handler({ blockTag: 'latest' })

		// RLP encoded header should start with 0x and be hex
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		// First byte after 0x should indicate a list (0xf8 or 0xf9 typically for headers)
		const firstByte = result.substring(2, 4)
		expect(['f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff']).toContain(firstByte.toLowerCase())
	})

	it('should return consistent header for the same block', async () => {
		const handler = debugGetRawHeaderHandler(client)
		const result1 = await handler({ blockNumber: 1n })
		const result2 = await handler({ blockNumber: 1n })

		expect(result1).toEqual(result2)
	})

	it('should handle genesis block header', async () => {
		const handler = debugGetRawHeaderHandler(client)
		const result = await handler({ blockNumber: 0n })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return header for block with transactions', async () => {
		const handler = debugGetRawHeaderHandler(client)
		// Block 1 contains the deployment transaction
		const result = await handler({ blockNumber: 1n })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return header for empty block', async () => {
		const handler = debugGetRawHeaderHandler(client)
		// Block 2 is an empty block from mining
		const result = await handler({ blockNumber: 2n })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})
})
