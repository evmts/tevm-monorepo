/**
 * JSON-RPC procedure for anvil_setNextBlockTimestamp
 * Sets the timestamp of the next block
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetNextBlockTimestampProcedure}
 * @example
 * ```typescript
 * const response = await client.request({
 *   method: 'anvil_setNextBlockTimestamp',
 *   params: ['0x61234567'], // Unix timestamp
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * // response.result will be null
 * ```
 */
export const anvilSetNextBlockTimestampJsonRpcProcedure = (client) => async (request) => {
	const timestamp = BigInt(request.params[0])
	client.setNextBlockTimestamp(timestamp)
	return {
		method: request.method,
		result: null,
		jsonrpc: /** @type {const} */ ('2.0'),
		...(request.id ? { id: request.id } : {}),
	}
}
