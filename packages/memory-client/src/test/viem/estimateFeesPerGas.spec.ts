import { beforeEach, describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/test-utils'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc = createMemoryClient()

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

describe('estimateFeesPerGas', () => {
	it('should work', async () => {
		const block = await mc.getBlock()
		const { maxFeePerGas, maxPriorityFeePerGas } = await mc.estimateFeesPerGas()
		if (block.baseFeePerGas === null) throw new Error('baseFeePerGas is null')
		expect(maxFeePerGas).toBe(1000000001n)
		expect(maxPriorityFeePerGas).toMatchSnapshot()
	})
})
