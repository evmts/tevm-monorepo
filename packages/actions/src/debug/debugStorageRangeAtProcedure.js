import { debugStorageRangeAtHandler } from './debugStorageRangeAtHandler.js'

/**
 * Request handler for debug_storageRangeAt JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugStorageRangeAtProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { debugStorageRangeAtJsonRpcProcedure } from 'tevm/actions'
 *
 * const client = createTevmNode()
 * const procedure = debugStorageRangeAtJsonRpcProcedure(client)
 *
 * const response = await procedure({
 *   id: 1,
 *   jsonrpc: '2.0',
 *   method: 'debug_storageRangeAt',
 *   params: [{
 *     blockTag: 'latest',
 *     txIndex: 0,
 *     address: '0x1234...',
 *     startKey: '0x0',
 *     maxResult: 100
 *   }]
 * })
 * ```
 */
export const debugStorageRangeAtJsonRpcProcedure = (client) => {
	return async (request) => {
		const { blockTag, txIndex, address, startKey, maxResult } = request.params[0]

		client.logger.debug(
			{ blockTag, txIndex, address, startKey, maxResult },
			'debugStorageRangeAtJsonRpcProcedure: processing request',
		)

		try {
			const result = await debugStorageRangeAtHandler(client)({
				blockTag: blockTag ?? 'latest',
				txIndex,
				address,
				startKey,
				maxResult,
			})

			return {
				method: request.method,
				result,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		} catch (error) {
			const err = /** @type {Error} */ (error)
			client.logger.error({ error: err }, 'debugStorageRangeAtJsonRpcProcedure: error occurred')

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
}
