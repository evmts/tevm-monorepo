import { setAccountProcedure } from '../SetAccount/setAccountProcedure.js'

/**
 * Request handler for anvil_setNonce JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetNonceProcedure}
 */
export const anvilSetNonceJsonRpcProcedure = (client) => {
	return async (request) => {
		const balanceResult = await setAccountProcedure(client)({
			jsonrpc: request.jsonrpc,
			method: 'tevm_setAccount',
			params: [
				{
					address: request.params[0],
					nonce: request.params[1],
				},
			],
			...(request.id ? { id: request.id } : {}),
		})
		if (balanceResult.error) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				error: /** @type {any}*/ (balanceResult.error),
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}
		return {
			jsonrpc: '2.0',
			method: request.method,
			result: null,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
