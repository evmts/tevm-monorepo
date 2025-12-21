import { debugDumpBlockHandler } from './debugDumpBlockHandler.js'

/**
 * Request handler for debug_dumpBlock JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugDumpBlockProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { debugDumpBlockJsonRpcProcedure } from 'tevm/actions'
 *
 * const client = createTevmNode()
 * const procedure = debugDumpBlockJsonRpcProcedure(client)
 *
 * const response = await procedure({
 *   id: 1,
 *   jsonrpc: '2.0',
 *   method: 'debug_dumpBlock',
 *   params: [{ blockTag: 'latest' }]
 * })
 * ```
 */
export const debugDumpBlockJsonRpcProcedure = (client) => {
	return async (request) => {
		const { blockTag } = request.params[0]

		client.logger.debug({ blockTag }, 'debugDumpBlockJsonRpcProcedure: processing request')

		try {
			const result = await debugDumpBlockHandler(client)({
				blockTag: blockTag ?? 'latest',
			})

			return {
				method: request.method,
				result,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		} catch (error) {
			const err = /** @type {Error} */ (error)
			client.logger.error({ error: err }, 'debugDumpBlockJsonRpcProcedure: error occurred')

			return {
				method: request.method,
				error: {
					code: -32000,
					message: err.message,
				},
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		}
	}
}
