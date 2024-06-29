import { beforeEach, describe, expect, it } from 'bun:test'
import { type TestActions, testActions } from 'viem'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('impersonateAccount', () => {
	it('should work as expected', async () => {
		const address = `0x${'42'.repeat(20)}` as const
		await mc.impersonateAccount({ address })
		expect(mc.tevm.getImpersonatedAccount()).toBe(address)
	})
})
