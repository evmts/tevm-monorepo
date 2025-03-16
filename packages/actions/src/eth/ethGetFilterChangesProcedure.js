import { bytesToHex, numberToHex } from '@tevm/utils'

/**
 * Request handler for eth_getFilterChanges JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetFilterChangesJsonRpcProcedure}
 */
export const ethGetFilterChangesProcedure = (client) => {
	return async (request) => {
		const getFilterChangesRequest =
			/** @type {import('./EthJsonRpcRequest.js').EthGetFilterChangesJsonRpcRequest}*/
			(request)
		const [id] = getFilterChangesRequest.params
		const filter = client.getFilters().get(id)
		if (!filter) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: -32601,
					message: 'Method not implemented yet',
				},
			}
		}
		switch (filter.type) {
			case 'Log': {
				const { logs } = filter
				/**
				 * @type {import('./EthJsonRpcResponse.js').EthGetFilterChangesJsonRpcResponse}
				 */
				const response = {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					result: logs.map((log) => ({
						address: log.address,
						topics: log.topics,
						data: log.data,
						blockNumber: log.blockNumber !== null ? numberToHex(log.blockNumber) : null,
						transactionHash: log.transactionHash,
						transactionIndex: log.transactionIndex !== null ? numberToHex(log.transactionIndex) : null,
						blockHash: log.blockHash,
						logIndex: log.logIndex !== null ? numberToHex(log.logIndex) : null,
						removed: log.removed,
					})),
				}
				filter.logs = []
				return response
			}
			case 'Block': {
				const { blocks } = filter
				/**
				 * @type {import('./EthJsonRpcResponse.js').EthGetFilterChangesJsonRpcResponse}
				 */
				const response = {
					...(request.id ? { id: request.id } : {}),
					// TODO fix this type
					result: /** @type {any} */ (blocks.map((block) => numberToHex(block.header.number))),
					method: request.method,
					jsonrpc: request.jsonrpc,
				}
				filter.blocks = []
				return response
			}
			case 'PendingTransaction': {
				const { tx } = filter
				/**
				 * @type {import('./EthJsonRpcResponse.js').EthGetFilterChangesJsonRpcResponse}
				 */
				const response = {
					...(request.id ? { id: request.id } : {}),
					// TODO fix this type
					result: /** @type {any} */ (tx.map((tx) => bytesToHex(tx.hash()))),
					method: request.method,
					jsonrpc: request.jsonrpc,
				}
				filter.tx = []
				return response
			}
			default: {
				throw new Error(
					'InternalError: Unknown filter type. This indicates a bug in tevm or potentially a typo in filter type if manually added',
				)
			}
		}
	}
}
