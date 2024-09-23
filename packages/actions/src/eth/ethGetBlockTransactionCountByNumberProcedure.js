import { hexToBigInt, numberToHex } from '@tevm/utils'

/**
 * Request handler for eth_getBlockTransactionCountByNumber JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetBlockTransactionCountByNumberJsonRpcProcedure}
 */
export const ethGetBlockTransactionCountByNumberJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const blockTagOrNumber = request.params[0]
		const block = await (() => {
			if (blockTagOrNumber.startsWith('0x')) {
				return vm.blockchain.getBlock(hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockTagOrNumber)))
			}
			return vm.blockchain.blocksByTag.get(/** @type {import('@tevm/utils').BlockTag}*/ (blockTagOrNumber))
		})()
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
		const result = block.transactions.length
		return {
			method: request.method,
			result: numberToHex(result),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
