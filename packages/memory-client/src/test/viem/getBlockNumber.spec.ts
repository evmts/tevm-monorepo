import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>

beforeEach(async () => {
	mc = createMemoryClient()
})

describe('getBlockNumber', () => {
	it('should work', async () => {
		expect(await mc.getBlockNumber({ cacheTime: 0 })).toBe(0n)
		await mc.tevmMine()
		expect(await mc.getBlockNumber({ cacheTime: 0 })).toBe(1n)
	})

	it('should update immediately with rapid mining and fetching', async () => {
		// Test for issue #1977 - cacheTime should be 0 for memory client
		// Verify block number updates immediately after mining without caching delays
		expect(await mc.getBlockNumber()).toBe(0n)

		await mc.tevmMine()
		expect(await mc.getBlockNumber()).toBe(1n)

		await mc.tevmMine()
		expect(await mc.getBlockNumber()).toBe(2n)

		// Rapid sequence: mine, fetch, mine, fetch
		await mc.tevmMine()
		const blockNumber1 = await mc.getBlockNumber()
		expect(blockNumber1).toBe(3n)

		await mc.tevmMine()
		const blockNumber2 = await mc.getBlockNumber()
		expect(blockNumber2).toBe(4n)

		// Verify no caching is happening by checking consecutive calls
		const consecutiveCall1 = await mc.getBlockNumber()
		const consecutiveCall2 = await mc.getBlockNumber()
		expect(consecutiveCall1).toBe(4n)
		expect(consecutiveCall2).toBe(4n)
	})
})
