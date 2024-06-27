import { ethGetLogsHandler } from '@tevm/actions'
import { numberToHex } from '@tevm/utils'

/**
 * Request handler for eth_getFilterLogs JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./EthProcedure.js').EthGetFilterLogsJsonRpcProcedure}
 */
export const ethGetFilterLogsProcedure = (client) => {
	return async (request) => {
		const filter = client.getFilters().get(request.params[0])
		if (!filter) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: -32602,
					message: 'Filter not found',
				},
			}
		}
		try {
			const ethGetLogsResult = await ethGetLogsHandler(client)({
				filterParams: {
					fromBlock: filter.logsCriteria.fromBlock,
					toBlock: filter.logsCriteria.toBlock,
					address: filter.logsCriteria.address,
					topics: filter.logsCriteria.topics,
				},
			})
			/**
			 * @type {Required<import('./EthJsonRpcResponse.js').EthGetFilterLogsJsonRpcResponse>['result']}
			 */
			const jsonRpcResult = ethGetLogsResult.map((log) => ({
				address: log.address,
				topics: [...log.topics],
				data: log.data,
				blockNumber: numberToHex(log.blockNumber),
				transactionHash: log.transactionHash,
				transactionIndex: numberToHex(log.transactionIndex),
				blockHash: log.blockHash,
				logIndex: numberToHex(log.logIndex),
				removed: log.removed,
			}))
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				result: jsonRpcResult,
			}
		} catch (e) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: -32601,
					message: /** @type {Error}*/ (e).message,
				},
			}
		}
	}
}
