import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetTimeJsonRpcProcedure } from './anvilSetTimeProcedure.js'

describe('anvilSetTimeJsonRpcProcedure', () => {
	it('should set the time and return it', async () => {
		const node = createTevmNode()
		const procedure = anvilSetTimeJsonRpcProcedure(node)

		const timestamp = 1700000000n

		const result = await procedure({
			method: 'anvil_setTime',
			params: [`0x${timestamp.toString(16)}`],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_setTime')
		expect(result.result).toBe(`0x${timestamp.toString(16)}`)
		expect(node.getNextBlockTimestamp()).toBe(timestamp)
	})

	it('should handle numeric string params', async () => {
		const node = createTevmNode()
		const procedure = anvilSetTimeJsonRpcProcedure(node)

		const timestamp = 1700000000n

		const result = await procedure({
			method: 'anvil_setTime',
			params: [timestamp.toString()],
			jsonrpc: '2.0',
		})

		expect(result.result).toBe(`0x${timestamp.toString(16)}`)
		expect(node.getNextBlockTimestamp()).toBe(timestamp)
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode()
		const procedure = anvilSetTimeJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_setTime',
			params: ['0x61234567'],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
	})
})
