import { hexToBytes, hexToNumber } from '@tevm/utils'
import { txToJsonRpcTx } from '../utils/txToJsonRpcTx.js'

/**
 * Request handler for eth_getTransactionByBlockHashAndIndex JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetTransactionByBlockHashAndIndexJsonRpcProcedure}
 */
export const ethGetTransactionByBlockHashAndIndexJsonRpcProcedure = (client) => {
	return /** @type {import('./EthProcedure.js').EthGetTransactionByBlockHashAndIndexJsonRpcProcedure} */ (
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
					...(request.id !== undefined ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					result: null,
				}
			}
			const txIndex = hexToNumber(request.params[1])
			const tx = block.transactions[txIndex]
			if (!tx) {
				return {
					...(request.id !== undefined ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					result: null,
				}
			}
			return {
				method: request.method,
				result: txToJsonRpcTx(tx, block, txIndex),
				jsonrpc: '2.0',
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}
	)
}
