import { SimpleContract } from '@tevm/test-utils'
import { encodeDeployData, encodeFunctionData, numberToHex } from '@tevm/utils'
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

describe('readContract', () => {
	it('should work as script', async () => {
		expect(SimpleContract.bytecode).not.toBe(SimpleContract.deployedBytecode)
		const code = encodeDeployData(SimpleContract.deploy(42n))
		expect(
			await mc.call({
				code,
				data: encodeFunctionData(SimpleContract.read.get()),
			}),
		).toEqual({ data: numberToHex(42n, { size: 32 }) })
		// expect(await mc.readContract(SimpleContract.readDeployless.get())).toBe(0n)
	})

	it('should work as call', async () => {
		const { to } = c.simpleContract.read.get()
		expect(to).toBe(c.simpleContract.address)
		expect(to).toBeDefined()
		expect(await mc.readContract(c.simpleContract.read.get())).toBe(420n)
	})
})
