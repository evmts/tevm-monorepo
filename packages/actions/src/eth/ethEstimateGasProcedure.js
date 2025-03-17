import { toHex } from '@tevm/utils'
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

		try {
			// Let's directly cast the result to the expected format
			// @ts-ignore - We'll handle the type properly in this implementation
			if (!callResult.error && callResult.result) {
				const gasUsed = callResult.result.totalGasSpent ?? callResult.result.executionGasUsed
				/** @type {import('./EthJsonRpcResponse.js').EthEstimateGasJsonRpcResponse} */
				const successResult = {
					jsonrpc: '2.0',
					method: 'eth_estimateGas',
					result: toHex(gasUsed), // Convert BigInt to hex format
					...(estimateGasRequest.id ? { id: estimateGasRequest.id } : {}),
				}
				return successResult
			}

			/** @type {import('./EthJsonRpcResponse.js').EthEstimateGasJsonRpcResponse} */
			const errorResult = {
				jsonrpc: '2.0',
				method: 'eth_estimateGas',
				error: callResult.error ?? {
					code: -32000,
					message: 'Execution error',
				},
				...(estimateGasRequest.id ? { id: estimateGasRequest.id } : {}),
			}
			return errorResult
		} catch (e) {
			/** @type {import('./EthJsonRpcResponse.js').EthEstimateGasJsonRpcResponse} */
			const fallbackResult = {
				jsonrpc: '2.0',
				method: 'eth_estimateGas',
				error: {
					code: -32603,
					message: 'Internal error',
				},
				...(estimateGasRequest.id ? { id: estimateGasRequest.id } : {}),
			}
			return fallbackResult
		}
	}
}
