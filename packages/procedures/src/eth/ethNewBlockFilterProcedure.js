import { generateRandomId } from '../utils/generateRandomId.js'

/**
 * Request handler for eth_newBlock JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthNewBlockFilterJsonRpcProcedure}
 */
export const ethNewBlockFilterProcedure = (client) => {
	return async (request) => {
		const newBlockFilterRequest =
			/** @type {import('./EthJsonRpcRequest.js').EthNewBlockFilterJsonRpcRequest}*/
			(request)
		const id = generateRandomId()
		/**
		 * @param {import('@tevm/block').Block} block
		 */
		const listener = (block) => {
			const filter = client.getFilters().get(id)
			if (!filter) {
				return
			}
			filter.blocks.push(block)
		}
		client.setFilter({
			id,
			type: 'Block',
			created: Date.now(),
			logs: [],
			tx: [],
			blocks: [],
			installed: {},
			err: undefined,
			registeredListeners: [listener],
		})
		return {
			...(newBlockFilterRequest.id ? { id: newBlockFilterRequest.id } : {}),
			method: newBlockFilterRequest.method,
			jsonrpc: newBlockFilterRequest.jsonrpc,
			result: id,
		}
	}
}
