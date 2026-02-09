import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any>

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
	await mc.tevmMine()
})

describe('getBlockTransactionCount', () => {
	it('should work', async () => {
		// Deploy is added to blockchain (block 1), then tevmMine() creates block 2 (empty).
		// The deploy tx is in block 1.
		expect(await mc.getBlockTransactionCount({ blockNumber: 1n })).toBe(1)
		// Latest block (block 2) is empty
		expect(await mc.getBlockTransactionCount({ blockTag: 'latest' })).toBe(0)
	})
})
