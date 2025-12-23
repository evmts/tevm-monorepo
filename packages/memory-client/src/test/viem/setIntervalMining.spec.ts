import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { SimpleContract } from '@tevm/contract'
import { parseEther } from 'viem'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient

beforeEach(async () => {
	mc = createMemoryClient({
		miningConfig: { type: 'manual' }
	})
	
	// Set up an account with some ETH
	await mc.tevmSetAccount({
		address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
		balance: parseEther('100'),
	})
})

afterEach(() => {
	mc?.close?.()
})

describe('setIntervalMining (anvil_setIntervalMining)', () => {
	it('should set interval mining with positive block time', async () => {
		// Set interval mining to 5 seconds
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [5],
		})

		// Check the mining config was updated
		const intervalMining = await mc.request({
			method: 'anvil_getIntervalMining',
			params: [],
		})
		
		expect(intervalMining).toBe(5)
	})

	it('should set interval mining to disabled (blockTime 0)', async () => {
		// First enable interval mining
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [5],
		})

		// Then disable it
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [0],
		})

		const intervalMining = await mc.request({
			method: 'anvil_getIntervalMining',
			params: [],
		})
		
		expect(intervalMining).toBe(0)
	})

	it('should handle fractional block times', async () => {
		// Set interval mining to 0.5 seconds
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [0.5],
		})

		const intervalMining = await mc.request({
			method: 'anvil_getIntervalMining',
			params: [],
		})
		
		expect(intervalMining).toBe(0.5)
	})

	it('should transition between different mining modes', async () => {
		// Start with manual (set in beforeEach)
		let automine = await mc.request({
			method: 'anvil_getAutomine',
			params: [],
		})
		expect(automine).toBe(false)

		// Switch to interval mining
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [2],
		})

		let intervalMining = await mc.request({
			method: 'anvil_getIntervalMining',
			params: [],
		})
		expect(intervalMining).toBe(2)

		// Switch to auto mining
		await mc.request({
			method: 'anvil_setAutomine',
			params: [true],
		})

		automine = await mc.request({
			method: 'anvil_getAutomine',
			params: [],
		})
		expect(automine).toBe(true)

		// Switch back to interval mining
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [1],
		})

		intervalMining = await mc.request({
			method: 'anvil_getIntervalMining',
			params: [],
		})
		expect(intervalMining).toBe(1)
	})

	it('should handle transactions with interval mining enabled', async () => {
		// Enable interval mining with a long interval so we can test mempool behavior
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [10], // 10 seconds - long enough for our test
		})

		const initialBlockNumber = await mc.getBlockNumber()

		// Send a raw transaction that will go to mempool
		const txHash = await mc.sendTransaction({
			from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
			value: parseEther('1'),
		})

		expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)

		// Block number should not have changed yet (transaction in mempool)
		const blockNumberAfterTx = await mc.getBlockNumber()
		expect(blockNumberAfterTx).toBe(initialBlockNumber)

		// Manually mine to process the transaction
		await mc.request({
			method: 'anvil_mine',
			params: [1],
		})

		const finalBlockNumber = await mc.getBlockNumber()
		expect(finalBlockNumber).toBe(initialBlockNumber + 1n)

		// Transaction should now be included
		const receipt = await mc.getTransactionReceipt({ hash: txHash })
		expect(receipt).toBeDefined()
		expect(receipt.blockNumber).toBe(finalBlockNumber)
	})

	it('should work with tevmCall transactions in interval mode', async () => {
		// Deploy a simple contract
		const deployResult = await mc.tevmDeploy({
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [420n],
			addToBlockchain: true, // Deploy immediately
		})
		
		expect(deployResult.createdAddress).toBeDefined()
		const contractAddress = deployResult.createdAddress!

		// Enable interval mining
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [10],
		})

		const initialBlockNumber = await mc.getBlockNumber()

		// Make a contract call that creates a transaction
		const callResult = await mc.tevmCall({
			to: contractAddress,
			data: SimpleContract.write.set(100n).data,
			from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			addToMempool: true,
		})

		expect(callResult.txHash).toBeDefined()
		expect(callResult.errors).toBeUndefined()

		// Block should not have advanced yet
		const blockAfterCall = await mc.getBlockNumber()
		expect(blockAfterCall).toBe(initialBlockNumber)

		// Mine manually to process the transaction
		await mc.request({
			method: 'anvil_mine',
			params: [1],
		})

		const finalBlockNumber = await mc.getBlockNumber()
		expect(finalBlockNumber).toBe(initialBlockNumber + 1n)

		// Verify the contract state was updated
		const readResult = await mc.tevmCall({
			to: contractAddress,
			data: SimpleContract.read.get().data,
		})

		expect(readResult.errors).toBeUndefined()
		// The return data should be the value we set (100n), encoded as bytes32
		expect(readResult.rawData).toBe('0x0000000000000000000000000000000000000000000000000000000000000064')
	})

	it('should handle rapid successive setIntervalMining calls', async () => {
		// Rapid successive calls should not cause issues
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [1],
		})

		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [2],
		})

		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [0],
		})

		const finalInterval = await mc.request({
			method: 'anvil_getIntervalMining',
			params: [],
		})

		expect(finalInterval).toBe(0)
	})
})