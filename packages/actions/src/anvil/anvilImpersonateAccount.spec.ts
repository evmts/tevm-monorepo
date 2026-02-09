import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilImpersonateAccountJsonRpcProcedure } from './anvilImpersonateAccountProcedure.js'

describe('anvilImpersonateAccountJsonRpcProcedure', () => {
	it('should impersonate an account successfully', async () => {
		const client = createTevmNode()
		const impersonateAccountProcedure = anvilImpersonateAccountJsonRpcProcedure(client)

		const testAddress = createAddress('0x1234567890123456789012345678901234567890')

		const request = {
			method: 'anvil_impersonateAccount',
			params: [testAddress.toString()],
			jsonrpc: '2.0',
			id: 1,
		} as const

		const result = await impersonateAccountProcedure(request)

		// Check the returned result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_impersonateAccount',
			id: 1,
			result: null,
		})

		// Verify that the impersonated account was set in the client
		const impersonatedAccount = client.getImpersonatedAccount()
		expect(impersonatedAccount).toBe(testAddress.toString())
	})

	it('should handle an invalid address', async () => {
		const client = createTevmNode()
		const impersonateAccountProcedure = anvilImpersonateAccountJsonRpcProcedure(client)

		const invalidAddress = '0xinvalid'

		const request = {
			method: 'anvil_impersonateAccount',
			params: [invalidAddress],
			jsonrpc: '2.0',
			id: 1,
		} as const

		const result = await impersonateAccountProcedure(request)

		// Check the returned result for an error
		expect(result).toMatchInlineSnapshot(`
			{
			  "error": {
			    "code": -32602,
			    "message": "Address "0xinvalid" is invalid.

			- Address must be a hex value of 20 bytes (40 hex characters).
			- Address must match its checksum counterpart.

			Version: viem@2.45.2",
			  },
			  "id": 1,
			  "jsonrpc": "2.0",
			  "method": "anvil_impersonateAccount",
			}
		`)

		// Verify that the impersonated account was not set in the client
		const impersonatedAccount = client.getImpersonatedAccount()
		expect(impersonatedAccount).toBeUndefined()
	})
})
