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

	it('should sign EIP-1559 style transaction params', async () => {
		const request: EthSignTransactionJsonRpcRequest = {
			id: 3,
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			params: [
				{
					from: testAccounts[0].address,
					to: `0x${'69'.repeat(20)}`,
					maxFeePerGas: '0x3b9aca00',
					maxPriorityFeePerGas: '0x1',
				},
			],
		}
		const response = await ethSignTransactionProcedure({
			accounts: testAccounts,
			getChainId: async () => 10,
		})(request)
		expect(response.result).toMatch(/^0x/)
	})

	it('should reject malformed numeric hex params', async () => {
		const request = {
			id: 4,
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			params: [{ from: testAccounts[0].address, gas: '0xz' }],
		} as unknown as EthSignTransactionJsonRpcRequest
		await expect(
			ethSignTransactionProcedure({
				accounts: testAccounts,
				getChainId: async () => 10,
			})(request),
		).rejects.toThrow()
	})

	it('should sign EIP-2930 style transaction params (accessList)', async () => {
		const request: EthSignTransactionJsonRpcRequest = {
			id: 5,
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			params: [
				{
					from: testAccounts[0].address,
					to: `0x${'69'.repeat(20)}`,
					gas: '0x5208',
					gasPrice: '0x3b9aca00',
					nonce: '0x0',
					accessList: [
						{
							address: `0x${'69'.repeat(20)}`,
							storageKeys: [`0x${'00'.repeat(32)}`],
						},
					],
				},
			],
		}
		const response = await ethSignTransactionProcedure({
			accounts: testAccounts,
			getChainId: async () => 10,
		})(request)
		expect(response.result).toMatch(/^0x01/) // EIP-2930 envelope prefix
	})

	it('should sign EIP-7702 style transaction params (authorizationList)', async () => {
		const request: EthSignTransactionJsonRpcRequest = {
			id: 6,
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			params: [
				{
					from: testAccounts[0].address,
					to: `0x${'69'.repeat(20)}`,
					gas: '0x5208',
					maxFeePerGas: '0x3b9aca00',
					maxPriorityFeePerGas: '0x1',
					nonce: '0x0',
					authorizationList: [
						{
							chainId: '0xa',
							address: `0x${'69'.repeat(20)}`,
							nonce: '0x0',
							yParity: '0x0',
							r: `0x${'01'.repeat(32)}`,
							s: `0x${'02'.repeat(32)}`,
						},
					] as readonly unknown[],
				},
			],
		}
		const response = await ethSignTransactionProcedure({
			accounts: testAccounts,
			getChainId: async () => 10,
		})(request)
		expect(response.result).toMatch(/^0x04/) // EIP-7702 envelope prefix
	})

	it('should reject unmanaged accounts (account not in signer set)', async () => {
		const request: EthSignTransactionJsonRpcRequest = {
			id: 7,
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			params: [
				{
					from: `0x${'69'.repeat(20)}`,
					to: `0x${'42'.repeat(20)}`,
					gasPrice: '0x3b9aca00',
				},
			],
		}
		await expect(
			ethSignTransactionProcedure({
				accounts: testAccounts,
				getChainId: async () => 10,
			})(request),
		).rejects.toThrow(/not found/i)
	})

	/**
	 * TODO: Add the following test cases for more robust coverage:
	 *
	 * 1. Test handling of invalid hex values
	 *    - Test with malformed hex strings for value, gas, gasPrice, and nonce
	 *    - Verify appropriate errors are thrown or values are properly handled
	 *
	 * 2. Test with empty params array
	 *    - Verify proper error handling when params array is empty
	 *
	 * 3. Test with missing 'from' parameter
	 *    - Verify proper error handling when required 'from' field is missing
	 *
	 * 4. Test with invalid 'from' address format
	 *    - Verify proper error handling for malformed addresses
	 *
	 * 5. Test transaction with exceptionally large values
	 *    - Test with very large numbers for gas, gasPrice, value
	 *    - Verify overflow handling
	 *
	 * 6. Test with various transaction types
	 *    - Test with explicit EIP-1559 transaction type (maxFeePerGas, maxPriorityFeePerGas)
	 *    - Test with legacy transaction format
	 *
	 * 7. Test chainId handling
	 *    - Test when getChainId throws an error
	 *    - Test with different chainId values to verify signature changes
	 *
	 * 8. Test with non-ASCII data
	 *    - Verify proper handling of special characters in data field
	 *
	 * 9. Test proper BigInt conversion edge cases
	 *    - Test with hex values at boundary of safe integer limit
	 *    - Test with very small values (e.g., '0x0')
	 *
	 * 10. Test error propagation
	 *     - Mock ethSignTransactionHandler to throw specific errors
	 *     - Verify these errors are properly propagated through procedure
	 *
	 * 11. Test with empty request parameters
	 *     - Verify behavior when optional fields (data, value, etc.) are undefined or null
	 *
	 * 12. Test with invalid address formats
	 *     - Test with addresses that aren't checksummed correctly
	 *     - Test with addresses that are too short/long
	 *
	 * 13. Test when signTransaction method throws
	 *     - Mock account.signTransaction to throw errors
	 *     - Test how these errors are handled by the procedure
	 *
	 * 14. Validate response format
	 *     - Test that the response always follows the expected JSON-RPC format
	 *     - Verify that all expected fields are present even in error conditions
	 *
	 * 15. Test concurrency
	 *     - Test multiple simultaneous calls to the procedure
	 *     - Verify that the results are correct and consistent
	 */
})
