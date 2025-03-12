import { beforeEach, describe, expect, it } from 'vitest'
import { testActions } from 'viem'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let client: MemoryClient & ReturnType<typeof testActions>

beforeEach(async () => {
	// Create a memory client extended with test actions
	client = createMemoryClient().extend(testActions({ mode: 'anvil' }))
	await client.tevmReady()
	// Mine an initial block
	await client.tevmMine()
})

describe('increaseTime', () => {
	it('should increase block timestamp by the specified amount of seconds', async () => {
		// Get initial block timestamp
		const block1 = await client.getBlock()
		const initialTimestamp = block1.timestamp
		
		// Increase time by 100 seconds
		await client.increaseTime({ seconds: 100 })
		
		// Mine a block to apply the time change
		await client.mine({ blocks: 1 })
		
		// Get the new block timestamp
		const block2 = await client.getBlock()
		const newTimestamp = block2.timestamp
		
		// Verify time increased by at least 100 seconds
		expect(newTimestamp - initialTimestamp).toBeGreaterThanOrEqual(100n)
	})
	
	it('should support large time increases', async () => {
		// Get initial block timestamp
		const block1 = await client.getBlock()
		const initialTimestamp = block1.timestamp
		
		// Increase time by 1 week (604800 seconds)
		const oneWeekInSeconds = 60 * 60 * 24 * 7
		await client.increaseTime({ seconds: oneWeekInSeconds })
		
		// Mine a block to apply the time change
		await client.mine({ blocks: 1 })
		
		// Get the new block timestamp
		const block2 = await client.getBlock()
		const newTimestamp = block2.timestamp
		
		// Verify time increased by at least one week
		expect(newTimestamp - initialTimestamp).toBeGreaterThanOrEqual(BigInt(oneWeekInSeconds))
	})
	
	it('should work with subsequent time increases', async () => {
		// Get initial block timestamp
		const block1 = await client.getBlock()
		const initialTimestamp = block1.timestamp
		
		// First time increase: 100 seconds
		await client.increaseTime({ seconds: 100 })
		await client.mine({ blocks: 1 })
		
		// Get timestamp after first increase
		const block2 = await client.getBlock()
		const timestampAfterFirstIncrease = block2.timestamp
		
		// Verify first time increase
		expect(timestampAfterFirstIncrease - initialTimestamp).toBeGreaterThanOrEqual(100n)
		
		// Second time increase: 200 seconds
		await client.increaseTime({ seconds: 200 })
		await client.mine({ blocks: 1 })
		
		// Get timestamp after second increase
		const block3 = await client.getBlock()
		const timestampAfterSecondIncrease = block3.timestamp
		
		// Verify second time increase
		expect(timestampAfterSecondIncrease - timestampAfterFirstIncrease).toBeGreaterThanOrEqual(200n)
	})
	
	it('should work with block timestamp intervals', async () => {
		// Set a block timestamp interval of 15 seconds
		await client.setBlockTimestampInterval({ interval: 15 })
		
		// Mine a block to get the first timestamp
		await client.mine({ blocks: 1 })
		const block1 = await client.getBlock()
		const initialTimestamp = block1.timestamp
		
		// Increase time by 100 seconds
		await client.increaseTime({ seconds: 100 })
		
		// Mine a block to apply the combined effect of time increase + interval
		await client.mine({ blocks: 1 })
		const block2 = await client.getBlock()
		const newTimestamp = block2.timestamp
		
		// Verify time increased by at least 100 seconds
		expect(newTimestamp - initialTimestamp).toBeGreaterThanOrEqual(100n)
		
		// Mine another block without increasing time
		await client.mine({ blocks: 1 })
		const block3 = await client.getBlock()
		
		// Verify the interval is still being applied
		expect(block3.timestamp - block2.timestamp).toBe(15n)
		
		// Remove the interval
		await client.removeBlockTimestampInterval()
		
		// Mine another block
		await client.mine({ blocks: 1 })
		const block4 = await client.getBlock()
		
		// Timestamp should still increase but not necessarily by exactly 15
		expect(block4.timestamp).toBeGreaterThan(block3.timestamp)
	})
})
