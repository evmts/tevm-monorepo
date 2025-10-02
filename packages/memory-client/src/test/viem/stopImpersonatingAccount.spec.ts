import { getAddress, type TestActions, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('stopImpersonatingAccount', () => {
	it('should work as expected', async () => {
		const address = `0x${'ab'.repeat(20)}` as const
		await mc.impersonateAccount({ address })
		expect(mc.transport.tevm.getImpersonatedAccount()).toBe(getAddress(address))
		await mc.stopImpersonatingAccount({ address })
		expect(mc.transport.tevm.getImpersonatedAccount()).toBeUndefined()
	})
})
