import { createTransaction } from '../CreateTransaction/createTransaction.js'
import { handleAutomining } from './handleAutomining.js'
import { shouldCreateTransaction } from './shouldCreateTransaction.js'

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
	if (shouldCreateTransaction(params, executedCall.runTxResult)) {
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

			// Handle automining or gas mining based on configuration
			const miningRes = (await handleAutomining(client, txHash, isGasMining)) ?? {}

			// Check for errors in the transaction creation and mining results
			if ('errors' in txRes && txRes.errors) {
				// Convert errors to TevmCallError type
				for (const err of txRes.errors) {
					// Add correctly typed error to the errors array
					errors.push(/** @type {import('./TevmCallError.js').TevmCallError} */(err));
				}
			}
			
			// Check for mining errors
			if (miningRes && typeof miningRes === 'object' && 'errors' in miningRes && Array.isArray(miningRes.errors)) {
				// Convert errors to TevmCallError type
				for (const err of miningRes.errors) {
					// Add correctly typed error to the errors array
					errors.push(/** @type {import('./TevmCallError.js').TevmCallError} */(err));
				}
			}
		} catch (error) {
			// Handle any unexpected errors during transaction creation
			if (error instanceof Error) {
				errors.push(/** @type {import('./TevmCallError.js').TevmCallError} */({
					name: error.name || 'Error',
					message: error.message || 'Unknown error during transaction creation'
				}));
			} else {
				errors.push(/** @type {import('./TevmCallError.js').TevmCallError} */({
					name: 'Error',
					message: String(error)
				}));
			}
		}
	}
	if (errors.length > 0) {
		return {
			errors,
		}
	}
	return { hash: txHash }
}
