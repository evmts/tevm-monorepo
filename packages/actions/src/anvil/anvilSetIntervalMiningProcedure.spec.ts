import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetIntervalMiningJsonRpcProcedure } from './anvilSetIntervalMiningProcedure.js'

describe('anvilSetIntervalMiningJsonRpcProcedure', () => {
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
		expect(node.miningConfig).toEqual({ type: 'manual' })
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
})
