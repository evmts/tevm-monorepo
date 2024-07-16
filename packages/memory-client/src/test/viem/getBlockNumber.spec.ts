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
})
