/**
 * Request handler for eth_coinbase JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./EthProcedure.js').EthCoinbaseJsonRpcProcedure}
 */
export const ethCoinbaseJsonRpcProcedure = (client) => {
	return async (request) => {
		return {
			...(request.id ? { id: request.id } : {}),
			method: request.method,
			jsonrpc: request.jsonrpc,
			// same default as hardhat
			result: await client
				.getVm()
				.then((vm) => vm.blockchain.getCanonicalHeadBlock())
				.then((block) => /** @type {import('@tevm/utils').Address}*/ (block.header.coinbase.toString())),
		}
	}
}
