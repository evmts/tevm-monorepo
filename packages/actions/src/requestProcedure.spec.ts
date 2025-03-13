import { ERC20 } from '@tevm/contract'
import { MethodNotFoundError } from '@tevm/errors'
import { type TevmNode, createTevmNode } from '@tevm/node'
import { type EthjsAccount, EthjsAddress, encodeDeployData, hexToBytes } from '@tevm/utils'
import { bytesToHex, encodeFunctionData, keccak256, numberToHex, parseGwei } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { callProcedure } from './Call/callProcedure.js'
import { ethAccountsProcedure } from './eth/ethAccountsProcedure.js'
import { ethSignProcedure } from './eth/ethSignProcedure.js'
import { ethSignTransactionProcedure } from './eth/ethSignTransactionProcedure.js'
import { testAccounts } from './eth/utils/testAccounts.js'
import { type EthSignTransactionJsonRpcRequest, blockNumberProcedure } from './index.js'
import { requestProcedure } from './requestProcedure.js'

const ERC20_ADDRESS = `0x${'69'.repeat(20)}` as const

let client: TevmNode
beforeEach(() => {
	client = createTevmNode()
})

describe('requestProcedure', () => {
	describe('tevm_getAccount', () => {
		it('should work', async () => {
			await requestProcedure(client)({
				jsonrpc: '2.0',
				method: 'tevm_setAccount',
				id: 1,
				params: [
					{
						address: ERC20_ADDRESS,
						deployedBytecode: ERC20.deployedBytecode,
						balance: numberToHex(420n),
						nonce: numberToHex(69n),
					},
				],
			})
			const res = await requestProcedure(client)({
				jsonrpc: '2.0',
				method: 'tevm_getAccount',
				id: 1,
				params: [
					{
						address: ERC20_ADDRESS,
					},
				],
			})
			expect(res.error).toBeUndefined()
			expect(res.result).toEqual({
				codeHash: keccak256(ERC20.deployedBytecode),
				isContract: true,
				isEmpty: false,
				balance: numberToHex(420n),
				nonce: numberToHex(69n),
				deployedBytecode: ERC20.deployedBytecode,
				address: ERC20_ADDRESS,
				storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
			})
		})
	})
	describe('tevm_setAccount', () => {
		it('should work', async () => {
			const res = await requestProcedure(client)({
				jsonrpc: '2.0',
				method: 'tevm_setAccount',
				id: 1,
				params: [
					{
						address: ERC20_ADDRESS,
						deployedBytecode: ERC20.deployedBytecode,
						balance: numberToHex(420n),
						nonce: numberToHex(69n),
					},
				],
			})
			expect(res.error).toBeUndefined()
			const account = (await (
				await client.getVm()
			).stateManager.getAccount(EthjsAddress.fromString(ERC20_ADDRESS))) as EthjsAccount
			expect(account?.balance).toBe(420n)
			expect(account?.nonce).toBe(69n)
			expect(bytesToHex(account.codeHash)).toBe(keccak256(ERC20.deployedBytecode))
		})
		it('should handle account throwing an unexpected error', async () => {
			const vm = await client.getVm()
			vm.stateManager.putAccount = () => {
				throw new Error('unexpected error')
			}
			const res = await requestProcedure(client)({
				jsonrpc: '2.0',
				method: 'tevm_setAccount',
				id: 1,
				params: [
					{
						address: ERC20_ADDRESS,
						deployedBytecode: ERC20.deployedBytecode,
						balance: numberToHex(420n),
						nonce: numberToHex(69n),
					},
				],
			})
			expect(res).toMatchSnapshot()
		})
	})

	describe('tevm_call', async () => {
		it('should work', async () => {
			const to = `0x${'69'.repeat(20)}` as const
			expect(
				await callProcedure(client)({
					jsonrpc: '2.0',
					method: 'tevm_call',
					id: 1,
					params: [
						{
							createTransaction: true,
							to,
							value: numberToHex(420n),
							skipBalance: true,
						},
					],
				}),
			).toEqual({
				id: 1,
				method: 'tevm_call',
				jsonrpc: '2.0',
				result: {
					amountSpent: '0x23e38',
					totalGasSpent: '0x5208',
					executionGasUsed: numberToHex(0n),
					rawData: '0x',
					txHash: '0x5e5b342fae6b13548e62c3038078915397ebd2406a8c67afd276e8dc84ebba80',
				},
			})

			const txPool = await client.getTxPool()

			const poolTx = txPool.getByHash([
				hexToBytes('0x5e5b342fae6b13548e62c3038078915397ebd2406a8c67afd276e8dc84ebba80'),
			]) as any

			expect(poolTx).toHaveLength(1)

			expect(poolTx[0]?.toJSON()).toEqual({
				accessList: [],
				chainId: '0x384',
				data: '0x',
				gasLimit: '0x5a3c',
				maxFeePerGas: '0x7',
				maxPriorityFeePerGas: '0x0',
				nonce: '0x0',
				r: undefined as any,
				s: undefined as any,
				v: undefined as any,
				to: '0x6969696969696969696969696969696969696969',
				type: '0x2',
				value: '0x1a4',
			})
		})
	})

	describe('tevmCall with script', async () => {
		it('should work', async () => {
			expect(
				await callProcedure(client)({
					jsonrpc: '2.0',
					method: 'tevm_call',
					id: 1,
					params: [
						{
							code: encodeDeployData({
								abi: ERC20.abi,
								bytecode: ERC20.bytecode,
								args: ['Name', 'SYMBOL'],
							}),
							data: encodeFunctionData(ERC20.read.balanceOf(ERC20_ADDRESS)),
							to: ERC20_ADDRESS,
						},
					],
				}),
			).toEqual({
				method: 'tevm_call',
				jsonrpc: '2.0',
				id: 1,
				result: {
					amountSpent: '0x297fd',
					executionGasUsed: '0xb23',
					gas: '0x1c964a5',
					totalGasSpent: '0x5edb',
					rawData: '0x0000000000000000000000000000000000000000000000000000000000000000',
					selfdestruct: [],
					logs: [],
					createdAddresses: [],
				},
			})
		})

		it('should handle the evm throwing an error', async () => {
			const caller = `0x${'69'.repeat(20)}` as const
			expect(
				await callProcedure(client)({
					jsonrpc: '2.0',
					method: 'tevm_call',
					id: 1,
					params: [
						{
							code: encodeDeployData({
								abi: ERC20.abi,
								bytecode: ERC20.bytecode,
								args: ['Name', 'SYMBOL'],
							}),
							data: encodeFunctionData({
								abi: ERC20.abi,
								functionName: 'transferFrom',
								args: [caller, caller, 420n],
							}),
							to: ERC20_ADDRESS,
						},
					],
				}),
			).toMatchSnapshot()
		})
	})

	describe('eth_blockNumber', async () => {
		it('should work', async () => {
			// send value
			expect(
				await blockNumberProcedure(client)({
					jsonrpc: '2.0',
					method: 'eth_blockNumber',
					id: 1,
				}),
			).toEqual({
				id: 1,
				method: 'eth_blockNumber',
				jsonrpc: '2.0',
				result: '0x0',
			})
		})
	})

	describe('eth_accounts', () => {
		it('should return the accounts', async () => {
			expect(
				await ethAccountsProcedure(testAccounts)({
					jsonrpc: '2.0',
					method: 'eth_accounts',
					id: 1,
				}),
			).toEqual({
				jsonrpc: '2.0',
				method: 'eth_accounts',
				id: 1,
				result: testAccounts.map((account) => account.address),
			})
		})
	})

	describe('ethSignHandler', () => {
		it('should sign a message', async () => {
			const data = '0x42069'
			expect(
				await ethSignProcedure(testAccounts)({
					jsonrpc: '2.0',
					method: 'eth_sign',
					id: 1,
					params: [testAccounts[0].address, data],
				}),
			).toEqual({
				jsonrpc: '2.0',
				method: 'eth_sign',
				id: 1,
				result: await testAccounts[0].signMessage({ message: data }),
			})
		})
	})

	describe('ethSignTransactionHandler', () => {
		const transaction: EthSignTransactionJsonRpcRequest['params'] = [
			{
				data: '0x0',
				from: testAccounts[0].address,
				to: `0x${'69'.repeat(20)}`,
				value: numberToHex(420n),
				gas: numberToHex(23n),
				gasPrice: numberToHex(parseGwei('1')),
				nonce: numberToHex(1n),
			},
		]
		it('should sign a message', async () => {
			expect(
				await ethSignTransactionProcedure({
					accounts: testAccounts,
					getChainId: async () => 10,
				})({
					jsonrpc: '2.0',
					method: 'eth_signTransaction',
					id: 1,
					params: transaction,
				}),
			).toMatchSnapshot()
		})
	})

	describe('unsupported method', () => {
		it('should return a MethodNotFoundError for an unsupported method', async () => {
			const res = await requestProcedure(client)({
				jsonrpc: '2.0',
				method: 'unsupported_method' as any,
				id: 1,
				params: [],
			})

			expect(res.error.code).toBe(MethodNotFoundError.code)
			expect(res).toMatchInlineSnapshot(`
				{
				  "error": {
				    "code": -32601,
				    "message": "UnsupportedMethodError: Unknown method unsupported_method

				Docs: https://tevm.sh/reference/tevm/errors/classes/methodnotfounderror/
				Version: 1.1.0.next-73",
				  },
				  "id": 1,
				  "jsonrpc": "2.0",
				  "method": "unsupported_method",
				}
			`)
		})
	})

	/**
	 * TODO: Add the following test cases for more robust coverage:
	 *
	 * 1. Request with missing or invalid ID
	 *    - Verify that when a request is missing an ID, a response is generated with a null ID
	 *    - Verify that non-numeric IDs (strings, objects) are handled correctly
	 *
	 * 2. Request with missing or malformed jsonrpc version
	 *    - Test handling of requests without the jsonrpc field
	 *    - Test handling of requests with incorrect jsonrpc versions (not "2.0")
	 *
	 * 3. Request with missing method field
	 *    - Verify appropriate error response when the method field is missing
	 *
	 * 4. Request with missing or malformed params
	 *    - Test when params are missing but required
	 *    - Test when params are of the wrong type (array vs object)
	 *    - Test when params contain invalid values but in correct structure
	 *
	 * 5. Error propagation from handlers
	 *    - Verify that errors from individual handlers are properly captured and returned
	 *    - Test different error types (validation errors, execution errors, etc.)
	 *
	 * 6. Client readiness handling
	 *    - Test behavior when client.ready() rejects
	 *    - Test behavior when client is in various states (initializing, ready, error)
	 *
	 * 7. Handler invocation with correct parameters
	 *    - Mock handlers to verify they receive the exact request object
	 *
	 * 8. Concurrent requests handling
	 *    - Test performance with multiple simultaneous requests
	 *    - Verify that requests don't interfere with each other
	 *
	 * 9. TypeScript type safety tests
	 *    - Verify the type definitions match the implementation
	 *    - Test with different request types to ensure proper typing
	 *
	 * 10. Method case sensitivity handling
	 *     - Test if method names are case-sensitive
	 *     - Test with methods in different casings
	 *
	 * 11. Boundary test for large requests
	 *     - Test with very large parameter payloads
	 *     - Test with many nested objects in parameters
	 *
	 * 12. Handle unexpected exceptions
	 *     - Test behavior when an unexpected exception occurs inside a handler
	 *
	 * 13. Handler return value validation
	 *     - Test when a handler returns invalid response structures
	 *     - Test when a handler returns undefined or null
	 *
	 * 14. Client logging verification
	 *     - Verify that requests are properly logged with client.logger.debug
	 *     - Test log behavior in error scenarios
	 *
	 * 15. Test all method handler mappings
	 *     - Verify that each method in createHandlers is correctly mapped and invoked
	 *     - Test aliased methods (e.g., anvil/tevm/ganache/hardhat variants)
	 *
	 * 16. Response format verification
	 *     - Verify that all responses have the required JSON-RPC fields
	 *     - Test response structure when errors occur
	 */
})
