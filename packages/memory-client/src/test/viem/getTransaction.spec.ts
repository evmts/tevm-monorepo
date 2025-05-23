import { SimpleContract } from '@tevm/test-utils'
import { type Hex, bytesToHex } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
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

describe('getTransaction', () => {
	it('should work', async () => {
		const { blockHash, ...tx } = await mc.getTransaction({ hash: deployTxHash })
		expect(blockHash.startsWith('0x')).toBe(true)
		const vm = await mc.transport.tevm.getVm()
		const block = await vm.blockchain.getCanonicalHeadBlock()
		expect(blockHash).toEqual(bytesToHex(block.header.hash()))
		expect(tx).toMatchSnapshot()
	})
})
