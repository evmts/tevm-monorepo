import { beforeEach, describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/test-utils'
import { encodeDeployData, encodeFunctionData, numberToHex } from 'viem'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient
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

describe('readContract', () => {
	it('should work as script', async () => {
		expect(SimpleContract.bytecode).not.toBe(SimpleContract.deployedBytecode)
		const call = SimpleContract.readDeployless.get()
		expect(call.code).toBe(SimpleContract.deployedBytecode)
		expect(
			await mc.call({
				code: encodeDeployData({
					args: [420n],
					bytecode: SimpleContract.bytecode,
					abi: SimpleContract.abi,
				}),
				data: encodeFunctionData(SimpleContract.readDeployless.get()),
			}),
		).toEqual({ data: numberToHex(420n, { size: 32 }) })
		// expect(await mc.readContract(SimpleContract.readDeployless.get())).toBe(0n)
	})

	it('should work as call', async () => {
		const { to } = c.simpleContract.read.get()
		expect(to).toBe(c.simpleContract.address)
		expect(to).toBeDefined()
		expect(await mc.readContract(c.simpleContract.read.get())).toBe(420n)
	})
})
