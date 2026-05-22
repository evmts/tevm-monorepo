/**
 * Request handler for anvil_setIntervalMining JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetIntervalMiningProcedure}
 * Pass `0` as the interval to disable interval mining.
 */
export const anvilSetIntervalMiningJsonRpcProcedure = (client) => {
	return async (request) => {
		const interval = request.params[0]

		client.logger.debug({ interval }, 'anvil_setIntervalMining: Setting interval mining')

		// Update the mining configuration to interval mode using the new method
		client.setMiningConfig({
			type: 'interval',
			blockTime: interval,
		})

		client.logger.debug({ miningConfig: client.miningConfig }, 'anvil_setIntervalMining: Mining mode updated')

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: null,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
