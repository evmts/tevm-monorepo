import { beforeEach, describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/contract'
import { type TestActions, testActions } from 'viem'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient & TestActions
const c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setCode', () => {
	it('should work as expected', async () => {
		await mc.setCode({
			address: c.simpleContract.address,
			bytecode: c.simpleContract.deployedBytecode,
		})
		expect(await mc.getBytecode({ address: c.simpleContract.address })).toBe(c.simpleContract.deployedBytecode)
	})
})
