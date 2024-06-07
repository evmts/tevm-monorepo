import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import { testActions, type TestActions } from 'viem'

let mc: MemoryClient & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('stopImpersonatingAccount', () => {
	it('should work as expected', async () => {
		const address = `0x${'ab'.repeat(20)}` as const
		await mc.impersonateAccount({ address })
		expect(mc._tevm.getImpersonatedAccount()).toBe(address)
		await mc.stopImpersonatingAccount({ address })
		expect(mc._tevm.getImpersonatedAccount()).toBeUndefined()
	})
})
