import type { TestActions } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { testActions } from '../../createClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('impersonateAccount', () => {
	it('should work as expected', async () => {
		const address = `0x${'42'.repeat(20)}` as const
		await mc.impersonateAccount({ address })
		expect(mc.transport.tevm.getImpersonatedAccount()).toBe(address)
	})
})
