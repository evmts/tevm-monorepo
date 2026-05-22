import { debugGetModifiedAccountsByHashHandler } from './debugGetModifiedAccountsByHashHandler.js'

/**
 * Request handler for debug_getModifiedAccountsByHash JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugGetModifiedAccountsByHashProcedure}
 */
export const debugGetModifiedAccountsByHashJsonRpcProcedure = (client) => {
	return /** @type {import('./DebugProcedure.js').DebugGetModifiedAccountsByHashProcedure} */ (
		async (request) => {
			const { startBlockHash, endBlockHash } = request.params[0]

			client.logger.debug(
				{ startBlockHash, endBlockHash },
				'debugGetModifiedAccountsByHashJsonRpcProcedure: processing request',
			)

			try {
				const result = await debugGetModifiedAccountsByHashHandler(client)({
					startBlockHash,
					...(endBlockHash !== undefined ? { endBlockHash } : {}),
				})

				return {
					method: request.method,
					result,
					jsonrpc: '2.0',
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			} catch (error) {
				const err = /** @type {Error} */ (error)
				client.logger.error({ error: err }, 'debugGetModifiedAccountsByHashJsonRpcProcedure: error occurred')

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
