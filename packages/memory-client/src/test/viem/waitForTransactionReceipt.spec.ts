import { SimpleContract } from '@tevm/test-utils'
import { encodeFunctionData, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
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
			addToBlockchain: true,
		})
		if (!txHash) throw new Error('txHash not found')
		const { blockHash, logs, ...receipt } = await mc.waitForTransactionReceipt({ hash: txHash })
		// Verify block hash is valid hex
		expect(blockHash.startsWith('0x')).toBe(true)
		expect(receipt).toMatchSnapshot()
		expect(logs.map((log) => ({ ...log, blockHash: 'redacted' }))).toMatchSnapshot()
	})
})
