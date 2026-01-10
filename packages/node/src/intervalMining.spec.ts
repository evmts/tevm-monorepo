import { createTevmNode } from './createTevmNode.js'
import { describe, expect, it, vi } from 'vitest'

describe('Interval Mining', () => {
	it('should create empty blocks when no transactions are in mempool', async () => {
		// Use a very short interval for testing
		const node = createTevmNode({ 
			miningConfig: { type: 'interval', blockTime: 0.1 } // 100ms
		})
		await node.ready()

		// Get initial block number
		const vm = await node.getVm()
		const initialBlock = await vm.blockchain.getCanonicalHeadBlock()
		const initialBlockNumber = Number(initialBlock.header.number)

		// Wait for at least 2 interval mining cycles (200ms + buffer)
		await new Promise(resolve => setTimeout(resolve, 350))

		// Check that new blocks were created even without transactions
		const finalBlock = await vm.blockchain.getCanonicalHeadBlock()
		const finalBlockNumber = Number(finalBlock.header.number)

		expect(finalBlockNumber).toBeGreaterThan(initialBlockNumber)
		
		// Clean up
		node.close()
	}, 10000) // 10 second timeout

	it('should stop interval mining when setMiningConfig is called with manual mode', async () => {
		const node = createTevmNode({ 
			miningConfig: { type: 'interval', blockTime: 0.1 }
		})
		await node.ready()

		const vm = await node.getVm()
		const initialBlock = await vm.blockchain.getCanonicalHeadBlock()
		const initialBlockNumber = Number(initialBlock.header.number)

		// Wait for a block to be mined
		await new Promise(resolve => setTimeout(resolve, 150))

		// Stop interval mining
		node.setMiningConfig({ type: 'manual' })
		
		// Get block number after stopping
		const stoppedBlock = await vm.blockchain.getCanonicalHeadBlock()
		const stoppedBlockNumber = Number(stoppedBlock.header.number)

		// Wait some more time to ensure no more blocks are mined
		await new Promise(resolve => setTimeout(resolve, 200))

		const finalBlock = await vm.blockchain.getCanonicalHeadBlock()
		const finalBlockNumber = Number(finalBlock.header.number)

		// Should have mined at least one block initially
		expect(stoppedBlockNumber).toBeGreaterThan(initialBlockNumber)
		// Should not have mined any blocks after stopping
		expect(finalBlockNumber).toBe(stoppedBlockNumber)

		// Clean up
		node.close()
	}, 10000)

	it('should clean up timers when close() is called', async () => {
		const node = createTevmNode({ 
			miningConfig: { type: 'interval', blockTime: 0.1 }
		})
		await node.ready()

		const vm = await node.getVm()
		const initialBlock = await vm.blockchain.getCanonicalHeadBlock()
		const initialBlockNumber = Number(initialBlock.header.number)

		// Wait for a block to be mined
		await new Promise(resolve => setTimeout(resolve, 150))

		// Close the node
		node.close()
		
		// Get block number after closing
		const closedBlock = await vm.blockchain.getCanonicalHeadBlock()
		const closedBlockNumber = Number(closedBlock.header.number)

		// Wait some more time to ensure no more blocks are mined
		await new Promise(resolve => setTimeout(resolve, 200))

		const finalBlock = await vm.blockchain.getCanonicalHeadBlock()
		const finalBlockNumber = Number(finalBlock.header.number)

		// Should have mined at least one block initially
		expect(closedBlockNumber).toBeGreaterThan(initialBlockNumber)
		// Should not have mined any blocks after closing
		expect(finalBlockNumber).toBe(closedBlockNumber)
	}, 10000)

	it('should switch from auto to interval mining', async () => {
		const node = createTevmNode({ 
			miningConfig: { type: 'auto' }
		})
		await node.ready()

		// Switch to interval mining
		node.setMiningConfig({ type: 'interval', blockTime: 0.1 })

		const vm = await node.getVm()
		const initialBlock = await vm.blockchain.getCanonicalHeadBlock()
		const initialBlockNumber = Number(initialBlock.header.number)

		// Wait for interval mining to create blocks
		await new Promise(resolve => setTimeout(resolve, 250))

		const finalBlock = await vm.blockchain.getCanonicalHeadBlock()
		const finalBlockNumber = Number(finalBlock.header.number)

		// Should have created blocks via interval mining
		expect(finalBlockNumber).toBeGreaterThan(initialBlockNumber)
		
		// Clean up
		node.close()
	}, 10000)
})