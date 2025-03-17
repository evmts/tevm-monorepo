/**
 * @module ethSimulateV1Handler
 */

import { createAddress } from '@tevm/address'
import { BaseError } from '@tevm/errors'
import { callHandler } from '../Call/callHandler.js'
import { formatLog } from '../internal/formatLog.js'
import { parseBlockTag } from '../utils/parseBlockTag.js'

/**
 * Error thrown when simulate operation fails
 */
export class SimulateError extends BaseError {
	/** @override */
	name = 'SimulateError'
	/**
	 * @param {object} options - Error options
	 * @param {string} options.message - Error message
	 * @param {Error} [options.cause] - The underlying error that caused this error
	 */
	constructor({ message, cause }) {
		super(message, { cause }, 'SimulateError')
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
				// Use direct state manager access
				const vm = await client.getVm()
				if (override.balance !== undefined || override.nonce !== undefined || override.code !== undefined) {
					const addressObj = createAddress(override.address)
					const account = await vm.stateManager.getAccount(addressObj)
					if (account) {
						if (override.balance !== undefined) {
							account.balance = BigInt(override.balance)
						}
						if (override.nonce !== undefined) {
							account.nonce = BigInt(Number(override.nonce))
						}
						await vm.stateManager.putAccount(addressObj, account)
					}

					if (override.code !== undefined) {
						await vm.stateManager.putContractCode(addressObj, Buffer.from(override.code.slice(2), 'hex'))
					}
				}

				if (override.storage && Object.keys(override.storage).length > 0) {
					for (const [key, value] of Object.entries(override.storage)) {
						await vm.stateManager.putContractStorage(
							createAddress(override.address),
							Buffer.from(key.slice(2), 'hex'),
							Buffer.from(value.slice(2), 'hex'),
						)
					}
				}
			}
		}

		// Warn if block overrides are provided but not fully implemented
		if (blockOverrides) {
			client.logger.warn({ blockOverrides }, 'Block overrides are partially supported')
			// Note: Full block override implementation would require modifying the VM's block context
		}

		// Initialize asset tracking if needed
		/** @type {Record<string, bigint>} */
		const initialBalances = {}
		if (traceAssetChanges && account) {
			client.logger.debug({ account }, 'Initializing asset tracking')

			// Use low-level methods to get balance
			const vm = await client.getVm()
			const addressObj = createAddress(account)
			const ethAccount = await vm.stateManager.getAccount(addressObj)
			if (ethAccount) {
				initialBalances[NATIVE_TOKEN_ADDRESS] = ethAccount.balance
			}
		}

		// Process each call
		/** @type {import('./ethSimulateV1HandlerType.js').SimulateCallResult[]} */
		const results = []
		const call = callHandler(client)

		for (const [index, callParams] of blockStateCalls.entries()) {
			client.logger.debug({ index, callParams }, 'Processing call')

			try {
				// Use a default sender address
				const fromAddress = callParams.from || account || '0x0000000000000000000000000000000000000000'

				// Execute the call with all required properties
				const callResult = await call({
					from: fromAddress,
					to: callParams.to,
					data: callParams.data || '0x',
					value: callParams.value !== undefined ? BigInt(callParams.value) : 0n,
					gas: callParams.gas !== undefined ? BigInt(callParams.gas) : 1000000n, // 1M gas default
					gasPrice: callParams.gasPrice !== undefined ? BigInt(callParams.gasPrice) : 0n,
					maxFeePerGas: callParams.maxFeePerGas !== undefined ? BigInt(callParams.maxFeePerGas) : 0n,
					maxPriorityFeePerGas:
						callParams.maxPriorityFeePerGas !== undefined ? BigInt(callParams.maxPriorityFeePerGas) : 0n,
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
						error: error?.message || 'Execution failed',
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
					error: error instanceof Error ? error.message : 'Unexpected error during execution',
				})
			}
		}

		// Track asset changes if requested
		/** @type {import('./ethSimulateV1HandlerType.js').AssetChange[]} */
		let assetChanges = []
		if (traceAssetChanges && account) {
			client.logger.debug({ account }, 'Tracking asset changes')

			/** @type {Record<string, bigint>} */
			const finalBalances = {}

			// Get final ETH balance using low-level methods
			const vm = await client.getVm()
			const addressObj = createAddress(account)
			const ethAccount = await vm.stateManager.getAccount(addressObj)
			if (ethAccount) {
				finalBalances[NATIVE_TOKEN_ADDRESS] = ethAccount.balance
			}

			// Calculate asset changes
			assetChanges = Object.entries(initialBalances)
				.map(([address, initialBalance]) => {
					const finalBalance = finalBalances[address] ?? 0n
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
				.filter(
					/**
					 * @template T
					 * @param {T | null} x
					 * @returns {x is T}
					 */
					(x) => x !== null,
				)
		}

		// Return the formatted result
		return {
			results,
			...(assetChanges.length > 0 ? { assetChanges } : {}),
		}
	}
}
