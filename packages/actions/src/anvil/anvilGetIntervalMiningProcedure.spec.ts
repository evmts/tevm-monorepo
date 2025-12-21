import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilGetIntervalMiningJsonRpcProcedure } from './anvilGetIntervalMiningProcedure.js'

describe('anvilGetIntervalMiningJsonRpcProcedure', () => {
	it('should return the interval when in interval mode', async () => {
		const node = createTevmNode({ miningConfig: { type: 'interval', blockTime: 5 } })
		const procedure = anvilGetIntervalMiningJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_getIntervalMining',
			params: [{}],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_getIntervalMining')
		expect(result.result).toBe(5)
	})

	it('should return 0 when not in interval mode (auto)', async () => {
		const node = createTevmNode({ miningConfig: { type: 'auto' } })
		const procedure = anvilGetIntervalMiningJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_getIntervalMining',
			params: [{}],
			jsonrpc: '2.0',
		})

		expect(result.result).toBe(0)
	})

	it('should return 0 when not in interval mode (manual)', async () => {
		const node = createTevmNode({ miningConfig: { type: 'manual' } })
		const procedure = anvilGetIntervalMiningJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_getIntervalMining',
			params: [{}],
			jsonrpc: '2.0',
		})

		expect(result.result).toBe(0)
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode({ miningConfig: { type: 'interval', blockTime: 10 } })
		const procedure = anvilGetIntervalMiningJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_getIntervalMining',
			params: [{}],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
		expect(result.result).toBe(10)
	})
})
