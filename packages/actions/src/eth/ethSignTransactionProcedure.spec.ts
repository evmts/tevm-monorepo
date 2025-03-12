// Import needed utilities
import { describe, expect, it } from 'vitest'
import type { EthSignTransactionJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethSignTransactionProcedure } from './ethSignTransactionProcedure.js'
import { testAccounts } from './utils/testAccounts.js'

describe('ethSignTransactionProcedure', () => {
	it('should sign a transaction with all parameters', async () => {
		const request: EthSignTransactionJsonRpcRequest = {
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			params: [
				{
					from: testAccounts[0].address,
					to: `0x${'69'.repeat(20)}`,
					data: '0x0',
					value: '0x1a4', // 420 in hex
					gas: '0x17', // 23 in hex
					gasPrice: '0x3b9aca00', // 1 gwei in hex
					nonce: '0x1', // 1 in hex
				},
			],
		}

		const response = await ethSignTransactionProcedure({
			accounts: testAccounts,
			getChainId: async () => 10,
		})(request)

		expect(response.id).toBe(1)
		expect(response.jsonrpc).toBe('2.0')
		expect(response.method).toBe('eth_signTransaction')
		expect(response.result).toMatch(/^0x/)
	})

	it('should sign a transaction with minimal parameters', async () => {
		const request: EthSignTransactionJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			params: [
				{
					from: testAccounts[0].address,
				},
			],
		}

		const response = await ethSignTransactionProcedure({
			accounts: testAccounts,
			getChainId: async () => 10,
		})(request)

		expect(response.id).toBeUndefined()
		expect(response.jsonrpc).toBe('2.0')
		expect(response.method).toBe('eth_signTransaction')
		expect(response.result).toMatch(/^0x/)
	})

	it('should sign a transaction with only some parameters', async () => {
		const request: EthSignTransactionJsonRpcRequest = {
			id: 2,
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			params: [
				{
					from: testAccounts[0].address,
					to: `0x${'69'.repeat(20)}`,
					data: '0x0',
				},
			],
		}

		const response = await ethSignTransactionProcedure({
			accounts: testAccounts,
			getChainId: async () => 10,
		})(request)

		expect(response.id).toBe(2)
		expect(response.jsonrpc).toBe('2.0')
		expect(response.method).toBe('eth_signTransaction')
		expect(response.result).toMatch(/^0x/)
	})
})
