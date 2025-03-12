import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { anvilDealJsonRpcProcedure } from './anvilDealProcedure.js'

describe('anvilDealJsonRpcProcedure', () => {
	it('should deal ERC20 tokens', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const result = await anvilDealJsonRpcProcedure(client)({
			method: 'anvil_deal',
			params: [
				{
					erc20: erc20.address,
					account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
					amount: '0xf4240', // 1M (6 decimals)
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'anvil_deal',
			result: {},
		})
	})

	it('should deal native tokens when no erc20 address provided', async () => {
		const client = createTevmNode()

		const result = await anvilDealJsonRpcProcedure(client)({
			method: 'anvil_deal',
			params: [
				{
					account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
					amount: '0xde0b6b3a7640000', // 1 ETH
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'anvil_deal',
			result: {},
		})
	})

	/**
	 * TODO: Add the following test cases for more robust coverage:
	 *
	 * 1. Test handling of invalid ERC20 address
	 *    - Verify appropriate error response when passing a non-contract address
	 *    - Verify the error includes correct jsonrpc, id, and method fields
	 *
	 * 2. Test handling of invalid account address
	 *    - Verify error response when passing an invalid Ethereum address
	 *    - Check that the original request id is preserved in the error response
	 *
	 * 3. Test handling of invalid amount format
	 *    - Verify error response when amount is not a valid hex string
	 *    - Verify error handling when amount value overflows
	 *
	 * 4. Test omitted request id
	 *    - Verify that when request id is undefined, the response correctly omits it
	 *
	 * 5. Test actual token balance changes
	 *    - Deploy ERC20 contract, deal tokens, then query balanceOf to verify the balance was updated
	 *    - Test with different token decimals (6, 8, 18) to ensure proper handling
	 *
	 * 6. Test dealing with zero amount
	 *    - Verify behavior when dealing 0 tokens (both ERC20 and native)
	 *
	 * 7. Test handling of access list failures
	 *    - Mock the ethCreateAccessListProcedure to return null or empty access list
	 *    - Verify the error is properly propagated and formatted in the response
	 *
	 * 8. Test dealing to multiple accounts
	 *    - Verify the procedure works correctly for multiple accounts in sequence
	 *    - Check balances of all accounts after operation
	 *
	 * 9. Test with custom ERC20 implementations
	 *    - Test with non-standard ERC20 tokens that might have different storage layouts
	 *    - Test with upgradeable proxy ERC20 tokens
	 *
	 * 10. Test concurrent deal operations
	 *     - Verify behavior when multiple deal operations are performed simultaneously
	 *
	 * 11. Test with request missing required parameters
	 *     - Verify error handling when account is missing
	 *     - Verify error handling when amount is missing
	 *
	 * 12. Test error propagation from anvilSetStorageAtJsonRpcProcedure
	 *     - Mock anvilSetStorageAtJsonRpcProcedure to throw an error
	 *     - Verify the error is properly propagated in the response
	 *
	 * 13. Test with extremely large token amounts
	 *     - Verify behavior with amounts near uint256 max value
	 *
	 * 14. Test with malformed request structures
	 *     - Test handling of invalid jsonrpc version
	 *     - Test handling of malformed params structure
	 *
	 * 15. Test dealing native tokens to contract addresses
	 *     - Verify behavior when attempting to deal ETH to contracts with/without receive functions
	 */
})
