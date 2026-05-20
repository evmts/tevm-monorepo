import { hexToBytes } from '@tevm/utils'
import { blockToJsonRpcBlock } from '../utils/blockToJsonRpcBlock.js'

/**
 * Request handler for eth_getBlockByHash JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetBlockByHashJsonRpcProcedure}
 */
export const ethGetBlockByHashJsonRpcProcedure = (client) => {
	return /** @type {import('./EthProcedure.js').EthGetBlockByHashJsonRpcProcedure} */ (
		async (request) => {
			const vm = await client.getVm()
			const blockHash = hexToBytes(request.params[0])
			let block
			try {
				block = await vm.blockchain.getBlock(blockHash)
			} catch (_e) {
				block = undefined
			}
			if (!block) {
				return {
					method: request.method,
					result: null,
					jsonrpc: '2.0',
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}
			const includeTransactions = request.params[1] ?? false
			const result = await blockToJsonRpcBlock(block, includeTransactions)
			return {
				method: request.method,
				result,
				jsonrpc: '2.0',
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}
	)
}
