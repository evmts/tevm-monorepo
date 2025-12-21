import { hexToBigInt } from 'viem'
import { dealErc20Handler } from './anvilDealErc20Handler.js'

/**
 * JSON-RPC procedure for anvil_dealErc20
 * Sets ERC20 token balance for an account by overriding the storage of balanceOf(account)
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilDealErc20Procedure}
 * @example
 * ```typescript
 * const response = await client.request({
 *   method: 'anvil_dealErc20',
 *   params: [{
 *     erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
 *     account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *     amount: '0xf4240' // 1000000 (1 USDC with 6 decimals)
 *   }],
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * ```
 */
export const anvilDealErc20JsonRpcProcedure = (client) => async (request) => {
	const [{ erc20, account, amount }] = request.params

	const result = await dealErc20Handler(client)({
		erc20,
		account,
		amount: hexToBigInt(amount),
	})

	if ('errors' in result && result.errors) {
		/**
		 * @type {import('./AnvilJsonRpcResponse.js').AnvilDealErc20JsonRpcResponse}
		 */
		const out = {
			jsonrpc: request.jsonrpc,
			...(request.id !== undefined ? { id: request.id } : {}),
			method: 'anvil_dealErc20',
			error: {
				// @ts-expect-error being lazy here
				code: (result.errors[0]?.code ?? -32000).toString(),
				message: result.errors[0]?.message ?? result.errors[0]?.name ?? 'An unknown error occured',
			},
		}
		return out
	}

	return {
		jsonrpc: request.jsonrpc,
		...(request.id !== undefined ? { id: request.id } : {}),
		method: 'anvil_dealErc20',
		result: null,
	}
}
