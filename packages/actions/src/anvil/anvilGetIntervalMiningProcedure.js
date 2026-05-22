/**
 * Request handler for anvil_getIntervalMining JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilGetIntervalMiningProcedure}
 * Returns 0 when interval mining is not configured.
 */
export const anvilGetIntervalMiningJsonRpcProcedure = (client) => {
	return async (request) => {
		client.logger.debug({ miningConfig: client.miningConfig }, 'anvil_getIntervalMining: Getting interval mining')

		// Return the interval if in interval mode, otherwise return 0
		const interval = client.miningConfig.type === 'interval' ? client.miningConfig.blockTime : 0

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: interval,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
