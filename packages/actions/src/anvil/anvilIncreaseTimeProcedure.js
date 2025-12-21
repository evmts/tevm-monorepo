/**
 * JSON-RPC procedure for anvil_increaseTime
 * Jump forward in time by the given amount of time, in seconds.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilIncreaseTimeProcedure}
 * @example
 * ```typescript
 * const response = await client.request({
 *   method: 'anvil_increaseTime',
 *   params: ['0x3c'], // 60 seconds
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * // response.result will be '0x3c' (the number of seconds increased)
 * ```
 */
export const anvilIncreaseTimeJsonRpcProcedure = (client) => async (request) => {
	const seconds = BigInt(request.params[0])
	const vm = await client.getVm()
	const latestBlock = await vm.blockchain.getCanonicalHeadBlock()
	const currentTimestamp = latestBlock.header.timestamp
	const newTimestamp = currentTimestamp + seconds
	client.setNextBlockTimestamp(newTimestamp)
	return {
		method: request.method,
		// Return the number of seconds increased (as hex, matching ganache behavior)
		result: `0x${seconds.toString(16)}`,
		jsonrpc: '2.0',
		...(request.id ? { id: request.id } : {}),
	}
}
