import { getAddress, hexToBytes } from '@tevm/utils'

/**
 * Request handler for anvil_removePoolTransactions JSON-RPC requests.
 * Removes all transactions from the pool sent by the given address.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilRemovePoolTransactionsProcedure}
 * @example
 * ```typescript
 * const result = await client.request({
 *   method: 'anvil_removePoolTransactions',
 *   params: ['0x1234567890123456789012345678901234567890'],
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * console.log(result) // { jsonrpc: '2.0', id: 1, method: 'anvil_removePoolTransactions', result: null }
 * ```
 */
export const anvilRemovePoolTransactionsJsonRpcProcedure = (client) => {
	return async (request) => {
		const address = getAddress(request.params[0])
		const txPool = await client.getTxPool()

		// Get all transactions from this address
		const addressBytes = hexToBytes(address)
		const txs = await txPool.getBySenderAddress({
			toString: () => address,
			toBytes: () => addressBytes,
			equals: (/** @type {any} */ other) => address.toLowerCase() === other.toString().toLowerCase(),
		})

		// Remove each transaction
		for (const txObj of txs) {
			txPool.removeByHash(txObj.hash)
		}

		return {
			method: request.method,
			jsonrpc: '2.0',
			result: null,
			...(request.id ? { id: request.id } : {}),
		}
	}
}
