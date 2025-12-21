import { hexToBigInt } from '@tevm/utils'
import { debugGetRawHeaderHandler } from './debugGetRawHeaderHandler.js'

/**
 * Request handler for debug_getRawHeader JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugGetRawHeaderProcedure}
 * @example
 * ```javascript
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { debugGetRawHeaderJsonRpcProcedure } from '@tevm/actions'
 *
 * const client = createMemoryClient()
 * const procedure = debugGetRawHeaderJsonRpcProcedure(client)
 *
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   id: 1,
 *   method: 'debug_getRawHeader',
 *   params: ['latest']
 * })
 * console.log(response.result) // '0x...' (hex-encoded RLP)
 * ```
 */
export const debugGetRawHeaderJsonRpcProcedure = (client) => {
	/**
	 * @param {import('./DebugJsonRpcRequest.js').DebugGetRawHeaderJsonRpcRequest} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugGetRawHeaderJsonRpcResponse>}
	 */
	return async (request) => {
		const blockNumberOrTag = request.params[0] ?? 'latest'

		// Parse the parameter as either a block number or tag
		const params =
			typeof blockNumberOrTag === 'string' && blockNumberOrTag.startsWith('0x')
				? { blockNumber: hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockNumberOrTag)) }
				: { blockTag: /** @type {import('@tevm/utils').BlockTag}*/ (blockNumberOrTag) }

		try {
			const result = await debugGetRawHeaderHandler(client)(params)

			return {
				method: request.method,
				result,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		} catch (error) {
			client.logger.error(error, 'debugGetRawHeaderJsonRpcProcedure: error getting raw header')
			return {
				method: request.method,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
				error: {
					code: /** @type {string} */ ('-32603'),
					message: error instanceof Error ? error.message : 'Internal error',
				},
			}
		}
	}
}
