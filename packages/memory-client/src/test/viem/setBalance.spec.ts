import { type TestActions, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setBalance', () => {
	it('should work as expected', async () => {
		const address = `0x${'a'.repeat(40)}` as const
		const balance = 420n
		await mc.setBalance({ address, value: balance })
		expect(await mc.getBalance({ address })).toBe(balance)
	})
})
