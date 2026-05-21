import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugDumpBlockJsonRpcProcedure } from './debugDumpBlockProcedure.js'

describe('debugDumpBlockJsonRpcProcedure', () => {
	it('should dump block state for latest block', async () => {
		const client = createTevmNode()

		const procedure = debugDumpBlockJsonRpcProcedure(client)

		const response = await procedure({
			id: 1,
			jsonrpc: '2.0',
			method: 'debug_dumpBlock',
			params: [{ blockTag: 'latest' }],
		})

		expect(response.method).toBe('debug_dumpBlock')
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(1)

		if ('error' in response) {
			throw new Error(`Unexpected error: ${response.error.message}`)
		}

		expect(response.result).toBeDefined()
		expect(response.result.root).toBeDefined()
		expect(typeof response.result.root).toBe('string')
		expect(response.result.root).toMatch(/^0x[0-9a-fA-F]+$/)

		expect(response.result.accounts).toBeDefined()
		expect(typeof response.result.accounts).toBe('object')
	})

	it('should dump block state for block 0', async () => {
		const client = createTevmNode()

		// Mine a block so we have block 0
		await mineHandler(client)({ blockCount: 1 })

		const procedure = debugDumpBlockJsonRpcProcedure(client)

		const response = await procedure({
			id: 2,
			jsonrpc: '2.0',
			method: 'debug_dumpBlock',
			params: [{ blockTag: 0n }],
		})

		expect(response.method).toBe('debug_dumpBlock')
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(2)

		if ('error' in response) {
			throw new Error(`Unexpected error: ${response.error.message}`)
		}

		expect(response.result).toBeDefined()
		expect(response.result.root).toBeDefined()
		expect(typeof response.result.root).toBe('string')
		expect(response.result.accounts).toBeDefined()
		expect(typeof response.result.accounts).toBe('object')
	})

	it('should handle errors gracefully', async () => {
		const client = createTevmNode()

		const procedure = debugDumpBlockJsonRpcProcedure(client)

		// Try to get a block that doesn't exist
		const response = await procedure({
			id: 3,
			jsonrpc: '2.0',
			method: 'debug_dumpBlock',
			params: [{ blockTag: 999999999999n }],
		})

		expect(response.method).toBe('debug_dumpBlock')
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(3)

		// Should return an error
		if ('error' in response) {
			expect(response.error).toBeDefined()
			expect(response.error.code).toBe('-32000')
			expect(typeof response.error.message).toBe('string')
		}
	})
})
