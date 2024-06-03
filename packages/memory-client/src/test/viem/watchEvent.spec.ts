import { beforeEach, describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/test-utils'
import { encodeFunctionData } from 'viem'
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

describe('watchEvent', () => {
	it.todo('should work', async () => {
		const expectedEvent = Promise.withResolvers()
		const unwatch = mc.watchEvent({
			poll: true,
			pollingInterval: 100,
			onLogs: (event) => {
				expectedEvent.resolve(event)
			},
		})
		await mc.tevmCall({
			to: c.simpleContract.address,
			data: encodeFunctionData(c.simpleContract.write.set(69n)),
			createTransaction: true,
		})
		expect(await expectedEvent.promise).toMatchSnapshot()
		unwatch()
	})
})