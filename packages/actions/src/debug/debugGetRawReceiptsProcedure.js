import { hexToBigInt } from '@tevm/utils'
import { debugGetRawReceiptsHandler } from './debugGetRawReceiptsHandler.js'

/**
 * Request handler for debug_getRawReceipts JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugGetRawReceiptsProcedure}
 * @example
 * ```javascript
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { debugGetRawReceiptsJsonRpcProcedure } from '@tevm/actions'
 *
 * const client = createMemoryClient()
 * const procedure = debugGetRawReceiptsJsonRpcProcedure(client)
 *
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   id: 1,
 *   method: 'debug_getRawReceipts',
 *   params: ['latest']
 * })
 * console.log(response.result) // ['0x...', '0x...'] (array of hex-encoded RLP receipts)
 * ```
 */
export const debugGetRawReceiptsJsonRpcProcedure = (client) => {
	/**
	 * @param {import('./DebugJsonRpcRequest.js').DebugGetRawReceiptsJsonRpcRequest} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugGetRawReceiptsJsonRpcResponse>}
	 */
	return async (request) => {
		const blockNumberOrTag = request.params[0] ?? 'latest'

		// Parse the parameter as either a block number or tag
		const params = blockNumberOrTag.startsWith('0x')
			? { blockNumber: hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockNumberOrTag)) }
			: { blockTag: /** @type {import('@tevm/utils').BlockTag}*/ (blockNumberOrTag) }

		try {
			const result = await debugGetRawReceiptsHandler(client)(params)

			return {
				method: request.method,
				result,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		} catch (error) {
			client.logger.error(error, 'debugGetRawReceiptsJsonRpcProcedure: error getting raw receipts')
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
