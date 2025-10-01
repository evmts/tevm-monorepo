import { type TestActions, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setCoinbase', () => {
	it('should work as expected', async () => {
		await mc.setCoinbase({ address: `0x${'01'.repeat(20)}` })
		expect(await mc.request({ method: 'eth_coinbase' })).toMatchSnapshot()
	})
})
