import { SimpleContract } from '@tevm/test-utils'
import type { Hex } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

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
		expect(blockHash.startsWith('0x')).toBe(true)
		expect(receipt).toMatchSnapshot()
	})
})
