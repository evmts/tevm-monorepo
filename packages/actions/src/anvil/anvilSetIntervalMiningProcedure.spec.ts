import { createTevmNode } from '@tevm/node'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { anvilSetIntervalMiningJsonRpcProcedure } from './anvilSetIntervalMiningProcedure.js'

// Mock timers for precise timing control in tests
vi.useFakeTimers()

describe('anvilSetIntervalMiningJsonRpcProcedure', () => {
	beforeEach(() => {
		vi.clearAllTimers()
	})
	it('should set interval mining with non-zero interval', async () => {
		const node = createTevmNode({ miningConfig: { type: 'auto' } })
		const procedure = anvilSetIntervalMiningJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_setIntervalMining',
			params: [5],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_setIntervalMining')
		expect(result.result).toBe(null)
		expect(node.miningConfig).toEqual({ type: 'interval', blockTime: 5 })
	})

	it('should set interval mining to 0 (manual mining via anvil_mine only)', async () => {
		const node = createTevmNode({ miningConfig: { type: 'auto' } })
		const procedure = anvilSetIntervalMiningJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_setIntervalMining',
			params: [0],
			jsonrpc: '2.0',
		})

		expect(result.result).toBe(null)
		expect(node.miningConfig).toEqual({ type: 'interval', blockTime: 0 })
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode()
		const procedure = anvilSetIntervalMiningJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_setIntervalMining',
			params: [10],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
		expect(node.miningConfig).toEqual({ type: 'interval', blockTime: 10 })
	})

	it('should start interval mining when setting non-zero interval', async () => {
		const node = createTevmNode({ miningConfig: { type: 'manual' } })
		await node.ready()
		
		const procedure = anvilSetIntervalMiningJsonRpcProcedure(node)
		
		// Initially not running
		expect(node.isIntervalMiningRunning()).toBe(false)

		await procedure({
			method: 'anvil_setIntervalMining',
			params: [1], // 1 second interval
			jsonrpc: '2.0',
		})

		// Should now be running
		expect(node.isIntervalMiningRunning()).toBe(true)
		expect(node.miningConfig).toEqual({ type: 'interval', blockTime: 1 })

		node.stopIntervalMining()
	})

	it('should stop interval mining when setting zero interval', async () => {
		const node = createTevmNode({ miningConfig: { type: 'interval', blockTime: 1 } })
		await node.ready()
		
		const procedure = anvilSetIntervalMiningJsonRpcProcedure(node)
		
		// Start interval mining
		node.startIntervalMining()
		expect(node.isIntervalMiningRunning()).toBe(true)

		// Set interval to 0
		await procedure({
			method: 'anvil_setIntervalMining',
			params: [0],
			jsonrpc: '2.0',
		})

		// Should now be stopped
		expect(node.isIntervalMiningRunning()).toBe(false)
		expect(node.miningConfig).toEqual({ type: 'interval', blockTime: 0 })
	})

	it('should stop previous interval mining before starting new one', async () => {
		const node = createTevmNode({ miningConfig: { type: 'interval', blockTime: 1 } })
		await node.ready()
		
		const procedure = anvilSetIntervalMiningJsonRpcProcedure(node)
		
		// Start with 1 second interval
		node.startIntervalMining()
		expect(node.isIntervalMiningRunning()).toBe(true)

		// Change to 0.5 second interval
		await procedure({
			method: 'anvil_setIntervalMining',
			params: [0.5],
			jsonrpc: '2.0',
		})

		// Should still be running but with new config
		expect(node.isIntervalMiningRunning()).toBe(true)
		expect(node.miningConfig).toEqual({ type: 'interval', blockTime: 0.5 })

		node.stopIntervalMining()
	})
})
