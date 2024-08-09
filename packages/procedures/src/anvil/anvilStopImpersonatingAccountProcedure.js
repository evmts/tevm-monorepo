/**
 * Request handler for anvil_stopImpersonatingAccount JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilStopImpersonatingAccountProcedure}
 */
export const anvilStopImpersonatingAccountJsonRpcProcedure = (client) => {
	return async (request) => {
		client.setImpersonatedAccount(undefined)
		return {
			jsonrpc: '2.0',
			method: request.method,
			result: null,
			...(request.id ? { id: request.id } : {}),
		}
	}
}
