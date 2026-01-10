import { createTevmNode } from './createTevmNode.js'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

describe('Interval Mining', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.runOnlyPendingTimers()
		vi.useRealTimers()
	})

	it('should start interval mining when miningConfig type is interval', async () => {
		const node = createTevmNode({
			miningConfig: { type: 'interval', blockTime: 1 } // 1 second intervals
		})
		
		await node.ready()
		
		const vm = await node.getVm()
		const initialBlock = vm.blockchain.blocksByTag.get('latest')?.header.number ?? 0n
		
		// Fast-forward 1 second to trigger first mining
		vi.advanceTimersByTime(1000)
		await vi.runAllTimersAsync()
		
		// Should have mined a new block
		const newBlock = vm.blockchain.blocksByTag.get('latest')?.header.number ?? 0n
		expect(newBlock).toBeGreaterThan(initialBlock)
		
		await node.close()
	})

	it('should stop interval mining when setMiningConfig called with auto mode', async () => {
		const node = createTevmNode({
			miningConfig: { type: 'interval', blockTime: 1 } 
		})
		
		await node.ready()
		
		// Change to auto mode - should stop interval mining
		node.setMiningConfig({ type: 'auto' })
		
		const vm = await node.getVm()
		const blockAfterChange = vm.blockchain.blocksByTag.get('latest')?.header.number ?? 0n
		
		// Fast-forward time - should not mine automatically anymore
		vi.advanceTimersByTime(2000)
		await vi.runAllTimersAsync()
		
		const finalBlock = vm.blockchain.blocksByTag.get('latest')?.header.number ?? 0n
		expect(finalBlock).toBe(blockAfterChange) // No new blocks should be mined
		
		await node.close()
	})

	it('should prevent race conditions by chaining mining promises', async () => {
		const node = createTevmNode({
			miningConfig: { type: 'interval', blockTime: 0.1 } // Very fast intervals
		})
		
		await node.ready()
		
		const vm = await node.getVm()
		const initialBlock = vm.blockchain.blocksByTag.get('latest')?.header.number ?? 0n
		
		// Fast-forward multiple intervals quickly
		vi.advanceTimersByTime(500) // 5 intervals worth
		await vi.runAllTimersAsync()
		
		// Should have mined blocks sequentially, not concurrently
		const finalBlock = vm.blockchain.blocksByTag.get('latest')?.header.number ?? 0n
		expect(finalBlock).toBeGreaterThan(initialBlock)
		
		await node.close()
	})

	it('should cleanup interval mining when node is closed', async () => {
		const node = createTevmNode({
			miningConfig: { type: 'interval', blockTime: 1 }
		})
		
		await node.ready()
		await node.close()
		
		const vm = await node.getVm()
		const blockAfterClose = vm.blockchain.blocksByTag.get('latest')?.header.number ?? 0n
		
		// Fast-forward time after close - should not mine
		vi.advanceTimersByTime(2000)
		await vi.runAllTimersAsync()
		
		const finalBlock = vm.blockchain.blocksByTag.get('latest')?.header.number ?? 0n
		expect(finalBlock).toBe(blockAfterClose)
	})
})