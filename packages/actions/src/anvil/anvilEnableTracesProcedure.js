/**
 * Request handler for anvil_enableTraces JSON-RPC requests.
 * Enables or disables automatic trace collection for all transactions.
 * When enabled, all executed transactions include traces in their responses.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilEnableTracesProcedure}
 */
export const anvilEnableTracesJsonRpcProcedure = (client) => {
	return async (request) => {
		const enabled = request.params[0] ?? true

		client.setTracesEnabled(enabled)

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: null,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
