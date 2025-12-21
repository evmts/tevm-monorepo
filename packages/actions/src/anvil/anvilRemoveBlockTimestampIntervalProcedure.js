/**
 * JSON-RPC procedure for anvil_removeBlockTimestampInterval
 * Removes the automatic timestamp interval between blocks
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilRemoveBlockTimestampIntervalProcedure}
 * @example
 * ```typescript
 * const response = await client.request({
 *   method: 'anvil_removeBlockTimestampInterval',
 *   params: [],
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * // response.result will be true
 * ```
 */
export const anvilRemoveBlockTimestampIntervalJsonRpcProcedure = (client) => async (request) => {
	client.setBlockTimestampInterval(undefined)
	return {
		method: request.method,
		result: true,
		jsonrpc: /** @type {const} */ ('2.0'),
		...(request.id ? { id: request.id } : {}),
	}
}
