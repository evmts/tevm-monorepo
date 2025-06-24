import { numberToHex } from '@tevm/utils'

/**
 * Request handler for eth_coinbase JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthBlobBaseFeeJsonRpcProcedure}
 */
export const ethBlobBaseFeeJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const headBlock = await vm.blockchain.getCanonicalHeadBlock()
		return {
			result: numberToHex(headBlock.header.calcNextBlobGasPrice()),
			jsonrpc: '2.0',
			method: request.method,
			...(request.id ? { id: request.id } : {}),
		}
	}
}
