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

describe('removeBlockTimestampInterval', () => {
	it('should remove a previously set block timestamp interval', async () => {
		// First set a 20-second interval
		await client.setBlockTimestampInterval({ interval: 20 })
		
		// Mine a block to verify the interval is applied
		const initialBlock = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block1 = await client.getBlock()
		
		// Verify the 20-second interval was applied
		expect(block1.timestamp - initialBlock.timestamp).toBe(20n)
		
		// Now remove the interval
		await client.removeBlockTimestampInterval()
		
		// Mine another block
		await client.mine({ blocks: 1 })
		const block2 = await client.getBlock()
		
		// Mine one more block to verify behavior
		await client.mine({ blocks: 1 })
		const block3 = await client.getBlock()
		
		// The timestamps should still increase, but not by exactly 20 seconds
		// The actual behavior depends on implementation, but should revert to
		// default timestamp behavior (usually 1-15 seconds per block)
		const interval1 = block2.timestamp - block1.timestamp
		const interval2 = block3.timestamp - block2.timestamp
		
		// Timestamps should still increase
		expect(interval1).toBeGreaterThan(0n)
		expect(interval2).toBeGreaterThan(0n)
		
		// The intervals should not be exactly 20 seconds anymore
		// Note: This test might be implementation-specific, as some clients
		// might have a fixed default interval after removing a custom interval
		expect(interval1 !== 20n || interval2 !== 20n).toBe(true)
	})
	
	it('should not throw an error when no interval was set', async () => {
		// No interval set yet
		// Calling removeBlockTimestampInterval should not throw
		await expect(client.removeBlockTimestampInterval()).resolves.not.toThrow()
		
		// Mine a few blocks to ensure everything still works
		await client.mine({ blocks: 1 })
		const block1 = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block2 = await client.getBlock()
		
		// Timestamps should still increase
		expect(block2.timestamp).toBeGreaterThan(block1.timestamp)
	})
	
	it('should allow setting a new interval after removing one', async () => {
		// Set a 10-second interval
		await client.setBlockTimestampInterval({ interval: 10 })
		
		// Mine a block to apply the interval
		const initialBlock = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block1 = await client.getBlock()
		
		// Verify 10-second interval
		expect(block1.timestamp - initialBlock.timestamp).toBe(10n)
		
		// Remove the interval
		await client.removeBlockTimestampInterval()
		
		// Mine a block with no fixed interval
		await client.mine({ blocks: 1 })
		const block2 = await client.getBlock()
		
		// Now set a new 30-second interval
		await client.setBlockTimestampInterval({ interval: 30 })
		
		// Mine blocks with the new interval
		await client.mine({ blocks: 1 })
		const block3 = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block4 = await client.getBlock()
		
		// Verify the new 30-second interval is applied
		expect(block3.timestamp - block2.timestamp).toBe(30n)
		expect(block4.timestamp - block3.timestamp).toBe(30n)
	})
	
	it('should not affect other time-related functions', async () => {
		// Set a 15-second interval
		await client.setBlockTimestampInterval({ interval: 15 })
		
		// Mine a block to verify the interval
		const initialBlock = await client.getBlock()
		
		await client.mine({ blocks: 1 })
		const block1 = await client.getBlock()
		
		// Verify 15-second interval
		expect(block1.timestamp - initialBlock.timestamp).toBe(15n)
		
		// Remove the interval
		await client.removeBlockTimestampInterval()
		
		// Set a specific timestamp for the next block
		const specificTimestamp = block1.timestamp + 100n
		await client.setNextBlockTimestamp({ timestamp: specificTimestamp })
		
		// Mine a block to apply the specific timestamp
		await client.mine({ blocks: 1 })
		const block2 = await client.getBlock()
		
		// Verify the specific timestamp was applied correctly
		expect(block2.timestamp).toBe(specificTimestamp)
		
		// Increase time by 50 seconds
		await client.increaseTime({ seconds: 50 })
		
		// Mine a block to apply the time increase
		await client.mine({ blocks: 1 })
		const block3 = await client.getBlock()
		
		// Verify the time increase was applied (approximately)
		expect(block3.timestamp - block2.timestamp).toBeGreaterThanOrEqual(50n)
	})
})
