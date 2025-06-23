import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt } from '@tevm/utils'
import { blockToJsonRpcBlock } from '../utils/blockToJsonRpcBlock.js'

/**
 * Request handler for eth_getBlockByNumber JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetBlockByNumberJsonRpcProcedure}
 */
export const ethGetBlockByNumberJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const blockTagOrNumber = request.params[0]
		const block = await (() => {
			if (blockTagOrNumber.startsWith('0x')) {
				return vm.blockchain.getBlock(hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockTagOrNumber)))
			}
			return vm.blockchain.blocksByTag.get(/** @type {import('@tevm/utils').BlockTag}*/ (blockTagOrNumber))
		})()

		if (!block && client.forkTransport) {
			const fetcher = createJsonRpcFetcher(client.forkTransport)
			const res = await fetcher.request({
				jsonrpc: '2.0',
				id: request.id ?? 1,
				method: request.method,
				params: [blockTagOrNumber, request.params[1] ?? false],
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
				jsonrpc: request.jsonrpc,
				result: /** @type {any}*/ (res.result),
			}
		}
		if (!block) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: -32602,
					message: `Invalid block tag ${blockTagOrNumber}`,
				},
			}
		}
		const includeTransactions = request.params[1] ?? false
		const result = await blockToJsonRpcBlock(block, includeTransactions)
		return {
			method: request.method,
			result,
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
