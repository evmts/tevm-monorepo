import { SimpleContract } from '@tevm/test-utils'
import { encodeFunctionData } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any>

let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

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
	c = {
		simpleContract: SimpleContract.withAddress(deployResult.createdAddress),
	}
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	await mc.tevmMine()
})

describe('estimateGas', () => {
	it('should work', async () => {
		expect(
			await mc.estimateGas({
				to: c.simpleContract.address,
				data: encodeFunctionData(c.simpleContract.write.set(69n)),
				blockTag: 'latest',
			}),
		).toBe(27_784n)
		expect(
			await mc.estimateGas({
				to: c.simpleContract.address,
				data: encodeFunctionData(c.simpleContract.write.set(69n)),
			}),
		).toBe(27_784n)
	})
})
