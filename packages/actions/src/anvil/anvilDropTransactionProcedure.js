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
		const param = /** @type {any} */ (anvilDropTransactionRequest.params[0])
		const txHash = typeof param === 'string' ? param : param?.transactionHash
		if (typeof txHash !== 'string' || !/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
			return {
				method: anvilDropTransactionRequest.method,
				jsonrpc: '2.0',
				error: {
					code: /** @type any*/ (-32602),
					message: 'Invalid transaction hash',
				},
				...(anvilDropTransactionRequest.id !== undefined ? { id: anvilDropTransactionRequest.id } : {}),
			}
		}
		const txPool = await client.getTxPool()
		if (/** @type {any[]}*/ (txPool.getByHash([hexToBytes(/** @type {import('@tevm/utils').Hex} */ (txHash))])).length > 0) {
			txPool.removeByHash(txHash)
		} else {
			return {
				method: anvilDropTransactionRequest.method,
				jsonrpc: '2.0',
				error: {
					code: /** @type any*/ (-32602),
					message:
						'Only tx in the txpool are allowed to be dropped. Dropping transactions that have already been mined is not yet supported',
				},
				...(anvilDropTransactionRequest.id !== undefined ? { id: anvilDropTransactionRequest.id } : {}),
			}
		}
		return {
			method: anvilDropTransactionRequest.method,
			jsonrpc: '2.0',
			result: null,
			...(anvilDropTransactionRequest.id !== undefined ? { id: anvilDropTransactionRequest.id } : {}),
		}
	}
}
