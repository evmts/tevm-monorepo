import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilGetAutomineJsonRpcProcedure } from './anvilGetAutomineProcedure.js'

describe('anvilGetAutomineJsonRpcProcedure', () => {
	it('should return true when automine is enabled', async () => {
		const node = createTevmNode({ miningConfig: { type: 'auto' } })
		const procedure = anvilGetAutomineJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_getAutomine',
			// TODO this is actually a bug we need to provide params
			params: [{}],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_getAutomine')
		expect(result.result).toBe(true)
	})

	it('should return false when automine is disabled', async () => {
		const node = createTevmNode({ miningConfig: { type: 'manual' } })
		const procedure = anvilGetAutomineJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_getAutomine',
			params: [{}],
			jsonrpc: '2.0',
		})

		expect(result.result).toBe(false)
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode()
		const procedure = anvilGetAutomineJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_getAutomine',
			params: [{}],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
	})
})
