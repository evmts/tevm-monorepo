import { beforeEach, describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/test-utils'
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

describe('estimateMaxPriorityFeePerGas', () => {
	it('should work', async () => {
		expect(await mc.estimateMaxPriorityFeePerGas()).toMatchSnapshot()
	})
})
