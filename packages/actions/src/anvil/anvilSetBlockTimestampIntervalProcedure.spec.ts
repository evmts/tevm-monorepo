import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetBlockTimestampIntervalJsonRpcProcedure } from './anvilSetBlockTimestampIntervalProcedure.js'

describe('anvilSetBlockTimestampIntervalJsonRpcProcedure', () => {
	it('should set the block timestamp interval', async () => {
		const node = createTevmNode()
		const procedure = anvilSetBlockTimestampIntervalJsonRpcProcedure(node)

		const interval = 12n // 12 seconds

		const result = await procedure({
			method: 'anvil_setBlockTimestampInterval',
			params: [`0x${interval.toString(16)}`],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_setBlockTimestampInterval')
		expect(result.result).toBe(null)
		expect(node.getBlockTimestampInterval()).toBe(interval)
	})

	it('should handle decimal string params', async () => {
		const node = createTevmNode()
		const procedure = anvilSetBlockTimestampIntervalJsonRpcProcedure(node)

		const interval = 15n

		const result = await procedure({
			method: 'anvil_setBlockTimestampInterval',
			params: [interval.toString()],
			jsonrpc: '2.0',
		})

		expect(result.result).toBe(null)
		expect(node.getBlockTimestampInterval()).toBe(interval)
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode()
		const procedure = anvilSetBlockTimestampIntervalJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_setBlockTimestampInterval',
			params: ['0xc'], // 12 seconds
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
	})
})
