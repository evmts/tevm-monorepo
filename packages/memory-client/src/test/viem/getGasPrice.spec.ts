import { parseGwei } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any>

beforeEach(async () => {
	mc = createMemoryClient()
})

describe('getGasPrice', () => {
	it('should work', async () => {
		expect(await mc.getGasPrice()).toBe(parseGwei('1'))
	})
})
