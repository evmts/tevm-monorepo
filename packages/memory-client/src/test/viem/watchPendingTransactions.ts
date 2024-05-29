import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import { encodeFunctionData, type Hex } from 'viem'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient
let deployTxHash: Hex
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
	deployTxHash = deployResult.txHash
	await mc.tevmMine()
})

describe('watchPendingTransactions', () => {
	it.todo('should work', async () => {
		const expectedTx = Promise.withResolvers()
		const unwatch = mc.watchPendingTransactions({
			poll: true,
			pollingInterval: 100,
			onTransactions: (tx) => {
				expectedTx.resolve(tx)
			},
		})
		await mc.tevmCall({
			to: c.simpleContract.address,
			data: encodeFunctionData(c.simpleContract.write.set(69n)),
			createTransaction: true,
		})
		expect(await expectedTx.promise).toMatchSnapshot()
		unwatch()
	})
})
