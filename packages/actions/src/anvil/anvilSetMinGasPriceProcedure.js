/**
 * Request handler for anvil_setMinGasPrice JSON-RPC requests.
 * Sets the minimum gas price for transactions. Transactions with a gas price
 * below this value will be rejected by the transaction pool.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetMinGasPriceProcedure}
 */
export const anvilSetMinGasPriceJsonRpcProcedure = (client) => {
	return async (request) => {
		const minGasPrice = BigInt(request.params[0])
		client.setMinGasPrice(minGasPrice)
		return {
			method: request.method,
			result: null,
			jsonrpc: '2.0',
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
