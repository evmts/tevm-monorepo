import { hexToBigInt } from '@tevm/utils'
import { handleAutomining } from '../Call/handleAutomining.js'
import { ethSendTransactionHandler } from './ethSendTransactionHandler.js'

/**
 * Request handler for eth_sendTransaction JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthSendTransactionJsonRpcProcedure}
 */
export const ethSendTransactionJsonRpcProcedure = (client) => {
	return async (request) => {
		const sendTransactionRequest = /** @type {import('./EthJsonRpcRequest.js').EthSendTransactionJsonRpcRequest}*/ (
			request
		)
		const txHash = await ethSendTransactionHandler(client)({
			...(request.params[0].from ? { from: request.params[0].from } : {}),
			...(request.params[0].data ? { data: request.params[0].data } : {}),
			...(request.params[0].to ? { to: request.params[0].to } : {}),
			...(request.params[0].gas ? { gas: hexToBigInt(request.params[0].gas) } : {}),
			...(request.params[0].gasPrice ? { gasPrice: hexToBigInt(request.params[0].gasPrice) } : {}),
			...(request.params[0].value ? { value: hexToBigInt(request.params[0].value) } : {}),
		})
		if (client.miningConfig.type === 'auto') {
			await handleAutomining(client, txHash, false, true)
		}
		return {
			method: sendTransactionRequest.method,
			result: txHash,
			jsonrpc: '2.0',
			...(sendTransactionRequest.id ? { id: sendTransactionRequest.id } : {}),
		}
	}
}
