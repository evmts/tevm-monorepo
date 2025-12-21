import { debugGetRawTransactionHandler } from './debugGetRawTransactionHandler.js'

/**
 * Request handler for debug_getRawTransaction JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugGetRawTransactionProcedure}
 * @example
 * ```javascript
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { debugGetRawTransactionJsonRpcProcedure } from '@tevm/actions'
 *
 * const client = createMemoryClient()
 * const procedure = debugGetRawTransactionJsonRpcProcedure(client)
 *
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   id: 1,
 *   method: 'debug_getRawTransaction',
 *   params: ['0x1234...']
 * })
 * console.log(response.result) // '0x...' (hex-encoded transaction)
 * ```
 */
export const debugGetRawTransactionJsonRpcProcedure = (client) => {
	/**
	 * @param {import('./DebugJsonRpcRequest.js').DebugGetRawTransactionJsonRpcRequest} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugGetRawTransactionJsonRpcResponse>}
	 */
	return async (request) => {
		const txHash = request.params[0]

		if (!txHash) {
			return {
				method: request.method,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
				error: {
					code: -32602,
					message: 'Invalid params: transaction hash is required',
				},
			}
		}

		try {
			const result = await debugGetRawTransactionHandler(client)({ hash: txHash })

			return {
				method: request.method,
				result,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		} catch (error) {
			client.logger.error(error, 'debugGetRawTransactionJsonRpcProcedure: error getting raw transaction')
			return {
				method: request.method,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
				error: {
					code: -32603,
					message: error instanceof Error ? error.message : 'Internal error',
				},
			}
		}
	}
}
