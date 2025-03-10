import { hexToBytes } from '@tevm/utils'

/**
 * Request handler for anvil_dropTransaction JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilDropTransactionProcedure}
 */
export const anvilDropTransactionJsonRpcProcedure = (client) => {
	return async (request) => {
		const anvilDropTransactionRequest =
			/** @type {import('./AnvilJsonRpcRequest.js').AnvilDropTransactionJsonRpcRequest}*/
			(request)
		const txHash = anvilDropTransactionRequest.params[0].transactionHash
		const txPool = await client.getTxPool()
		if (/** @type {any[]}*/ (txPool.getByHash([hexToBytes(txHash)])).length > 0) {
			txPool.removeByHash(txHash)
		} else {
			throw new Error(
				'Only tx in the txpool are allowed to be dropped. Dropping transactions that have already been mined is not yet supported',
			)
		}
		return {
			method: anvilDropTransactionRequest.method,
			jsonrpc: '2.0',
			result: null,
			...(anvilDropTransactionRequest.id ? { id: anvilDropTransactionRequest.id } : {}),
		}
	}
}
