import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient

beforeEach(async () => {
	mc = createMemoryClient()
})

describe('setIntervalMining', () => {
	it('should enable interval mining and create empty blocks', async () => {
		// Enable interval mining with 100ms intervals
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [0.1], // 100ms
		})

		// Get initial block number
		const initialBlockNumber = await mc.request({
			method: 'eth_blockNumber',
		})

		// Wait for at least 2 mining intervals (200ms + buffer)
		await new Promise(resolve => setTimeout(resolve, 350))

		// Check that new blocks were created even without transactions
		const finalBlockNumber = await mc.request({
			method: 'eth_blockNumber',
		})

		expect(Number(finalBlockNumber)).toBeGreaterThan(Number(initialBlockNumber))
		
		// Clean up
		mc.close()
	}, 10000)

	it('should disable interval mining when set to 0', async () => {
		// Enable interval mining first
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [0.1], // 100ms
		})

		const initialBlockNumber = await mc.request({
			method: 'eth_blockNumber',
		})

		// Wait for a block to be mined
		await new Promise(resolve => setTimeout(resolve, 150))

		// Disable interval mining
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [0],
		})

		const disabledBlockNumber = await mc.request({
			method: 'eth_blockNumber',
		})

		// Wait to ensure no more blocks are mined
		await new Promise(resolve => setTimeout(resolve, 200))

		const finalBlockNumber = await mc.request({
			method: 'eth_blockNumber',
		})

		// Should have mined at least one block initially
		expect(Number(disabledBlockNumber)).toBeGreaterThan(Number(initialBlockNumber))
		// Should not have mined any blocks after disabling
		expect(Number(finalBlockNumber)).toBe(Number(disabledBlockNumber))

		// Clean up
		mc.close()
	}, 10000)

	it('should get current interval mining status', async () => {
		// Check default status (should be 0 for auto mining)
		const initialStatus = await mc.request({
			method: 'anvil_getIntervalMining',
		})
		expect(initialStatus).toBe(0)

		// Set interval mining
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [5],
		})

		// Check updated status
		const updatedStatus = await mc.request({
			method: 'anvil_getIntervalMining',
		})
		expect(updatedStatus).toBe(5)

		// Clean up
		mc.close()
	})

	it('should work with transactions during interval mining', async () => {
		// Enable interval mining
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [0.2], // 200ms intervals
		})

		// Send a transaction 
		const txHash = await mc.request({
			method: 'eth_sendTransaction',
			params: [{
				from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
				to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
				value: '0x1',
			}]
		})

		// Wait for interval mining to include the transaction
		await new Promise(resolve => setTimeout(resolve, 350))

		// Check that transaction was included
		const receipt = await mc.request({
			method: 'eth_getTransactionReceipt',
			params: [txHash]
		})

		expect(receipt).toBeTruthy()
		expect(receipt.status).toBe('0x1')

		// Clean up
		mc.close()
	}, 10000)
})