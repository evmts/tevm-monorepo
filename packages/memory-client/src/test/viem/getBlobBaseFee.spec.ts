import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any>

beforeEach(async () => {
	mc = createMemoryClient()
})

describe('getBlobBaseFee', () => {
	it.todo('should work', async () => {
		expect(await mc.getBlobBaseFee()).toBe(1n)
	})
})
