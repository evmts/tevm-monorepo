import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetLoggingEnabledJsonRpcProcedure } from './anvilSetLoggingEnabledProcedure.js'

describe('anvilSetLoggingEnabledJsonRpcProcedure', () => {
	it('should enable logging', async () => {
		const node = createTevmNode()
		const procedure = anvilSetLoggingEnabledJsonRpcProcedure(node)

		// First disable it
		node.logger.level = 'silent'

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setLoggingEnabled',
			params: [true],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setLoggingEnabled',
			result: null,
			id: 1,
		})

		expect(node.logger.level).toBe('info')
	})

	it('should disable logging', async () => {
		const node = createTevmNode()
		const procedure = anvilSetLoggingEnabledJsonRpcProcedure(node)

		// Ensure it starts enabled
		node.logger.level = 'info'

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setLoggingEnabled',
			params: [false],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setLoggingEnabled',
			result: null,
			id: 1,
		})

		expect(node.logger.level).toBe('silent')
	})

	it('should work without id in request', async () => {
		const node = createTevmNode()
		const procedure = anvilSetLoggingEnabledJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setLoggingEnabled',
			params: [false],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setLoggingEnabled',
			result: null,
		})
	})
})
