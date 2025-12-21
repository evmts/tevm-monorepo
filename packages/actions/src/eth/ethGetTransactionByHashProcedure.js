import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBytes } from '@tevm/utils'
import { txToJsonRpcTx } from '../utils/txToJsonRpcTx.js'

/**
 * Request handler for eth_getTransactionByHash JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetTransactionByHashJsonRpcProcedure}
 */
export const ethGetTransactionByHashJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const receiptsManager = await client.getReceiptsManager()
		const receipt = await receiptsManager.getReceiptByTxHash(hexToBytes(request.params[0]))
		if (!receipt && client.forkTransport) {
			const fetcher = createJsonRpcFetcher(client.forkTransport)
			const res = await fetcher.request({
				jsonrpc: '2.0',
				id: request.id ?? 1,
				method: request.method,
				params: [request.params[0]],
			})
			if (res.error) {
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					error: res.error,
				}
			}
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				result: /** @type any*/ (res.result),
				jsonrpc: '2.0',
			}
		}
		if (!receipt) {
			// Per Ethereum JSON-RPC spec, return null when transaction is not found
			// (e.g., pending transaction not yet mined, or non-existent transaction)
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: '2.0',
				result: null,
			}
		}
		const [_receipt, blockHash, txIndex] = receipt
		const block = await vm.blockchain.getBlock(blockHash)
		const tx = block.transactions[txIndex]
		if (!tx) {
			// Per Ethereum JSON-RPC spec, return null when transaction is not found
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: '2.0',
				result: null,
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
