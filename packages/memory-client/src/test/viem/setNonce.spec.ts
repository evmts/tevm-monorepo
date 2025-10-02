import { type TestActions, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setNonce', () => {
	it('should work as expected', async () => {
		const address = `0x${'01'.repeat(20)}` as const
		const nonce = 420
		await mc.setNonce({ address, nonce })
		expect(await mc.tevmGetAccount({ address })).toMatchObject({ nonce: BigInt(nonce) })
	})
})
