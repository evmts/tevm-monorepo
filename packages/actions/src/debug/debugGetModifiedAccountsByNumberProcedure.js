import { debugGetModifiedAccountsByNumberHandler } from './debugGetModifiedAccountsByNumberHandler.js'

/**
 * Request handler for debug_getModifiedAccountsByNumber JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugGetModifiedAccountsByNumberProcedure}
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
					...(request.id !== undefined ? { id: request.id } : {}),
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
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}
		}
	)
}
