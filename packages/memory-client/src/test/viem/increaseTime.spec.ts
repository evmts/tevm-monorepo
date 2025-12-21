import { type TestActions, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let client: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	// Create a memory client extended with test actions
	client = createMemoryClient().extend(testActions({ mode: 'anvil' }))
	await client.tevmReady()
})

describe('increaseTime', () => {
	it('should increase block timestamp by the specified amount of seconds', async () => {
		// Get the current block timestamp
		const initialBlock = await client.getBlock()
		const initialTimestamp = initialBlock.timestamp

		// Increase time by 1 hour (3600 seconds)
		const secondsToIncrease = 3600
		await client.increaseTime({ seconds: secondsToIncrease })

		// Mine a new block to apply the timestamp change
		await client.mine({ blocks: 1 })

		// Get the new block and verify the timestamp
		const newBlock = await client.getBlock()
		expect(newBlock.timestamp).toBe(initialTimestamp + BigInt(secondsToIncrease))
	})

	it('should only affect the next block timestamp', async () => {
		// Get the current block timestamp
		const initialBlock = await client.getBlock()
		const initialTimestamp = initialBlock.timestamp

		// Increase time by 1 hour
		const secondsToIncrease = 3600
		await client.increaseTime({ seconds: secondsToIncrease })

		// Mine a block to apply the timestamp
		await client.mine({ blocks: 1 })

		const block1 = await client.getBlock()
		expect(block1.timestamp).toBe(initialTimestamp + BigInt(secondsToIncrease))

		// Mine another block - should use current time, not the increased override
		await client.mine({ blocks: 1 })
		const block2 = await client.getBlock()

		// The second block's timestamp should be greater than the first (uses current time)
		// It won't be exactly initialTimestamp + 3600 + something since setNextBlockTimestamp
		// is cleared after mining
		expect(block2.timestamp).toBeGreaterThan(block1.timestamp)
	})

	it('should work with large time increments', async () => {
		// Get the current block timestamp
		const initialBlock = await client.getBlock()
		const initialTimestamp = initialBlock.timestamp

		// Increase time by 1 year (roughly 31536000 seconds)
		const oneYear = 365 * 24 * 60 * 60
		await client.increaseTime({ seconds: oneYear })

		// Mine a block
		await client.mine({ blocks: 1 })

		const newBlock = await client.getBlock()
		expect(newBlock.timestamp).toBe(initialTimestamp + BigInt(oneYear))
	})

	it('should return the increased seconds as hex', async () => {
		// Make a direct JSON-RPC call to verify the return value
		const result = await client.request({
			method: 'anvil_increaseTime' as any,
			params: [3600],
		})
		// The result should be the hex representation of the seconds increased
		expect(result).toBe('0xe10') // 3600 in hex
	})
})
