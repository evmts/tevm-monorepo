/**
 * Request handler for anvil_setIntervalMining JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetIntervalMiningProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilSetIntervalMiningJsonRpcProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const procedure = anvilSetIntervalMiningJsonRpcProcedure(node)
 *
 * // Enable interval mining with 5 second block time
 * const result = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_setIntervalMining',
 *   params: [5],
 *   id: 1
 * })
 *
 * console.log(result) // { jsonrpc: '2.0', method: 'anvil_setIntervalMining', result: null, id: 1 }
 *
 * // Disable interval mining (blocks only mine via anvil_mine)
 * const disableResult = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_setIntervalMining',
 *   params: [0],
 *   id: 2
 * })
 * ```
 */
export const anvilSetIntervalMiningJsonRpcProcedure = (client) => {
	return async (request) => {
		const interval = request.params[0]

		client.logger.debug({ interval }, 'anvil_setIntervalMining: Setting interval mining')

		// Use the new setMiningConfig method to properly start/stop interval mining
		if (interval === 0) {
			// Setting interval to 0 disables interval mining (manual mode)
			client.setMiningConfig({ type: 'manual' })
		} else {
			// Set interval mode with the specified block time
			client.setMiningConfig({
				type: 'interval',
				blockTime: interval,
			})
		}

		client.logger.debug({ miningConfig: client.miningConfig }, 'anvil_setIntervalMining: Mining mode updated')

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: null,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
