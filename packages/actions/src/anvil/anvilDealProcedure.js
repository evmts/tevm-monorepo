import { hexToBigInt } from '@tevm/utils'
import { dealHandler } from './anvilDealHandler.js'

/**
 * JSON-RPC procedure for anvil_deal
 * Deals ERC20 tokens to an account by overriding the storage of balanceOf(account)
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilDealProcedure}
 * @example
 * ```typescript
 * const response = await client.request({
 *   method: 'anvil_deal',
 *   params: [{
 *     erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Optional: USDC address
 *     account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *     amount: 1000000n // 1 USDC (6 decimals)
 *   }],
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * ```
 */
export const anvilDealJsonRpcProcedure = (client) => async (request) => {
	const [{ erc20, account, amount }] = request.params

	const result = await dealHandler(client)({
		...(erc20 !== undefined ? { erc20 } : {}),
		account,
		amount: hexToBigInt(amount),
	})

	if ('errors' in result && result.errors) {
		/**
		 * @type {import('./AnvilJsonRpcResponse.js').AnvilDealJsonRpcResponse}
		 */
		const out = {
			jsonrpc: request.jsonrpc,
			...(request.id !== undefined ? { id: request.id } : {}),
			method: 'anvil_deal',
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
		method: 'anvil_deal',
		result: {},
	}
}
