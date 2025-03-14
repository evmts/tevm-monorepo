import { createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mineHandler } from './mineHandler.js'

describe('Mine events', () => {
	let client: any

	beforeEach(async () => {
		client = createTevmNode()
		await client.ready()
	})

	it('should call event handlers when mining', async () => {
		// Mock the event handlers
		const onBlock = vi.fn((_block, next) => {
			next?.()
		})

		const onReceipt = vi.fn((_receipt, _blockHash, next) => {
			next?.()
		})

		const onLog = vi.fn((_log, _receipt, next) => {
			next?.()
		})

		// Call mine with event handlers
		const result = await mineHandler(client)({
			blockCount: 1,
			onBlock,
			onReceipt,
			onLog,
		})

		// Verify the result
		expect(result.blockHashes).toBeDefined()
		expect(result.blockHashes?.length).toBe(1)

		// Verify that the block handler was called
		expect(onBlock).toHaveBeenCalledTimes(1)

		// The receipt and log handlers may not be called if there are no transactions
		// but the code structure should be called correctly
	})

	it('should call all handlers with correct parameters', async () => {
		// This test verifies the parameter structures passed to handlers

		// Mock the event handlers with parameter verification
		const onBlock = vi.fn((block, next) => {
			// Verify block has expected structure
			expect(block).toBeDefined()
			expect(block.hash).toBeDefined()
			expect(typeof block.hash).toBe('function')

			next?.()
		})

		const onReceipt = vi.fn((receipt, blockHash, next) => {
			// Verify receipt and blockHash
			if (receipt) {
				expect(receipt).toBeDefined()
				expect(blockHash).toBeDefined()
				expect(typeof blockHash).toBe('string')
				expect(blockHash.startsWith('0x')).toBe(true)
			}

			next?.()
		})

		const onLog = vi.fn((log, receipt, next) => {
			// Verify log and receipt
			if (log) {
				expect(log).toBeDefined()
				expect(receipt).toBeDefined()
			}

			next?.()
		})

		// Call mine with event handlers
		await mineHandler(client)({
			blockCount: 1,
			onBlock,
			onReceipt,
			onLog,
		})

		// Verify handlers were called
		expect(onBlock).toHaveBeenCalled()
	})

	it('should work with async event handlers', async () => {
		let blockHandled = false

		// Create an async handler that updates a flag after a delay
		const onBlock = vi.fn(async (block, next) => {
			// Need to use block parameter to verify handler is called with actual data
			expect(block).toBeDefined()
			await new Promise((resolve) => setTimeout(resolve, 10))
			blockHandled = true
			next?.()
		})

		// Call mine with async handlers
		await mineHandler(client)({
			blockCount: 1,
			onBlock,
		})

		// Verify async handler was called and completed
		expect(onBlock).toHaveBeenCalled()
		expect(blockHandled).toBe(true)
	})

	it('should work without event handlers', async () => {
		// Call mine without event handlers
		const result = await mineHandler(client)({
			blockCount: 1,
		})

		// Verify the operation completed successfully
		expect(result.blockHashes).toBeDefined()
		expect(result.blockHashes?.length).toBe(1)
	})
})
