import { callProcedure } from '../Call/callProcedure.js'

/**
 * Request handler for eth_estimateGas JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthEstimateGasJsonRpcProcedure}
 */
export const ethEstimateGasJsonRpcProcedure = (client) => {
	return async (request) => {
		const estimateGasRequest = /** @type {import('./EthJsonRpcRequest.js').EthEstimateGasJsonRpcRequest}*/ (request)
		const [_params, blockTag, stateOverrides, blockOverrides] = estimateGasRequest.params

		const getParams = () => {
			/**
			 * @type {import('../Call/CallJsonRpcRequest.js').CallJsonRpcRequest['params']}
			 */
			const params = [
				{
					..._params,
					...(blockTag !== undefined ? { blockTag } : {}),
				},
			]
			if (blockOverrides !== undefined) {
				params.push(stateOverrides ?? {}, blockOverrides)
			} else if (stateOverrides !== undefined) {
				params.push(stateOverrides)
			}
			return params
		}

		const callResult = await callProcedure(client)({
			...estimateGasRequest,
			params: getParams(),
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
