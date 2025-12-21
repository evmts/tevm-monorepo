import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilEnableTracesJsonRpcProcedure } from './anvilEnableTracesProcedure.js'

describe('anvilEnableTracesJsonRpcProcedure', () => {
	it('should enable traces when called with true', async () => {
		const node = createTevmNode()
		await node.ready()

		const procedure = anvilEnableTracesJsonRpcProcedure(node)

		// Initially traces should be disabled
		expect(node.getTracesEnabled()).toBe(false)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_enableTraces',
			params: [true],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_enableTraces',
			result: null,
			id: 1,
		})

		expect(node.getTracesEnabled()).toBe(true)
	})

	it('should disable traces when called with false', async () => {
		const node = createTevmNode()
		await node.ready()

		const procedure = anvilEnableTracesJsonRpcProcedure(node)

		// First enable traces
		node.setTracesEnabled(true)
		expect(node.getTracesEnabled()).toBe(true)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_enableTraces',
			params: [false],
			id: 2,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_enableTraces',
			result: null,
			id: 2,
		})

		expect(node.getTracesEnabled()).toBe(false)
	})

	it('should default to enabling traces when called without params', async () => {
		const node = createTevmNode()
		await node.ready()

		const procedure = anvilEnableTracesJsonRpcProcedure(node)

		expect(node.getTracesEnabled()).toBe(false)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_enableTraces',
			params: [],
			id: 3,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_enableTraces',
			result: null,
			id: 3,
		})

		expect(node.getTracesEnabled()).toBe(true)
	})

	it('should work without id in the request', async () => {
		const node = createTevmNode()
		await node.ready()

		const procedure = anvilEnableTracesJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_enableTraces',
			params: [true],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_enableTraces',
			result: null,
		})

		expect(node.getTracesEnabled()).toBe(true)
	})
})
