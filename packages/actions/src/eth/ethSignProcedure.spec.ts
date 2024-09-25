import { describe, expect, it } from 'vitest'
import { ethSignProcedure } from './ethSignProcedure.js'
import { testAccounts } from './utils/testAccounts.js'

describe('ethSignProcedure', () => {
	it('should sign a message', async () => {
		const data = '0x42069'
		const request = {
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_sign',
			params: [testAccounts[0].address, data],
		} as const

		const procedure = ethSignProcedure(testAccounts)
		const response = await procedure(request)

		expect(response).toEqual({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_sign',
			result: await testAccounts[0].signMessage({ message: data }),
		})
	})

	it("should throw an error if account doesn't exist", async () => {
		const data = '0x42069'
		const request = {
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_sign',
			params: [`0x${'69'.repeat(20)}`, data],
		} as const

		const procedure = ethSignProcedure(testAccounts)

		await expect(procedure(request)).rejects.toThrow('Account 0x6969696969696969696969696969696969696969 not found')
	})
})
