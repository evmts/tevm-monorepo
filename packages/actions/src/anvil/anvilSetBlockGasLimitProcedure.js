/**
 * Request handler for anvil_setBlockGasLimit JSON-RPC requests.
 * Sets the gas limit for all subsequent blocks (persists across blocks).
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetBlockGasLimitProcedure}
 */
export const anvilSetBlockGasLimitJsonRpcProcedure = (client) => {
	return async (request) => {
		const gasLimit = BigInt(request.params[0])
		client.setNextBlockGasLimit(gasLimit)
		return {
			method: request.method,
			result: null,
			jsonrpc: '2.0',
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
