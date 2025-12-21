import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetNextBlockTimestampJsonRpcProcedure } from './anvilSetNextBlockTimestampProcedure.js'

describe('anvilSetNextBlockTimestampJsonRpcProcedure', () => {
	it('should set the next block timestamp', async () => {
		const node = createTevmNode()
		const procedure = anvilSetNextBlockTimestampJsonRpcProcedure(node)

		const timestamp = 1700000000n

		const result = await procedure({
			method: 'anvil_setNextBlockTimestamp',
			params: [`0x${timestamp.toString(16)}`],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_setNextBlockTimestamp')
		expect(result.result).toBe(null)
		expect(node.getNextBlockTimestamp()).toBe(timestamp)
	})

	it('should handle numeric string params', async () => {
		const node = createTevmNode()
		const procedure = anvilSetNextBlockTimestampJsonRpcProcedure(node)

		const timestamp = 1700000000n

		const result = await procedure({
			method: 'anvil_setNextBlockTimestamp',
			params: [timestamp.toString()],
			jsonrpc: '2.0',
		})

		expect(result.result).toBe(null)
		expect(node.getNextBlockTimestamp()).toBe(timestamp)
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode()
		const procedure = anvilSetNextBlockTimestampJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_setNextBlockTimestamp',
			params: ['0x61234567'],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
	})
})
