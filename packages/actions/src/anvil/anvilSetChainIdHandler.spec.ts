import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetChainIdJsonRpcProcedure } from './anvilSetChainIdProcedure.js'

describe('anvilSetChainIdJsonRpcProcedure', () => {
	it('should attempt to set chain ID (but return not supported error)', async () => {
		const client = createTevmNode()
		const procedure = anvilSetChainIdJsonRpcProcedure(client)
		const chainId = '0x1'

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setChainId',
			params: [chainId],
			id: 1,
		})

		expect(result).toHaveProperty('error')
		expect(result.error?.message).toContain('not supported')
	})
})
