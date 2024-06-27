/**
 * Request handler for eth_uninstallFilter JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./EthProcedure.js').EthUninstallFilterJsonRpcProcedure}
 */
export const ethUninstallFilterJsonRpcProcedure = (client) => {
	return async (request) => {
		const uninstallFilterRequest =
			/** @type {import('./EthJsonRpcRequest.js').EthUninstallFilterJsonRpcRequest}*/
			(request)
		const [filterId] = uninstallFilterRequest.params
		const filter = client.getFilters().get(filterId)
		if (!filter) {
			return {
				...(uninstallFilterRequest.id ? { id: uninstallFilterRequest.id } : {}),
				method: uninstallFilterRequest.method,
				jsonrpc: uninstallFilterRequest.jsonrpc,
				result: false,
			}
		}

		const [listener] = filter.registeredListeners
		if (filter.type === 'Log' && listener) {
			client.removeListener('newLog', listener)
		} else if (filter.type === 'Block' && listener) {
			client.removeListener('newBlock', listener)
		} else if (filter.type === 'PendingTransaction' && listener) {
			client.removeListener('newPendingTransaction', listener)
		}
		client.removeFilter(filterId)
		return {
			...(request.id ? { id: request.id } : {}),
			method: request.method,
			jsonrpc: request.jsonrpc,
			result: true,
		}
	}
}
