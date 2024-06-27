import { hexToBytes, numberToHex } from '@tevm/utils'

/**
 * Request handler for eth_getBlockTransactionCountByHash JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./EthProcedure.js').EthGetBlockTransactionCountByHashJsonRpcProcedure}
 */
export const ethGetBlockTransactionCountByHashJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const block = await vm.blockchain.getBlock(hexToBytes(request.params[0]))
		const result = block.transactions.length
		return {
			method: request.method,
			result: numberToHex(result),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
