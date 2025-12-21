/**
 * JSON-RPC procedure for anvil_setBlockTimestampInterval
 * Sets the interval (in seconds) to automatically add to timestamps between blocks
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetBlockTimestampIntervalProcedure}
 * @example
 * ```typescript
 * const response = await client.request({
 *   method: 'anvil_setBlockTimestampInterval',
 *   params: ['0xc'], // 12 seconds between each block
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * // response.result will be null
 * ```
 */
export const anvilSetBlockTimestampIntervalJsonRpcProcedure = (client) => async (request) => {
	const interval = BigInt(request.params[0])
	client.setBlockTimestampInterval(interval)
	return {
		method: request.method,
		result: null,
		jsonrpc: /** @type {const} */ ('2.0'),
		...(request.id ? { id: request.id } : {}),
	}
}
