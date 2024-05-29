import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import { bytesToHex, type Hex } from 'viem'
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

describe('getBlock', () => {
	it('should work with blockHash', async () => {
		const vm = await mc._tevm.getVm()
		const latest = await vm.blockchain.getCanonicalHeadBlock()
		const { hash, timestamp, transactions, ...result } = await mc.getBlock({
			blockHash: bytesToHex(latest.header.hash()),
			includeTransactions: true,
		})
		expect(hash).toStartWith('0x')
		expect(timestamp).toBeDefined()
		expect(transactions.map((tx) => ({ ...tx, blockHash: 'redacted' }))).toMatchSnapshot()
		expect(result).toMatchSnapshot()
	})

	// this is broken has a bug
	it.todo('should work with blocknumber', async () => {
		const { timestamp, hash, transactions, ...result } = await mc.getBlock({
			blockNumber: 0n,
			includeTransactions: true,
		})
		expect(hash).toStartWith('0x')
		expect(timestamp).toBeDefined()
		expect(transactions.map((tx) => ({ ...tx, blockHash: 'redacted' }))).toMatchSnapshot()
		expect(result).toMatchSnapshot()
	})
})
