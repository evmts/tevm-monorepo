/**
 * Request handler for eth_coinbase JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthCoinbaseJsonRpcProcedure}
 */
export const ethCoinbaseJsonRpcProcedure = (client) => {
	return async (request) => {
		try {
			// same default as hardhat
			const result = await client
				.getVm()
				.then((vm) => vm.blockchain.getCanonicalHeadBlock())
				.then((block) => /** @type {import('@tevm/utils').Address}*/ (block.header.coinbase.toString()))

			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				result,
			}
		} catch (error) {
			return {
				...(request.id ? { id: request.id } : {}),
				jsonrpc: '2.0',
				method: request.method,
				error: {
					code: -32000,
					message: error instanceof Error ? error.message : String(error),
				},
			}
		}
	}
}
