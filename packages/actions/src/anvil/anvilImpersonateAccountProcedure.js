import { getAddress } from '@tevm/utils'

/**
 * Request handler for anvil_impersonateAccount JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilImpersonateAccountProcedure}
 */
export const anvilImpersonateAccountJsonRpcProcedure = (client) => {
	return async (request) => {
		try {
			client.setImpersonatedAccount(getAddress(request.params[0]))
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id ? { id: request.id } : {}),
				result: null,
			}
		} catch (e) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id ? { id: request.id } : {}),
				// TODO use @tevm/errors
				error: {
					code: /** @type any*/ (-32602),
					message: /** @type {Error}*/ (e).message,
				},
			}
		}
	}
}
