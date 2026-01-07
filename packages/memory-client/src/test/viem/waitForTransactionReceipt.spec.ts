import { SimpleContract } from '@tevm/test-utils'
import { bytesToHex, encodeFunctionData } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { testActions } from '../../createClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
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

describe('waitForTransactionReceipt', () => {
	it('waitForTransactionReceipt hould work', async () => {
		const { txHash } = await mc.tevmCall({
			to: c.simpleContract.address,
			data: encodeFunctionData(c.simpleContract.write.set(69n)),
			createTransaction: true,
		})
		if (!txHash) throw new Error('txHash not found')
		await mc.mine({ blocks: 1 })
		const { blockHash, logs, ...receipt } = await mc.waitForTransactionReceipt({ hash: txHash })
		const vm = await mc.transport.tevm.getVm()
		const block = await vm.blockchain.getCanonicalHeadBlock()
		expect(blockHash).toBe(bytesToHex(block.header.hash()))
		expect(receipt).toMatchSnapshot()
		expect(logs.map((log) => ({ ...log, blockHash: 'redacted' }))).toMatchSnapshot()
	})
})
