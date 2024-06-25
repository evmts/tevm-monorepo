import { beforeEach, describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/test-utils'
import type { Hex } from 'viem'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>
let deployTxHash: Hex

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
	deployTxHash = deployResult.txHash
	await mc.tevmMine()
})

describe('getTransactionReceipt', () => {
	it('should work', async () => {
		const { blockHash, ...receipt } = await mc.getTransactionReceipt({ hash: deployTxHash })
		expect(blockHash).toStartWith('0x')
		expect(receipt).toMatchSnapshot()
	})
})
