import { hexToBigInt, hexToNumber } from '@tevm/utils'
import { txToJSONRPCTx } from '../utils/txToJSONRPCTx.js'

/**
 * Request handler for eth_getTransactionByBlockNumberAndIndex JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure}
 */
export const ethGetTransactionByBlockNumberAndIndexJsonRpcProcedure = (client) => {
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
		const txIndex = hexToNumber(request.params[1])
		const tx = block.transactions[txIndex]
		if (!tx) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: -32602,
					message: 'Transaction not found',
				},
			}
		}
		return {
			method: request.method,
			result: txToJSONRPCTx(tx, block, txIndex),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
