/**
 * @module ethSimulateV1Handler
 */

import { BaseError } from '@tevm/errors'
import { callHandler } from '../Call/callHandler.js'
import { formatLog } from '../internal/formatLog.js'
import { parseBlockTag } from '../utils/parseBlockTag.js'
import { toHex } from '../utils/toHex.js'

/**
 * Error thrown when simulate operation fails
 */
export class SimulateError extends BaseError {
	name = 'SimulateError'
	/**
	 * @param {object} options - Error options
	 * @param {string} options.message - Error message
	 * @param {Error} [options.cause] - The underlying error that caused this error
	 */
	constructor({ message, cause }) {
		super({
			shortMessage: message,
			cause,
		})
	}
}

/**
 * Native Ethereum token address used for ETH balance tracking
 * @type {`0x${string}`}
 */
export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

/**
 * Handler for the eth_simulateV1 method, which simulates a series of transactions
 * at a specific block height with optional state overrides
 *
 * @type {import('./ethSimulateV1HandlerType.js').EthSimulateV1Handler}
 */
export const ethSimulateV1Handler = (client) => {
	return async ({
		account,
		blockStateCalls,
		blockNumber = 'latest',
		stateOverrides = [],
		blockOverrides,
		traceAssetChanges = false,
	}) => {
		// Basic validation
		if (!Array.isArray(blockStateCalls) || blockStateCalls.length === 0) {
			throw new SimulateError({
				message: 'blockStateCalls must be a non-empty array',
			})
		}

		// Process block tag
		const blockTag = parseBlockTag(blockNumber)

		// Apply state overrides
		if (stateOverrides.length > 0) {
			client.logger.debug({ stateOverrides }, 'Applying state overrides')

			for (const override of stateOverrides) {
				await client.tevmSetAccount({
					address: override.address,
					...(override.balance !== undefined ? { balance: BigInt(override.balance) } : {}),
					...(override.nonce !== undefined ? { nonce: Number(override.nonce) } : {}),
					...(override.code !== undefined ? { code: override.code } : {}),
					...(override.storage !== undefined ? { storageOverrides: override.storage } : {}),
				})
			}
		}

		// Warn if block overrides are provided but not fully implemented
		if (blockOverrides) {
			client.logger.warn({ blockOverrides }, 'Block overrides are partially supported')
			// Note: Full block override implementation would require modifying the VM's block context
		}

		// Initialize asset tracking if needed
		const initialBalances = {}
		if (traceAssetChanges && account) {
			client.logger.debug({ account }, 'Initializing asset tracking')

			// Get initial ETH balance
			const initialBalance = await client.getBalance({
				address: account,
				blockTag: blockNumber,
			})

			initialBalances[NATIVE_TOKEN_ADDRESS] = initialBalance
		}

		// Process each call
		const results = []
		const call = callHandler(client)

		for (const [index, callParams] of blockStateCalls.entries()) {
			client.logger.debug({ index, callParams }, 'Processing call')

			try {
				// Execute the call
				const callResult = await call({
					from: callParams.from || account,
					to: callParams.to,
					data: callParams.data || '0x',
					value: callParams.value !== undefined ? BigInt(callParams.value) : undefined,
					gas: callParams.gas !== undefined ? BigInt(callParams.gas) : undefined,
					gasPrice: callParams.gasPrice !== undefined ? BigInt(callParams.gasPrice) : undefined,
					maxFeePerGas: callParams.maxFeePerGas !== undefined ? BigInt(callParams.maxFeePerGas) : undefined,
					maxPriorityFeePerGas:
						callParams.maxPriorityFeePerGas !== undefined ? BigInt(callParams.maxPriorityFeePerGas) : undefined,
					accessList: callParams.accessList,
					blockTag,
					createTrace: true, // Enable tracing to get detailed information
					throwOnFail: false, // Don't throw on failure, just return error details
				})

				// Format the result
				if (callResult.errors && callResult.errors.length > 0) {
					// Handle execution error
					const error = callResult.errors[0]
					results.push({
						status: 'failure',
						data: callResult.rawData || '0x',
						gasUsed: callResult.executionGasUsed || 0n,
						logs: callResult.logs ? callResult.logs.map(formatLog) : [],
						error: error.message || 'Execution failed',
					})
				} else {
					// Handle successful call
					results.push({
						status: 'success',
						data: callResult.rawData,
						gasUsed: callResult.executionGasUsed,
						logs: callResult.logs ? callResult.logs.map(formatLog) : [],
					})
				}
			} catch (error) {
				// Handle unexpected errors
				client.logger.error(error, `Error in call #${index}`)
				results.push({
					status: 'failure',
					data: '0x',
					gasUsed: 0n,
					logs: [],
					error: error.message || 'Unexpected error during execution',
				})
			}
		}

		// Track asset changes if requested
		let assetChanges
		if (traceAssetChanges && account) {
			client.logger.debug({ account }, 'Tracking asset changes')

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

					// Could handle ERC20 tokens here if needed
					return null
				})
				.filter(Boolean)
		}

		// Return the formatted result
		return {
			results,
			...(assetChanges ? { assetChanges } : {}),
		}
	}
}
