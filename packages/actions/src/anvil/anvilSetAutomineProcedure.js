/**
 * Request handler for anvil_setAutomine JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetAutomineProcedure}
 */
export const anvilSetAutomineJsonRpcProcedure = (client) => {
	return async (request) => {
		const enabled = request.params[0]

		client.logger.debug({ enabled }, 'anvil_setAutomine: Setting automine mode')

		// Update the mining configuration
		if (enabled) {
			client.setMiningConfig({ type: 'auto' })
		} else {
			// When disabling automine, switch to manual mining
			client.setMiningConfig({ type: 'manual' })
		}

		client.logger.debug({ miningConfig: client.miningConfig }, 'anvil_setAutomine: Mining mode updated')

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: null,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
