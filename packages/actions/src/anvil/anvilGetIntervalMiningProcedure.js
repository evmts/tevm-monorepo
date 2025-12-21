/**
 * Request handler for anvil_getIntervalMining JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilGetIntervalMiningProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilGetIntervalMiningJsonRpcProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode({ miningConfig: { type: 'interval', blockTime: 5 } })
 * const procedure = anvilGetIntervalMiningJsonRpcProcedure(node)
 *
 * const result = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_getIntervalMining',
 *   params: [],
 *   id: 1
 * })
 *
 * console.log(result) // { jsonrpc: '2.0', method: 'anvil_getIntervalMining', result: 5, id: 1 }
 * ```
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
			...(request.id ? { id: request.id } : {}),
		}
	}
}
