import { SimpleContract } from '@tevm/test-utils'
import { bytesToHex } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>

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
	await mc.tevmMine()
})

describe('getBlock', () => {
	it('should work with blockHash', async () => {
		const vm = await mc.transport.tevm.getVm()
		const latest = await vm.blockchain.getCanonicalHeadBlock()
		const { hash, timestamp, transactions, stateRoot, ...result } = await mc.getBlock({
			blockHash: bytesToHex(latest.header.hash()),
			includeTransactions: true,
		})
		expect(hash.startsWith('0x')).toBe(true)
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
		expect(hash.startsWith('0x')).toBe(true)
		expect(timestamp).toBeDefined()
		expect(transactions.map((tx) => ({ ...tx, blockHash: 'redacted' }))).toMatchSnapshot()
		expect(result).toMatchSnapshot()
	})
})
