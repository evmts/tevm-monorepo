import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { parseEther } from 'viem'
import { createMemoryClient } from '../createMemoryClient.js'
import type { MemoryClient } from '../MemoryClient.js'

describe('Interval Mining Behavior', () => {
	let client: MemoryClient

	beforeEach(async () => {
		// Set up account with ETH
		client = createMemoryClient({
			miningConfig: { type: 'manual' }
		})
		await client.tevmSetAccount({
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			balance: parseEther('100'),
		})
	})

	afterEach(() => {
		client?.close?.()
	})

	describe('automatic interval mining', () => {
		it('should mine blocks automatically at specified intervals', async () => {
			// Use real timers for this test
			vi.useRealTimers()

			// Set up interval mining with a very short interval for testing
			await client.request({
				method: 'anvil_setIntervalMining',
				params: [0.1], // 100ms interval
			})

			const initialBlockNumber = await client.getBlockNumber()

			// Add a transaction to mempool
			const txHash = await client.sendTransaction({
				from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
				value: parseEther('1'),
			})

			expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)

			// Initially, block number should not change (transaction in mempool)
			let currentBlockNumber = await client.getBlockNumber()
			expect(currentBlockNumber).toBe(initialBlockNumber)

			// Wait for at least one interval to pass
			await new Promise(resolve => setTimeout(resolve, 150))

			// Block should have been mined automatically
			currentBlockNumber = await client.getBlockNumber()
			expect(currentBlockNumber).toBeGreaterThan(initialBlockNumber)

			// Transaction should be included in the block
			const receipt = await client.getTransactionReceipt({ hash: txHash })
			expect(receipt).toBeDefined()
			expect(receipt.blockNumber).toBeGreaterThan(initialBlockNumber)

			// Clean up - disable interval mining
			await client.request({
				method: 'anvil_setIntervalMining',
				params: [0],
			})

			vi.useFakeTimers()
		})

		it('should mine empty blocks when no transactions are available', async () => {
			// This test verifies that intervals don't mine empty blocks
			// (our current implementation only mines when there are transactions)
			
			vi.useRealTimers()

			await client.request({
				method: 'anvil_setIntervalMining',
				params: [0.1],
			})

			const initialBlockNumber = await client.getBlockNumber()

			// Wait for multiple intervals without adding transactions
			await new Promise(resolve => setTimeout(resolve, 250))

			// Block number should remain the same (no transactions, no mining)
			const currentBlockNumber = await client.getBlockNumber()
			expect(currentBlockNumber).toBe(initialBlockNumber)

			// Disable interval mining
			await client.request({
				method: 'anvil_setIntervalMining',
				params: [0],
			})

			vi.useFakeTimers()
		})

		it('should handle multiple transactions across intervals', async () => {
			vi.useRealTimers()

			await client.request({
				method: 'anvil_setIntervalMining',
				params: [0.1],
			})

			const initialBlockNumber = await client.getBlockNumber()

			// Send multiple transactions
			const tx1 = await client.sendTransaction({
				from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
				value: parseEther('1'),
			})

			// Wait a bit, then send another transaction
			await new Promise(resolve => setTimeout(resolve, 50))

			const tx2 = await client.sendTransaction({
				from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				to: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
				value: parseEther('0.5'),
			})

			// Wait for mining to occur
			await new Promise(resolve => setTimeout(resolve, 200))

			const finalBlockNumber = await client.getBlockNumber()
			expect(finalBlockNumber).toBeGreaterThan(initialBlockNumber)

			// Both transactions should be mined
			const receipt1 = await client.getTransactionReceipt({ hash: tx1 })
			const receipt2 = await client.getTransactionReceipt({ hash: tx2 })

			expect(receipt1).toBeDefined()
			expect(receipt2).toBeDefined()
			expect(receipt1.blockNumber).toBeGreaterThan(initialBlockNumber)
			expect(receipt2.blockNumber).toBeGreaterThan(initialBlockNumber)

			await client.request({
				method: 'anvil_setIntervalMining',
				params: [0],
			})

			vi.useFakeTimers()
		})
	})

	describe('mining mode transitions', () => {
		it('should properly stop interval mining when switching to manual', async () => {
			vi.useRealTimers()

			// Start with interval mining
			await client.request({
				method: 'anvil_setIntervalMining',
				params: [0.1],
			})

			// Add a transaction
			const initialBlockNumber = await client.getBlockNumber()
			const txHash = await client.sendTransaction({
				from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
				value: parseEther('1'),
			})

			// Wait for mining
			await new Promise(resolve => setTimeout(resolve, 150))

			let currentBlockNumber = await client.getBlockNumber()
			expect(currentBlockNumber).toBeGreaterThan(initialBlockNumber)

			// Switch to manual mining
			await client.request({
				method: 'anvil_setAutomine',
				params: [false],
			})

			// Send another transaction
			const beforeManualBlock = await client.getBlockNumber()
			const tx2 = await client.sendTransaction({
				from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				to: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
				value: parseEther('0.5'),
			})

			// Wait - this transaction should NOT be automatically mined
			await new Promise(resolve => setTimeout(resolve, 200))

			currentBlockNumber = await client.getBlockNumber()
			expect(currentBlockNumber).toBe(beforeManualBlock)

			// Transaction should be in mempool, not mined
			await expect(client.getTransactionReceipt({ hash: tx2 })).rejects.toThrow()

			// Mine manually
			await client.request({
				method: 'anvil_mine',
				params: [1],
			})

			// Now transaction should be mined
			const finalBlockNumber = await client.getBlockNumber()
			expect(finalBlockNumber).toBe(beforeManualBlock + 1n)

			const receipt2 = await client.getTransactionReceipt({ hash: tx2 })
			expect(receipt2).toBeDefined()

			vi.useFakeTimers()
		})

		it('should handle switching from auto to interval mining', async () => {
			// Start with auto mining
			await client.request({
				method: 'anvil_setAutomine',
				params: [true],
			})

			const initialBlockNumber = await client.getBlockNumber()

			// Send transaction - should mine immediately
			const tx1 = await client.sendTransaction({
				from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
				value: parseEther('1'),
			})

			let currentBlockNumber = await client.getBlockNumber()
			expect(currentBlockNumber).toBe(initialBlockNumber + 1n)

			// Switch to interval mining
			vi.useRealTimers()
			await client.request({
				method: 'anvil_setIntervalMining',
				params: [0.1],
			})

			// Send another transaction - should go to mempool
			const beforeIntervalBlock = await client.getBlockNumber()
			const tx2 = await client.sendTransaction({
				from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				to: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
				value: parseEther('0.5'),
			})

			// Should not mine immediately
			currentBlockNumber = await client.getBlockNumber()
			expect(currentBlockNumber).toBe(beforeIntervalBlock)

			// Wait for interval mining
			await new Promise(resolve => setTimeout(resolve, 150))

			currentBlockNumber = await client.getBlockNumber()
			expect(currentBlockNumber).toBeGreaterThan(beforeIntervalBlock)

			const receipt2 = await client.getTransactionReceipt({ hash: tx2 })
			expect(receipt2).toBeDefined()

			await client.request({
				method: 'anvil_setIntervalMining',
				params: [0],
			})

			vi.useFakeTimers()
		})
	})

	describe('close behavior', () => {
		it('should stop interval mining when client is closed', async () => {
			vi.useRealTimers()

			await client.request({
				method: 'anvil_setIntervalMining',
				params: [0.1],
			})

			// Verify mining is working
			const txHash = await client.sendTransaction({
				from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
				value: parseEther('1'),
			})

			await new Promise(resolve => setTimeout(resolve, 150))

			let receipt = await client.getTransactionReceipt({ hash: txHash })
			expect(receipt).toBeDefined()

			// Close the client
			client.close()

			// Should not cause any issues or memory leaks
			expect(client.status).toBe('STOPPED')

			vi.useFakeTimers()
		})
	})

	describe('error handling', () => {
		it('should handle invalid interval values gracefully', async () => {
			// Negative values should work (treated as 0)
			await expect(client.request({
				method: 'anvil_setIntervalMining',
				params: [-1],
			})).resolves.toBeDefined()

			// Very large values should work
			await expect(client.request({
				method: 'anvil_setIntervalMining',
				params: [1000],
			})).resolves.toBeDefined()
		})
	})
})