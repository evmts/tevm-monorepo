import { ethSimulateV2Handler } from './ethSimulateV2Handler.js'

/**
 * Creates a JSON-RPC procedure for eth_simulateV2
 * Handles the JSON-RPC protocol conversion for the simulate handler
 * 
 * @param {import('@tevm/node').TevmNode} client - The TEVM client instance
 * @returns {import('./EthSimulateV2JsonRpc.js').EthSimulateV2JsonRpcProcedure} The JSON-RPC procedure
 * 
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { ethSimulateV2Procedure } from 'tevm/actions'
 * 
 * const client = createTevmNode()
 * const procedure = ethSimulateV2Procedure(client)
 * 
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'eth_simulateV2',
 *   params: [{
 *     calls: [
 *       {
 *         from: '0x1234...',
 *         to: '0x5678...',
 *         value: '0xde0b6b3a7640000'
 *       }
 *     ]
 *   }],
 *   id: 1
 * })
 * ```
 */
export const ethSimulateV2Procedure = (client) => async (req) => {
	try {
		const [simulateParams] = req.params || []
		
		if (!simulateParams) {
			return {
				jsonrpc: req.jsonrpc,
				method: 'eth_simulateV2',
				error: {
					code: -32602,
					message: 'Invalid params: eth_simulateV2 requires simulation parameters'
				},
				...(req.id !== undefined ? { id: req.id } : {}),
			}
		}

		// Convert JSON-RPC hex values to appropriate types
		const convertedParams = {
			...simulateParams,
			calls: simulateParams.calls?.map(call => ({
				...call,
				value: call.value ? BigInt(call.value) : undefined,
				gas: call.gas ? BigInt(call.gas) : undefined,
				gasPrice: call.gasPrice ? BigInt(call.gasPrice) : undefined,
				maxFeePerGas: call.maxFeePerGas ? BigInt(call.maxFeePerGas) : undefined,
				maxPriorityFeePerGas: call.maxPriorityFeePerGas ? BigInt(call.maxPriorityFeePerGas) : undefined,
			})),
			blockOverrides: simulateParams.blockOverrides ? {
				...simulateParams.blockOverrides,
				number: simulateParams.blockOverrides.number ? BigInt(simulateParams.blockOverrides.number) : undefined,
				time: simulateParams.blockOverrides.time ? BigInt(simulateParams.blockOverrides.time) : undefined,
				gasLimit: simulateParams.blockOverrides.gasLimit ? BigInt(simulateParams.blockOverrides.gasLimit) : undefined,
				baseFeePerGas: simulateParams.blockOverrides.baseFeePerGas ? BigInt(simulateParams.blockOverrides.baseFeePerGas) : undefined,
				difficulty: simulateParams.blockOverrides.difficulty ? BigInt(simulateParams.blockOverrides.difficulty) : undefined,
			} : undefined,
		}

		const handler = ethSimulateV2Handler(client)
		const result = await handler(convertedParams)
		
		return {
			jsonrpc: req.jsonrpc,
			method: 'eth_simulateV2',
			result,
			...(req.id !== undefined ? { id: req.id } : {}),
		}
	} catch (error) {
		client.logger.error(error, 'ethSimulateV2Procedure: Error in procedure')
		
		return {
			jsonrpc: req.jsonrpc,
			method: 'eth_simulateV2',
			error: {
				code: -32603,
				message: 'Internal error',
				data: error.message,
			},
			...(req.id !== undefined ? { id: req.id } : {}),
		}
	}
}