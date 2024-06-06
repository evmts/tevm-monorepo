import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient
beforeEach(async () => {
	mc = createMemoryClient()
})

describe('getBlockNumber', () => {
	it('should work', async () => {
		expect(await mc.getBlockNumber()).toBe(0n)
		await mc.tevmMine()
		expect(await mc.getBlockNumber()).toBe(1n)
	})
})
