import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilRemoveBlockTimestampIntervalJsonRpcProcedure } from './anvilRemoveBlockTimestampIntervalProcedure.js'
import { anvilSetBlockTimestampIntervalJsonRpcProcedure } from './anvilSetBlockTimestampIntervalProcedure.js'

describe('anvilRemoveBlockTimestampIntervalJsonRpcProcedure', () => {
	it('should remove the block timestamp interval', async () => {
		const node = createTevmNode()

		// First set an interval
		const setProcedure = anvilSetBlockTimestampIntervalJsonRpcProcedure(node)
		await setProcedure({
			method: 'anvil_setBlockTimestampInterval',
			params: ['0xc'], // 12 seconds
			jsonrpc: '2.0',
		})

		expect(node.getBlockTimestampInterval()).toBe(12n)

		// Then remove it
		const removeProcedure = anvilRemoveBlockTimestampIntervalJsonRpcProcedure(node)
		const result = await removeProcedure({
			method: 'anvil_removeBlockTimestampInterval',
			params: [],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_removeBlockTimestampInterval')
		expect(result.result).toBe(true)
		expect(node.getBlockTimestampInterval()).toBe(undefined)
	})

	it('should return true even if no interval was set', async () => {
		const node = createTevmNode()
		const procedure = anvilRemoveBlockTimestampIntervalJsonRpcProcedure(node)

		expect(node.getBlockTimestampInterval()).toBe(undefined)

		const result = await procedure({
			method: 'anvil_removeBlockTimestampInterval',
			params: [],
			jsonrpc: '2.0',
		})

		expect(result.result).toBe(true)
		expect(node.getBlockTimestampInterval()).toBe(undefined)
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode()
		const procedure = anvilRemoveBlockTimestampIntervalJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_removeBlockTimestampInterval',
			params: [],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
	})
})
