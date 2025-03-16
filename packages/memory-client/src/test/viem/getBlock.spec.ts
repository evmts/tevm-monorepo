import { SimpleContract } from '@tevm/test-utils'
import { bytesToHex, encodeFunctionData } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>
let contractAddress: string

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

	it('should work with blockTag pending', async () => {
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

		// Get the pending block
		const { timestamp, hash, transactions, ...result } = await mc.getBlock({
			blockTag: 'pending',
			includeTransactions: true,
		})

		expect(hash.startsWith('0x')).toBe(true)
		expect(timestamp).toBeDefined()
		expect(Array.isArray(transactions)).toBe(true)
		expect(transactions.length).toBeGreaterThan(0)
		expect(result).toBeDefined()
	})

	it('should show pending transactions in pending block', async () => {
		// Create multiple pending transactions
		const setCallData1 = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [111n],
		})

		const setCallData2 = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [222n],
		})

		const tx1 = await mc.sendTransaction({
			to: contractAddress,
			data: setCallData1,
			account: '0x1234567890123456789012345678901234567890',
		})

		const tx2 = await mc.sendTransaction({
			to: contractAddress,
			data: setCallData2,
			account: '0x1234567890123456789012345678901234567890',
		})

		// Get the pending block with transactions
		const pendingBlock = await mc.getBlock({
			blockTag: 'pending',
			includeTransactions: true,
		})

		// Check that transactions are included
		expect(pendingBlock.transactions.length).toBe(2)

		// Find our transactions in the block
		const pendingTxHashes = pendingBlock.transactions.map((tx) => (typeof tx === 'string' ? tx : tx.hash))

		expect(pendingTxHashes).toContain(tx1)
		expect(pendingTxHashes).toContain(tx2)

		// Get the latest block
		const latestBlock = await mc.getBlock({
			blockTag: 'latest',
			includeTransactions: true,
		})

		// Latest block should not include our transactions
		const latestTxHashes = latestBlock.transactions.map((tx) => (typeof tx === 'string' ? tx : tx.hash))

		expect(latestTxHashes).not.toContain(tx1)
		expect(latestTxHashes).not.toContain(tx2)

		// Mine the block
		await mc.tevmMine()

		// Get new latest block
		const newLatestBlock = await mc.getBlock({
			blockTag: 'latest',
			includeTransactions: true,
		})

		// New latest block should include our transactions
		const newLatestTxHashes = newLatestBlock.transactions.map((tx) => (typeof tx === 'string' ? tx : tx.hash))

		expect(newLatestTxHashes).toContain(tx1)
		expect(newLatestTxHashes).toContain(tx2)
	})

	it('should update pending block parent hash after mining', async () => {
		// Get initial blocks
		const initialLatestBlock = await mc.getBlock({ blockTag: 'latest' })
		const initialPendingBlock = await mc.getBlock({ blockTag: 'pending' })

		// Pending block's parent hash should match latest block's hash
		expect(initialPendingBlock.parentHash).toBe(initialLatestBlock.hash)

		// Create a transaction and mine it
		const setCallData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [333n],
		})

		await mc.sendTransaction({
			to: contractAddress,
			data: setCallData,
			account: '0x1234567890123456789012345678901234567890',
		})

		await mc.tevmMine()

		// Get updated blocks
		const newLatestBlock = await mc.getBlock({ blockTag: 'latest' })
		const newPendingBlock = await mc.getBlock({ blockTag: 'pending' })

		// New pending block's parent hash should match new latest block's hash
		expect(newPendingBlock.parentHash).toBe(newLatestBlock.hash)

		// New latest block should be different from initial latest block
		expect(newLatestBlock.hash).not.toBe(initialLatestBlock.hash)
		expect(newLatestBlock.number).toBe(initialLatestBlock.number + 1n)
	})
})
