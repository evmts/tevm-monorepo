import { generateRandomId } from '../utils/generateRandomId.js'

/**
 * Request handler for eth_newPendingTransactionFilter JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthNewPendingTransactionFilterJsonRpcProcedure}
 */
export const ethNewPendingTransactionFilterProcedure = (client) => {
	return async (request) => {
		await client.ready()
		const id = generateRandomId()
		/**
		 * @param {import('@evmts/zevm/tx').TypedTransaction} tx
		 */
		const listener = (tx) => {
			const filter = client.getFilters().get(id)
			if (!filter) {
				return
			}
			filter.tx.push(tx)
		}
		client.on('newPendingTransaction', listener)
		client.setFilter({
			id,
			type: 'PendingTransaction',
			created: Date.now(),
			logs: [],
			tx: [],
			blocks: [],
			installed: {},
			err: undefined,
			registeredListeners: [listener],
		})
		return {
			...(request.id !== undefined ? { id: request.id } : {}),
			method: request.method,
			jsonrpc: request.jsonrpc,
			result: id,
		}
	}
}
