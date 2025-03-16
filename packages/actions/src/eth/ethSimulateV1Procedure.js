/**
 * @module ethSimulateV1Procedure
 */

import { bigIntToHex } from '@tevm/utils'
import { ethSimulateV1Handler } from './ethSimulateV1Handler.js'

/**
 * JSON-RPC procedure for the eth_simulateV1 method
 * @type {import('./EthProcedure.js').EthSimulateV1JsonRpcProcedure}
 */
export const ethSimulateV1Procedure = (client) => {
	const handler = ethSimulateV1Handler(client)

	return async (req) => {
		try {
			// Extract parameters from the request
			const params = req.params[0] || {}

			// Convert parameters from JSON-RPC format
			const simulateParams = {
				account: params.account,
				blockStateCalls: (params.blockStateCalls || []).map((call) => ({
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
				})),
				blockNumber: params.blockNumber,
				stateOverrides: (params.stateOverrides || []).map((override) => ({
					address: override.address,
					...(override.balance !== undefined ? { balance: BigInt(override.balance) } : {}),
					...(override.nonce !== undefined ? { nonce: Number(override.nonce) } : {}),
					...(override.code !== undefined ? { code: override.code } : {}),
					...(override.storage !== undefined ? { storage: override.storage } : {}),
				})),
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
				jsonrpc: req.jsonrpc,
				id: req.id,
				method: 'eth_simulateV1',
				result: {
					results: result.results.map((callResult) => ({
						status: callResult.status,
						data: callResult.data,
						gasUsed: bigIntToHex(callResult.gasUsed),
						logs: callResult.logs.map((log) => ({
							...log,
							// Convert any bigint fields to hex
							logIndex: log.logIndex !== undefined ? bigIntToHex(log.logIndex) : undefined,
							blockNumber: log.blockNumber !== undefined ? bigIntToHex(log.blockNumber) : undefined,
							transactionIndex: log.transactionIndex !== undefined ? bigIntToHex(log.transactionIndex) : undefined,
						})),
						...(callResult.error ? { error: callResult.error } : {}),
					})),
					...(result.assetChanges
						? {
								assetChanges: result.assetChanges.map((change) => ({
									token: change.token,
									value: {
										diff: bigIntToHex(change.value.diff),
										...(change.value.start !== undefined ? { start: bigIntToHex(change.value.start) } : {}),
										...(change.value.end !== undefined ? { end: bigIntToHex(change.value.end) } : {}),
									},
								})),
							}
						: {}),
				},
			}
		} catch (error) {
			// Return error in JSON-RPC format
			client.logger.error(error, 'Error in eth_simulateV1')
			return {
				jsonrpc: req.jsonrpc,
				id: req.id,
				method: 'eth_simulateV1',
				error: {
					code: -32000,
					message: error instanceof Error ? error.message : String(error),
				},
			}
		}
	}
}
