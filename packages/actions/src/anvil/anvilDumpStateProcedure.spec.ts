import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilDumpStateJsonRpcProcedure } from './anvilDumpStateProcedure.js'

describe('anvilDumpStateJsonRpcProcedure', () => {
	it('should dump state correctly', async () => {
		const node = createTevmNode()
		const procedure = anvilDumpStateJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_dumpState',
			// TODO this is actually a bug we need to provide params
			params: [{}],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_dumpState')
		expect(result.result).toMatchSnapshot()
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode()
		const procedure = anvilDumpStateJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_dumpState',
			params: [{}],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
	})
})
