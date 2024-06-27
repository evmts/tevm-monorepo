import { hexToBytes, hexToNumber } from '@tevm/utils'
import { txToJsonRpcTx } from '../utils/txToJsonRpcTx.js'

/**
 * Request handler for eth_getTransactionByBlockHashAndIndex JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./EthProcedure.js').EthGetTransactionByBlockHashAndIndexJsonRpcProcedure}
 */
export const ethGetTransactionByBlockHashAndIndexJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const block = await vm.blockchain.getBlock(hexToBytes(request.params[0]))
		const txIndex = hexToNumber(request.params[1])
		const tx = block.transactions[txIndex]
		if (!tx) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: -32602,
					message: 'Transaction not found',
				},
			}
		}
		return {
			method: request.method,
			result: txToJsonRpcTx(tx, block, txIndex),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
