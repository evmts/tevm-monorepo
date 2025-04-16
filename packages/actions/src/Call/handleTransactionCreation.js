import { createTransaction } from '../CreateTransaction/createTransaction.js'
import { handleAutomining } from './handleAutomining.js'
import { shouldAddToBlockchain, shouldCreateTransaction } from './shouldCreateTransaction.js'

/**
 * Handles the creation of a transaction based on the call parameters and execution result.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM base client instance.
 * @param {import('./CallParams.js').CallParams} params - The call parameters.
 * @param {import('./executeCall.js').ExecuteCallResult} executedCall - The result of the executed call.
 * @param {import('@tevm/evm').EvmRunCallOpts} evmInput - The EVM input parameters.
 * @returns {Promise<{hash: import('@tevm/utils').Hex | undefined, errors?: never} | {hash?: never, errors: Array<import('./TevmCallError.js').TevmCallError>}>} A promise that resolves to the transaction hash or undefined.
 * @throws {never} Returns errors as values
 */
export const handleTransactionCreation = async (client, params, executedCall, evmInput) => {
	/**
	 * @type {import('@tevm/utils').Hex | undefined}
	 */
	let txHash = undefined
	/**
	 * @type {Array<import('./TevmCallError.js').TevmCallError>}
	 */
	const errors = []

	// Log deprecation warning if createTransaction is used
	if (params.createTransaction !== undefined) {
		client.logger.warn(
			'The createTransaction parameter is deprecated. Please use addToMempool or addToBlockchain instead.',
		)
	}

	const shouldCreateTx = shouldCreateTransaction(params, executedCall.runTxResult)
	const shouldAddToChain = shouldAddToBlockchain(params, executedCall.runTxResult)

	if (shouldCreateTx || shouldAddToChain) {
		try {
			// Use a try-catch to handle errors from createTransaction or handleAutomining
			const txRes = await createTransaction(client)({
				throwOnFail: false,
				evmOutput: executedCall.runTxResult,
				evmInput,
				maxPriorityFeePerGas: params.maxPriorityFeePerGas,
				maxFeePerGas: params.maxFeePerGas,
			})
			txHash = 'txHash' in txRes ? txRes.txHash : undefined

			// Check if gas mining is enabled and should be triggered
			const isGasMining = client.miningConfig.type === 'gas'

			// Handle immediate mining if addToBlockchain is true
			if (shouldAddToChain && txHash) {
				// We need to mine the transaction with auto mode
				// For type safety, we'll continue to use the existing client
				// but tell handleAutomining to force mining regardless of config

				// Use true for isGasMining to force mining regardless of client mining mode
				const autoMiningResult = await handleAutomining(client, txHash, true)

				// Handle any errors from mining
				if (autoMiningResult?.errors) {
					errors.push(.../** @type {any} */ (autoMiningResult.errors))
				}
			}

			// Handle regular automining based on configuration (for transactions not added via addToBlockchain)
			if (!shouldAddToChain && txHash) {
				const regularMiningResult = await handleAutomining(client, txHash, isGasMining)

				// Handle any errors from mining
				if (regularMiningResult?.errors) {
					errors.push(.../** @type {any} */ (regularMiningResult.errors))
				}
			}

			// Check for errors in the transaction creation
			if ('errors' in txRes && txRes.errors) {
				errors.push(.../** @type {any} */ (txRes.errors))
			}
		} catch (error) {
			// Handle any unexpected errors during transaction creation
			errors.push(/** @type {any} */ (error))
		}
	}
	if (errors.length > 0) {
		return {
			errors,
		}
	}
	return { hash: txHash }
}
