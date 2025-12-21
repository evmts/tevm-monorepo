import { debugGetModifiedAccountsByHashHandler } from './debugGetModifiedAccountsByHashHandler.js'

/**
 * Request handler for debug_getModifiedAccountsByHash JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugGetModifiedAccountsByHashProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { debugGetModifiedAccountsByHashJsonRpcProcedure } from 'tevm/actions'
 *
 * const client = createTevmNode()
 * const procedure = debugGetModifiedAccountsByHashJsonRpcProcedure(client)
 *
 * const response = await procedure({
 *   id: 1,
 *   jsonrpc: '2.0',
 *   method: 'debug_getModifiedAccountsByHash',
 *   params: [{
 *     startBlockHash: '0xabc...',
 *     endBlockHash: '0xdef...'
 *   }]
 * })
 * ```
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
					...(request.id ? { id: request.id } : {}),
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
					...(request.id ? { id: request.id } : {}),
				}
			}
		}
	)
}
