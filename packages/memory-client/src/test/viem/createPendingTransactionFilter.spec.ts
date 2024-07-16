import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>

beforeEach(async () => {
	mc = createMemoryClient()
	const deployResult = await mc.tevmDeploy({
		bytecode: SimpleContract.bytecode,
		abi: SimpleContract.abi,
		args: [420n],
	})
	if (!deployResult.createdAddress) {
		throw new Error('contract never deployed')
	}
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	await mc.tevmMine()
})

describe('createPendingTransactionFilter', () => {
	it('createPendingTransactionFilter work', async () => {
		const res = await mc.createPendingTransactionFilter()
		expect(res.request).toBeInstanceOf(Function)
		expect(res.type).toBe('transaction')
		expect(res.id).toBeDefined()
		expect(res.id.startsWith('0x')).toBe(true)
	})
})
