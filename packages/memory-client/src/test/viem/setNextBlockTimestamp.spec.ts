import { type TestActions, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setNextBlockTimestamp', () => {
	it('should work as expected', async () => {
		const timestamp = 1640995200n // Unix timestamp for 2022-01-01 00:00:00 UTC
		await mc.setNextBlockTimestamp({ timestamp })
		
		// Mine a block to verify the timestamp was set
		await mc.mine({ blocks: 1 })
		
		// Get the latest block and verify its timestamp
		const block = await mc.getBlock({ blockTag: 'latest' })
		expect(block.timestamp).toBe(timestamp)
	})
})
