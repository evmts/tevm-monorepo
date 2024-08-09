import { setAccountProcedure } from '../setaccount/setAccountProcedure.js'

/**
 * Request handler for anvil_setStorageAt JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetStorageAtProcedure}
 */
export const anvilSetStorageAtJsonRpcProcedure = (client) => {
	return async (request) => {
		request
		const result = await setAccountProcedure(client)({
			method: 'tevm_setAccount',
			...(request.id ? { id: request.id } : {}),
			jsonrpc: '2.0',
			params: [
				{
					address: request.params[0],
					stateDiff: {
						[request.params[1]]: request.params[2],
					},
				},
			],
		})
		if (result.error) {
			return {
				error: /** @type {any}*/ (result.error),
				jsonrpc: '2.0',
				method: request.method,
				...(request.id ? { id: request.id } : {}),
			}
		}
		return {
			jsonrpc: '2.0',
			method: request.method,
			...(request.id ? { id: request.id } : {}),
			result: null,
		}
	}
}
