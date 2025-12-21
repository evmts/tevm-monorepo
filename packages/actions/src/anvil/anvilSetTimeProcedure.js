/**
 * JSON-RPC procedure for anvil_setTime
 * Sets the current block timestamp. This is similar to anvil_setNextBlockTimestamp,
 * but sets the timestamp for the next block to mine.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetTimeProcedure}
 * @example
 * ```typescript
 * const response = await client.request({
 *   method: 'anvil_setTime',
 *   params: ['0x61234567'], // Unix timestamp or number
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * // response.result will be the new timestamp
 * ```
 */
export const anvilSetTimeJsonRpcProcedure = (client) => (request) => {
	const timestamp = BigInt(request.params[0])
	client.setNextBlockTimestamp(timestamp)
	return {
		method: request.method,
		result: `0x${timestamp.toString(16)}`,
		jsonrpc: '2.0',
		...(request.id ? { id: request.id } : {}),
	}
}
