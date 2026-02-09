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
		addToBlockchain: true,
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

describe('getTransactionConfirmations', () => {
	it('should work', async () => {
		// Deploy is added to blockchain (block 1), then tevmMine() creates block 2
		// Confirmations = latest block - tx block + 1 = 2 - 1 + 1 = 2
		expect(await mc.getTransactionConfirmations({ hash: deployTxHash })).toBe(2n)
	})
})
