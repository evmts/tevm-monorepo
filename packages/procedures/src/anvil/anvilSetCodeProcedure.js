import { setAccountProcedure } from '../setaccount/setAccountProcedure.js'

/**
 * Request handler for anvil_setCode JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./AnvilProcedure.js').AnvilSetCodeProcedure}
 */
export const anvilSetCodeJsonRpcProcedure = (client) => {
	return async (request) => {
		const result = await setAccountProcedure(client)({
			jsonrpc: request.jsonrpc,
			method: 'tevm_setAccount',
			params: [{ address: request.params[0], deployedBytecode: request.params[1] }],
			...(request.id ? { id: request.id } : {}),
		})
		if (result.error) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: /** @type any*/ (-32602),
					message: result.error.message,
				},
			}
		}
		return {
			...(request.id ? { id: request.id } : {}),
			method: request.method,
			jsonrpc: request.jsonrpc,
			result: null,
		}
	}
}
