import { hexToBigInt, hexToNumber } from '@tevm/utils'
import { txToJsonRpcTx } from '../utils/txToJsonRpcTx.js'

/**
 * Request handler for eth_getTransactionByBlockNumberAndIndex JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure}
 */
export const ethGetTransactionByBlockNumberAndIndexJsonRpcProcedure = (client) => {
	return /** @type {import('./EthProcedure.js').EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure} */ (
		async (request) => {
			const vm = await client.getVm()
			const blockTagOrNumber = request.params[0]
			let block
			if (blockTagOrNumber.startsWith('0x')) {
				const blockNumber = hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockTagOrNumber))
				try {
					block = await vm.blockchain.getBlock(blockNumber)
				} catch (_e) {
					block = undefined
				}
			} else {
				block = vm.blockchain.blocksByTag.get(/** @type {import('@tevm/utils').BlockTag}*/ (blockTagOrNumber))
			}
			if (!block) {
				return {
					...(request.id !== undefined ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					result: null,
				}
			}
			const txIndex = hexToNumber(request.params[1])
			const tx = block.transactions[txIndex]
			if (!tx) {
				return {
					...(request.id !== undefined ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					result: null,
				}
			}
			return {
				method: request.method,
				result: txToJsonRpcTx(tx, block, txIndex),
				jsonrpc: '2.0',
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}
	)
}
