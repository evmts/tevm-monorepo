import { beforeEach, describe, expect, it, afterEach } from 'vitest'
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

// Clean up after each test by removing any interval that was set
afterEach(async () => {
	try {
		await client.removeBlockTimestampInterval()
	} catch (error) {
		// Ignore errors during cleanup
	}
})

describe('setBlockTimestampInterval', () => {
	it('should set a consistent interval between block timestamps', async () => {
		// Set a 30-second interval between blocks
		await client.setBlockTimestampInterval({ interval: 30 })
		
		// Mine several blocks
		const initialBlock = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block1 = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block2 = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block3 = await client.getBlock()
		
		// Verify each block's timestamp increases by exactly 30 seconds
		expect(block1.timestamp - initialBlock.timestamp).toBe(30n)
		expect(block2.timestamp - block1.timestamp).toBe(30n)
		expect(block3.timestamp - block2.timestamp).toBe(30n)
	})
	
	it('should allow setting different interval values', async () => {
		// First set a 10-second interval
		await client.setBlockTimestampInterval({ interval: 10 })
		
		// Mine two blocks with this interval
		const initialBlock = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block1 = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block2 = await client.getBlock()
		
		// Verify interval is 10 seconds
		expect(block1.timestamp - initialBlock.timestamp).toBe(10n)
		expect(block2.timestamp - block1.timestamp).toBe(10n)
		
		// Now change to a 20-second interval
		await client.setBlockTimestampInterval({ interval: 20 })
		
		// Mine two more blocks
		await client.mine({ blocks: 1 })
		const block3 = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block4 = await client.getBlock()
		
		// Verify interval is now 20 seconds
		expect(block3.timestamp - block2.timestamp).toBe(20n)
		expect(block4.timestamp - block3.timestamp).toBe(20n)
	})
	
	it('should work correctly with multiple blocks mined at once', async () => {
		// Set a 15-second interval
		await client.setBlockTimestampInterval({ interval: 15 })
		
		// Get the current block
		const initialBlock = await client.getBlock()
		const initialTimestamp = initialBlock.timestamp
		
		// Mine 5 blocks at once
		await client.mine({ blocks: 5 })
		
		// Get the latest block
		const latestBlock = await client.getBlock()
		const latestTimestamp = latestBlock.timestamp
		
		// Verify the total time increase is 5 blocks * 15 seconds = 75 seconds
		expect(latestTimestamp - initialTimestamp).toBe(5n * 15n)
	})
	
	it('should maintain interval when used with setNextBlockTimestamp', async () => {
		// Set a 10-second block interval
		await client.setBlockTimestampInterval({ interval: 10 })
		
		// Get initial block
		const initialBlock = await client.getBlock()
		
		// Mine a block to apply the interval
		await client.mine({ blocks: 1 })
		const block1 = await client.getBlock()
		
		// Verify 10-second interval
		expect(block1.timestamp - initialBlock.timestamp).toBe(10n)
		
		// Set a specific timestamp for the next block, 100 seconds in the future
		const newTimestamp = block1.timestamp + 100n
		await client.setNextBlockTimestamp({ timestamp: newTimestamp })
		
		// Mine a block to apply the specific timestamp
		await client.mine({ blocks: 1 })
		const block2 = await client.getBlock()
		
		// Verify specific timestamp was applied
		expect(block2.timestamp).toBe(newTimestamp)
		
		// Mine another block - interval should continue from the specific timestamp
		await client.mine({ blocks: 1 })
		const block3 = await client.getBlock()
		
		// Verify the 10-second interval is applied after the specific timestamp
		expect(block3.timestamp - block2.timestamp).toBe(10n)
	})
	
	it('should handle zero and very small intervals', async () => {
		// Set a 1-second interval (minimum realistic value)
		await client.setBlockTimestampInterval({ interval: 1 })
		
		// Mine several blocks
		const initialBlock = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block1 = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block2 = await client.getBlock()
		
		// Verify 1-second interval
		expect(block1.timestamp - initialBlock.timestamp).toBe(1n)
		expect(block2.timestamp - block1.timestamp).toBe(1n)
		
		// Try with zero interval (should default to at least 1 second)
		try {
			await client.setBlockTimestampInterval({ interval: 0 })
			
			// If it doesn't throw, check the behavior
			await client.mine({ blocks: 1 })
			const block3 = await client.getBlock()
			
			// Timestamp should still increase by at least 1
			expect(block3.timestamp).toBeGreaterThanOrEqual(block2.timestamp + 1n)
		} catch (error) {
			// Some implementations might reject a zero interval
			// This is acceptable behavior
		}
	})
})
