/**
 * Request handler for anvil_autoImpersonateAccount JSON-RPC requests.
 * Enables or disables automatic impersonation of all transaction senders.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilAutoImpersonateAccountProcedure}
 */
export const anvilAutoImpersonateAccountJsonRpcProcedure = (client) => {
	return async (request) => {
		try {
			const enabled = request.params[0]
			client.setAutoImpersonate(enabled)
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				result: null,
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
