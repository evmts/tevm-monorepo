/**
 * Request handler for anvil_getAutomine JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./AnvilProcedure.js').AnvilGetAutomineProcedure}
 */
export const anvilGetAutomineJsonRpcProcedure = (client) => {
	return async (request) => {
		return {
			jsonrpc: '2.0',
			method: request.method,
			result: client.miningConfig.type === 'auto',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
