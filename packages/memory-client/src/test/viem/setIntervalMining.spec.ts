import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { SimpleContract } from '@tevm/contract'
import { type Hex } from '@tevm/utils'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient
let deployTxHash: Hex
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

beforeEach(async () => {
	vi.useFakeTimers()
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

afterEach(async () => {
	await mc.close?.()
	vi.runOnlyPendingTimers()
	vi.useRealTimers()
})

describe('setIntervalMining', () => {
	it('should mine blocks automatically at specified intervals', async () => {
		// Get initial block number
		const initialBlockNumber = await mc.request({ method: 'eth_blockNumber', params: [] })
		
		// Set interval mining to 1 second
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [1],
		})
		
		// Fast-forward 1 second
		vi.advanceTimersByTime(1000)
		await vi.runAllTimersAsync()
		
		// Should have mined a new block
		const newBlockNumber = await mc.request({ method: 'eth_blockNumber', params: [] })
		expect(parseInt(newBlockNumber as string, 16)).toBeGreaterThan(parseInt(initialBlockNumber as string, 16))
		
		// Fast-forward another second  
		vi.advanceTimersByTime(1000)
		await vi.runAllTimersAsync()
		
		// Should have mined another block
		const finalBlockNumber = await mc.request({ method: 'eth_blockNumber', params: [] })
		expect(parseInt(finalBlockNumber as string, 16)).toBeGreaterThan(parseInt(newBlockNumber as string, 16))
	})

	it('should mine empty blocks when mempool is empty', async () => {
		// Set interval mining
		await mc.request({
			method: 'anvil_setIntervalMining', 
			params: [1],
		})
		
		const initialBlockNumber = await mc.request({ method: 'eth_blockNumber', params: [] })
		
		// Fast-forward without any transactions
		vi.advanceTimersByTime(1000)
		await vi.runAllTimersAsync()
		
		// Should still mine an empty block
		const newBlockNumber = await mc.request({ method: 'eth_blockNumber', params: [] })
		expect(parseInt(newBlockNumber as string, 16)).toBeGreaterThan(parseInt(initialBlockNumber as string, 16))
	})

	it('should stop interval mining when set to 0', async () => {
		// Start interval mining
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [1],
		})
		
		// Stop interval mining  
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [0],
		})
		
		const blockAfterStop = await mc.request({ method: 'eth_blockNumber', params: [] })
		
		// Fast-forward time
		vi.advanceTimersByTime(2000)
		await vi.runAllTimersAsync()
		
		// Should not have mined any blocks
		const finalBlockNumber = await mc.request({ method: 'eth_blockNumber', params: [] })
		expect(finalBlockNumber).toBe(blockAfterStop)
	})

	it('should get current interval mining setting', async () => {
		// Set interval mining to 5 seconds
		await mc.request({
			method: 'anvil_setIntervalMining',
			params: [5],
		})
		
		// Get the current interval
		const interval = await mc.request({
			method: 'anvil_getIntervalMining',
			params: [],
		})
		
		expect(interval).toBe(5)
	})
})