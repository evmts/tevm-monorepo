import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetAutomineJsonRpcProcedure } from './anvilSetAutomineProcedure.js'

describe('anvilSetAutomineJsonRpcProcedure', () => {
	it('should enable automine when passed true', async () => {
		const node = createTevmNode({ miningConfig: { type: 'manual' } })
		const procedure = anvilSetAutomineJsonRpcProcedure(node)

		expect(node.miningConfig).toEqual({ type: 'manual' })

		const result = await procedure({
			method: 'anvil_setAutomine',
			params: [true],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_setAutomine')
		expect(result.result).toBe(null)
		expect(node.miningConfig).toEqual({ type: 'auto' })
	})

	it('should disable automine when passed false', async () => {
		const node = createTevmNode({ miningConfig: { type: 'auto' } })
		const procedure = anvilSetAutomineJsonRpcProcedure(node)

		expect(node.miningConfig).toEqual({ type: 'auto' })

		const result = await procedure({
			method: 'anvil_setAutomine',
			params: [false],
			jsonrpc: '2.0',
		})

		expect(result.result).toBe(null)
		expect(node.miningConfig).toEqual({ type: 'manual' })
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode()
		const procedure = anvilSetAutomineJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_setAutomine',
			params: [true],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
	})
})
