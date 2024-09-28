import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetNonceJsonRpcProcedure } from './anvilSetNonceProcedure.js'

describe('anvilSetNonceJsonRpcProcedure', () => {
	it('should set nonce for a given address', async () => {
		const client = createTevmNode()
		const procedure = anvilSetNonceJsonRpcProcedure(client)
		const address = createAddress('0x1234567890123456789012345678901234567890')
		const nonce = '0x5'

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setNonce',
			params: [address.toString(), nonce],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setNonce',
			result: null,
			id: 1,
		})
	})
})
