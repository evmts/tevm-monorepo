/**
 * @module ethSimulateV1Procedure
 */

import { numberToHex } from '@tevm/utils'
import { ethSimulateV1Handler } from './ethSimulateV1Handler.js'

/**
 * JSON-RPC procedure for the eth_simulateV1 method
 * @type {import('./EthProcedure.js').EthSimulateV1JsonRpcProcedure}
 */
export const ethSimulateV1Procedure = (client) => {
	const handler = ethSimulateV1Handler(client)

	/**
	 * @param {import('./EthJsonRpcRequest.js').EthSimulateV1JsonRpcRequest} req
	 * @returns {Promise<import('./EthJsonRpcResponse.js').EthSimulateV1JsonRpcResponse>}
	 */
	return async (req) => {
		try {
			// Extract parameters from the request
			const params = req.params[0] || {}

			// Convert parameters from JSON-RPC format
			/** @type {import('./ethSimulateV1HandlerType.js').SimulateParams} */
			const simulateParams = {
				account: params.account || undefined,
				blockStateCalls: (params.blockStateCalls || []).map(
					/**
					 * @param {any} call
					 * @returns {import('./ethSimulateV1HandlerType.js').SimulateCallItem}
					 */
					(call) => ({
						...(call.from !== undefined ? { from: call.from } : {}),
						...(call.to !== undefined ? { to: call.to } : {}),
						...(call.data !== undefined ? { data: call.data } : {}),
						...(call.gas !== undefined ? { gas: BigInt(call.gas) } : {}),
						...(call.gasPrice !== undefined ? { gasPrice: BigInt(call.gasPrice) } : {}),
						...(call.maxFeePerGas !== undefined ? { maxFeePerGas: BigInt(call.maxFeePerGas) } : {}),
						...(call.maxPriorityFeePerGas !== undefined
							? { maxPriorityFeePerGas: BigInt(call.maxPriorityFeePerGas) }
							: {}),
						...(call.value !== undefined ? { value: BigInt(call.value) } : {}),
						...(call.nonce !== undefined ? { nonce: Number(call.nonce) } : {}),
						...(call.accessList !== undefined ? { accessList: call.accessList } : {}),
					}),
				),
				blockNumber: params.blockNumber || 'latest',
				stateOverrides: (params.stateOverrides || []).map(
					/**
					 * @param {any} override
					 * @returns {import('./ethSimulateV1HandlerType.js').StateOverride}
					 */
					(override) => ({
						address: override.address,
						...(override.balance !== undefined ? { balance: BigInt(override.balance) } : {}),
						...(override.nonce !== undefined ? { nonce: Number(override.nonce) } : {}),
						...(override.code !== undefined ? { code: override.code } : {}),
						...(override.storage !== undefined ? { storage: override.storage } : {}),
					}),
				),
				...(params.blockOverrides
					? {
							blockOverrides: {
								...(params.blockOverrides.baseFeePerGas !== undefined
									? { baseFeePerGas: BigInt(params.blockOverrides.baseFeePerGas) }
									: {}),
								...(params.blockOverrides.timestamp !== undefined
									? { timestamp: BigInt(params.blockOverrides.timestamp) }
									: {}),
								...(params.blockOverrides.number !== undefined ? { number: BigInt(params.blockOverrides.number) } : {}),
								...(params.blockOverrides.difficulty !== undefined
									? { difficulty: BigInt(params.blockOverrides.difficulty) }
									: {}),
								...(params.blockOverrides.gasLimit !== undefined
									? { gasLimit: BigInt(params.blockOverrides.gasLimit) }
									: {}),
								...(params.blockOverrides.coinbase !== undefined ? { coinbase: params.blockOverrides.coinbase } : {}),
							},
						}
					: {}),
				traceAssetChanges: params.traceAssetChanges === true,
			}

			// Execute the simulation
			const result = await handler(simulateParams)

			// Format the result to JSON-RPC format
			return {
				jsonrpc: req.jsonrpc || '2.0',
				id: req.id || null,
				method: 'eth_simulateV1',
				result: {
					results: result.results.map(
						/**
						 * @param {import('./ethSimulateV1HandlerType.js').SimulateCallResult} callResult
						 */
						(callResult) => ({
							status: callResult.status,
							data: callResult.data,
							gasUsed: numberToHex(callResult.gasUsed),
							logs: callResult.logs.map(
								/**
								 * @param {import('../common/FilterLog.js').FilterLog} log
								 */
								(log) => ({
									address: log.address,
									topics: /** @type {`0x${string}`[]} */ (log.topics),
									data: log.data,
									...(log.blockNumber ? { blockNumber: numberToHex(log.blockNumber) } : {}),
									...(log.transactionHash ? { transactionHash: log.transactionHash } : {}),
									...(log.transactionIndex ? { transactionIndex: numberToHex(log.transactionIndex) } : {}),
									...(log.blockHash ? { blockHash: log.blockHash } : {}),
									...(log.logIndex ? { logIndex: numberToHex(log.logIndex) } : {}),
								}),
							),
							...(callResult.error ? { error: callResult.error } : {}),
						}),
					),
					...(result.assetChanges && result.assetChanges.length > 0
						? {
								assetChanges: result.assetChanges.map(
									/**
									 * @param {import('./ethSimulateV1HandlerType.js').AssetChange} change
									 */
									(change) => ({
										token: change.token,
										value: {
											diff: numberToHex(change.value.diff),
											...(change.value.start !== undefined ? { start: numberToHex(change.value.start) } : {}),
											...(change.value.end !== undefined ? { end: numberToHex(change.value.end) } : {}),
										},
									}),
								),
							}
						: {}),
				},
			}
		} catch (error) {
			// Return error in JSON-RPC format
			if (client.logger) {
				client.logger.error(error, 'Error in eth_simulateV1')
			}
			return {
				jsonrpc: req.jsonrpc || '2.0',
				id: req.id || null,
				method: 'eth_simulateV1',
				error: {
					code: -32000,
					message: error instanceof Error ? error.message : String(error),
				},
			}
		}
	}
}
