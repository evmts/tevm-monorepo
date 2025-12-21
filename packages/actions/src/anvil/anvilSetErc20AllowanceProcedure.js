import { hexToBigInt } from 'viem'
import { setErc20AllowanceHandler } from './anvilSetErc20AllowanceHandler.js'

/**
 * JSON-RPC procedure for anvil_setErc20Allowance
 * Sets ERC20 allowance for a spender by overriding the storage of allowance(owner, spender)
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetErc20AllowanceProcedure}
 * @example
 * ```typescript
 * const response = await client.request({
 *   method: 'anvil_setErc20Allowance',
 *   params: [{
 *     erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
 *     owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *     spender: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
 *     amount: '0xf4240' // 1000000 (1 USDC with 6 decimals)
 *   }],
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * ```
 */
export const anvilSetErc20AllowanceJsonRpcProcedure = (client) => async (request) => {
	const [{ erc20, owner, spender, amount }] = request.params

	const result = await setErc20AllowanceHandler(client)({
		erc20,
		owner,
		spender,
		amount: hexToBigInt(amount),
	})

	if (result && 'errors' in result && result.errors) {
		/**
		 * @type {import('./AnvilJsonRpcResponse.js').AnvilSetErc20AllowanceJsonRpcResponse}
		 */
		const out = {
			jsonrpc: request.jsonrpc,
			...(request.id !== undefined ? { id: request.id } : {}),
			method: 'anvil_setErc20Allowance',
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
		method: 'anvil_setErc20Allowance',
		result: null,
	}
}
