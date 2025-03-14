/**
 * @module simulateHandler
 */

import { createAbi } from '@tevm/utils'
import { encodeAbiParameters, encodeFunctionData, formatLog } from 'viem'
import { tevmCallHandler } from '../TevmCall/tevmCallHandler.js'
import { TevmSimulateError } from './TevmSimulateError.js'
import { validateSimulateParams } from './validateSimulateParams.js'

const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

/**
 * Decodes the result of a call based on the ABI and function name
 * @param {any} abi - The contract ABI
 * @param {string} functionName - The function name
 * @param {`0x${string}`} data - The result data
 * @returns {any} The decoded result
 */
const decodeResult = (abi, functionName, data) => {
	if (!abi || !functionName || data === '0x') return undefined

	try {
		return createAbi(abi).decodeFunctionResult({
			functionName,
			data,
		})
	} catch (error) {
		// If decoding fails, return undefined
		return undefined
	}
}

/**
 * Handler for the simulate method
 * @type {import('./SimulateHandler.js').SimulateHandler}
 */
export const simulateHandler = (client) => {
	return async (params, maybeThrowOnFail = true) => {
		const validation = validateSimulateParams(params)

		if (!validation.isValid) {
			const error = new TevmSimulateError({
				message: `Invalid simulate parameters: ${validation.errors?.map((e) => `${e.path}: ${e.message}`).join(', ')}`,
				params,
			})

			if (maybeThrowOnFail) {
				throw error
			}

			return {
				error,
				results: [],
			}
		}

		const {
			account,
			calls,
			blockNumber = 'latest',
			stateOverrides = [],
			blockOverrides,
			traceAssetChanges = false,
		} = params

		if (traceAssetChanges && !account) {
			const error = new TevmSimulateError({
				message: '`account` is required when `traceAssetChanges` is true',
				params,
			})

			if (maybeThrowOnFail) {
				throw error
			}

			return {
				error,
				results: [],
			}
		}

		// Apply state overrides
		if (stateOverrides.length > 0) {
			for (const override of stateOverrides) {
				await client.tevmSetAccount({
					address: override.address,
					...(override.balance !== undefined ? { balance: override.balance } : {}),
					...(override.nonce !== undefined ? { nonce: override.nonce } : {}),
					...(override.code !== undefined ? { code: override.code } : {}),
					...(override.storage !== undefined ? { storageOverrides: override.storage } : {}),
				})
			}
		}

		// Apply block overrides if provided
		if (blockOverrides) {
			// TODO: Implement block overrides once supported by the VM
		}

		// Init asset tracking if needed
		const initialBalances = {}
		if (traceAssetChanges && account) {
			// Get initial ETH balance
			const initialBalance = await client.getBalance({
				address: account,
				blockTag: blockNumber,
			})

			initialBalances[NATIVE_TOKEN_ADDRESS] = initialBalance

			// TODO: Track ERC20 token balances if needed
		}

		// Process each call
		const results = []
		for (const call of calls) {
			try {
				// Prepare call data
				let callData = call.data || '0x'

				// If abi and functionName are provided, encode the function call
				if (call.abi && call.functionName) {
					try {
						callData = encodeFunctionData({
							abi: call.abi,
							functionName: call.functionName,
							args: call.args || [],
						})
					} catch (error) {
						// If encoding fails, return a failure result
						results.push({
							status: 'failure',
							data: '0x',
							gasUsed: 0n,
							logs: [],
							error: new Error(`Failed to encode function data: ${error.message}`),
						})
						continue
					}
				}

				// Execute the call using tevmCall
				const callResult = await tevmCallHandler(client)(
					{
						from: call.from || account,
						to: call.to,
						data: callData,
						value: call.value,
						gas: call.gas,
						gasPrice: call.gasPrice,
						maxFeePerGas: call.maxFeePerGas,
						maxPriorityFeePerGas: call.maxPriorityFeePerGas,
						accessList: call.accessList,
						blockNumber,
						enableTrace: true,
					},
					false,
				)

				if (callResult.error) {
					// Handle call execution error
					results.push({
						status: 'failure',
						data: callResult.data || '0x',
						gasUsed: callResult.gasUsed || 0n,
						logs: callResult.logs?.map(formatLog) || [],
						error: callResult.error,
					})
				} else {
					// Handle successful call
					const result = {
						status: 'success',
						data: callResult.data,
						gasUsed: callResult.gasUsed,
						logs: callResult.logs?.map(formatLog) || [],
					}

					// Decode the result if abi and functionName are provided
					if (call.abi && call.functionName) {
						result.result = decodeResult(call.abi, call.functionName, callResult.data)
					}

					results.push(result)
				}
			} catch (error) {
				// Handle unexpected errors
				results.push({
					status: 'failure',
					data: '0x',
					gasUsed: 0n,
					logs: [],
					error,
				})
			}
		}

		// Track asset changes if requested
		let assetChanges
		if (traceAssetChanges && account) {
			const finalBalances = {}

			// Get final ETH balance
			const finalBalance = await client.getBalance({
				address: account,
				blockTag: blockNumber,
			})

			finalBalances[NATIVE_TOKEN_ADDRESS] = finalBalance

			// Calculate asset changes
			assetChanges = Object.entries(initialBalances)
				.map(([address, initialBalance]) => {
					const finalBalance = finalBalances[address] || 0n
					const diff = finalBalance - initialBalance

					// Only include if there's a change
					if (diff === 0n) return null

					if (address === NATIVE_TOKEN_ADDRESS) {
						return {
							token: {
								address: NATIVE_TOKEN_ADDRESS,
								symbol: 'ETH',
								decimals: 18,
							},
							value: {
								diff,
								start: initialBalance,
								end: finalBalance,
							},
						}
					}

					// TODO: Handle ERC20 tokens

					return null
				})
				.filter(Boolean)
		}

		return {
			results,
			...(assetChanges ? { assetChanges } : {}),
		}
	}
}
