import { getAddress } from '@tevm/utils'

/**
 * Request handler for anvil_stopImpersonatingAccount JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilStopImpersonatingAccountProcedure}
 */
export const anvilStopImpersonatingAccountJsonRpcProcedure = (client) => {
	return async (request) => {
		try {
			const address = getAddress(request.params[0])
			if (typeof client.getImpersonatedAccount !== 'function' || client.getImpersonatedAccount() === address) {
				client.setImpersonatedAccount(undefined)
			}
			return {
				jsonrpc: '2.0',
				method: request.method,
				result: null,
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		} catch (e) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				error: {
					code: /** @type any*/ (-32602),
					message: /** @type {Error}*/ (e).message,
				},
			}
		}
	}
}
