import { debugGetModifiedAccountsByNumberHandler } from './debugGetModifiedAccountsByNumberHandler.js'

/**
 * Request handler for debug_getModifiedAccountsByNumber JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugGetModifiedAccountsByNumberProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { debugGetModifiedAccountsByNumberJsonRpcProcedure } from 'tevm/actions'
 *
 * const client = createTevmNode()
 * const procedure = debugGetModifiedAccountsByNumberJsonRpcProcedure(client)
 *
 * const response = await procedure({
 *   id: 1,
 *   jsonrpc: '2.0',
 *   method: 'debug_getModifiedAccountsByNumber',
 *   params: [{
 *     startBlockNumber: '0x64',
 *     endBlockNumber: '0x65'
 *   }]
 * })
 * ```
 */
export const debugGetModifiedAccountsByNumberJsonRpcProcedure = (client) => {
	return /** @type {import('./DebugProcedure.js').DebugGetModifiedAccountsByNumberProcedure} */ (
		async (request) => {
			const { startBlockNumber, endBlockNumber } = request.params[0]

			client.logger.debug(
				{ startBlockNumber, endBlockNumber },
				'debugGetModifiedAccountsByNumberJsonRpcProcedure: processing request',
			)

			try {
				const result = await debugGetModifiedAccountsByNumberHandler(client)({
					startBlockNumber,
					...(endBlockNumber !== undefined ? { endBlockNumber } : {}),
				})

				return {
					method: request.method,
					result,
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			} catch (error) {
				const err = /** @type {Error} */ (error)
				client.logger.error({ error: err }, 'debugGetModifiedAccountsByNumberJsonRpcProcedure: error occurred')

				return {
					method: request.method,
					error: {
						code: /** @type {string} */ ('-32000'),
						message: err.message,
					},
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			}
		}
	)
}
