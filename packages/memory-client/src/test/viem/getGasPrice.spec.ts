import { beforeEach, describe, expect, it } from 'bun:test'
import { parseGwei } from 'viem'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient

beforeEach(async () => {
	mc = createMemoryClient()
})

describe('getGasPrice', () => {
	it('should work', async () => {
		expect(await mc.getGasPrice()).toBe(parseGwei('1'))
	})
})
