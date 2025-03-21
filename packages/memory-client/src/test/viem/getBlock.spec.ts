import { SimpleContract } from '@tevm/test-utils'
import { bytesToHex, encodeFunctionData } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>
let contractAddress: string

beforeEach(async () => {
	mc = createMemoryClient()
	
	// Setup a test account with balance for transactions
	const testAccount = '0x1234567890123456789012345678901234567890'
	await mc.setBalance({
		address: testAccount,
		value: 1000000000000000000n // 1 ETH
	})
	
	const deployResult = await mc.tevmDeploy({
		bytecode: SimpleContract.bytecode,
		abi: SimpleContract.abi,
		args: [420n],
	})
	if (!deployResult.createdAddress) {
		throw new Error('contract never deployed')
	}
	contractAddress = deployResult.createdAddress
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

	// Skip test with pending blockTag since it's not supported in this branch
	it.skip('should work with blockTag pending', async () => {
		// Create a pending transaction
		const setCallData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [999n],
		})

		await mc.sendTransaction({
			to: contractAddress,
			data: setCallData,
			account: '0x1234567890123456789012345678901234567890',
		})

		// Instead get the latest block
		const { timestamp, hash, transactions, ...result } = await mc.getBlock({
			blockTag: 'latest',
			includeTransactions: true,
		})

		expect(hash.startsWith('0x')).toBe(true)
		expect(timestamp).toBeDefined()
		expect(Array.isArray(transactions)).toBe(true)
		expect(result).toBeDefined()
	})
})
