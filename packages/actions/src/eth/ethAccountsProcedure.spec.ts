import { describe, expect, it } from 'vitest'
import { ethAccountsProcedure } from './ethAccountsProcedure.js'
import { testAccounts } from './utils/testAccounts.js'

describe('ethAccountsProcedure', () => {
	it('should return the correct JSON-RPC response', async () => {
		const req = { id: 1, method: 'eth_accounts', jsonrpc: '2.0' } as const
		const response = await ethAccountsProcedure(testAccounts)(req)
		expect(response).toEqual({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_accounts',
			result: testAccounts.map((account) => account.address),
		})
	})

	it('should handle requests without an id', async () => {
		const req = { method: 'eth_accounts', jsonrpc: '2.0' } as const
		const response = await ethAccountsProcedure(testAccounts)(req)
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'eth_accounts',
			result: testAccounts.map((account) => account.address),
		})
	})
})
