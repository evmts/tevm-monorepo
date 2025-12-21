/**
 * Request handler for anvil_setAutomine JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetAutomineProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilSetAutomineJsonRpcProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const procedure = anvilSetAutomineJsonRpcProcedure(node)
 *
 * const result = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_setAutomine',
 *   params: [true],
 *   id: 1
 * })
 *
 * console.log(result) // { jsonrpc: '2.0', method: 'anvil_setAutomine', result: null, id: 1 }
 * ```
 */
export const anvilSetAutomineJsonRpcProcedure = (client) => {
	return async (request) => {
		const enabled = request.params[0]

		client.logger.debug({ enabled }, 'anvil_setAutomine: Setting automine mode')

		// Update the mining configuration
		if (enabled) {
			client.miningConfig = { type: 'auto' }
		} else {
			// When disabling automine, switch to manual mining
			client.miningConfig = { type: 'manual' }
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
