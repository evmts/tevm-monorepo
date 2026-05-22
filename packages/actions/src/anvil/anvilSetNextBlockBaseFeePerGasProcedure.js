/**
 * Request handler for anvil_setNextBlockBaseFeePerGas JSON-RPC requests.
 * Sets the base fee per gas for the next block only (EIP-1559).
 * After the next block is mined, the base fee will revert to being calculated automatically.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetNextBlockBaseFeePerGasProcedure}
 */
export const anvilSetNextBlockBaseFeePerGasJsonRpcProcedure = (client) => {
	return async (request) => {
		const baseFeePerGas = BigInt(request.params[0])
		client.setNextBlockBaseFeePerGas(baseFeePerGas)
		return {
			method: request.method,
			result: null,
			jsonrpc: '2.0',
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
