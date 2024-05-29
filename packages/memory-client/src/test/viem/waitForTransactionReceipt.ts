import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import { bytesToHex, encodeFunctionData, type Hex } from 'viem'
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
		const vm = await mc._tevm.getVm()
		const block = await vm.blockchain.getCanonicalHeadBlock()
		expect(blockHash).toBe(bytesToHex(block.header.hash()))
		expect(receipt).toMatchSnapshot()
		expect(logs.map((log) => ({ ...log, blockHash: 'redacted' }))).toMatchSnapshot()
	})
})
