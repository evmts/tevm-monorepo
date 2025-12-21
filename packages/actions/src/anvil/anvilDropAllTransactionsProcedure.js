/**
 * Request handler for anvil_dropAllTransactions JSON-RPC requests.
 * Removes all transactions from the transaction pool.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilDropAllTransactionsProcedure}
 * @example
 * ```typescript
 * const result = await client.request({
 *   method: 'anvil_dropAllTransactions',
 *   params: [],
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * console.log(result) // { jsonrpc: '2.0', id: 1, method: 'anvil_dropAllTransactions', result: null }
 * ```
 */
export const anvilDropAllTransactionsJsonRpcProcedure = (client) => {
	return async (request) => {
		const txPool = await client.getTxPool()
		await txPool.clear()
		return {
			method: request.method,
			jsonrpc: '2.0',
			result: null,
			...(request.id ? { id: request.id } : {}),
		}
	}
}
