import { callProcedure } from '../call/callProcedure.js'

/**
 * Request handler for eth_estimateGas JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthEstimateGasJsonRpcProcedure}
 */
export const ethEstimateGasJsonRpcProcedure = (client) => {
	return async (request) => {
		const estimateGasRequest = /** @type {import('./EthJsonRpcRequest.js').EthEstimateGasJsonRpcRequest}*/ (request)
		const callResult = await callProcedure(client)({
			...estimateGasRequest,
			params: [...estimateGasRequest.params],
			method: 'tevm_call',
		})
		if (callResult.error || !callResult.result) {
			return {
				...callResult,
				method: estimateGasRequest.method,
			}
		}
		return {
			method: estimateGasRequest.method,
			result: callResult.result.totalGasSpent ?? callResult.result.executionGasUsed,
			jsonrpc: '2.0',
			...(estimateGasRequest.id ? { id: estimateGasRequest.id } : {}),
		}
	}
}
