import { type TestActions, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setNextBlockTimestamp', () => {
	it('should set the timestamp of the next mined block', async () => {
		const targetTimestamp = 1700000000n
		await mc.setNextBlockTimestamp({ timestamp: targetTimestamp })
		await mc.mine({ blocks: 1 })
		const block = await mc.getBlock()
		expect(block.timestamp).toBe(targetTimestamp)
	})

	it('should only affect the next block, not subsequent blocks', async () => {
		const targetTimestamp = 1700000000n
		await mc.setNextBlockTimestamp({ timestamp: targetTimestamp })
		await mc.mine({ blocks: 1 })
		const block1 = await mc.getBlock()
		expect(block1.timestamp).toBe(targetTimestamp)

		// Mine another block - should use current time, not the override
		await mc.mine({ blocks: 1 })
		const block2 = await mc.getBlock()
		// The second block's timestamp should be greater than the first (uses current time)
		expect(block2.timestamp).toBeGreaterThan(targetTimestamp)
	})
})
