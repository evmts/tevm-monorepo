import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt, hexToBytes, numberToHex } from '@tevm/utils'
import { blockToJsonRpcBlock } from '../utils/blockToJsonRpcBlock.js'

/**
 * Request handler for eth_getBlockByHash JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./EthProcedure.js').EthGetBlockByHashJsonRpcProcedure}
 */
export const ethGetBlockByHashJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const block = await vm.blockchain.getBlock(hexToBytes(request.params[0]))
		const includeTransactions = request.params[1] ?? false
		return {
			method: request.method,
			result: blockToJsonRpcBlock(block, includeTransactions),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
