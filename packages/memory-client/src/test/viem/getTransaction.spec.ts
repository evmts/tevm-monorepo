import { SimpleContract } from '@tevm/test-utils'
import { bytesToHex, type Hex } from 'viem'
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

describe('getTransaction', () => {
	it('should work', async () => {
		const { blockHash, ...tx } = await mc.getTransaction({ hash: deployTxHash })
		expect(blockHash.startsWith('0x')).toBe(true)
		const vm = await mc.transport.tevm.getVm()
		// Deploy auto-mines to block 1, the tx is in block 1 not the canonical head (block 2)
		const block = await vm.blockchain.getBlock(1n)
		expect(blockHash).toEqual(bytesToHex(block.header.hash()))
		expect(tx).toMatchSnapshot()
	})
})
