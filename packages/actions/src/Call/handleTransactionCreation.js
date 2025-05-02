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

	const shouldAddToChain =
		client.miningConfig.type === 'auto' || shouldAddToBlockchain(params, executedCall.runTxResult)
	const shouldCreateTx = shouldAddToChain || shouldCreateTransaction(params, executedCall.runTxResult)

	if (shouldCreateTx) {
		try {
			const txRes = await createTransaction(client)({
				throwOnFail: false,
				evmOutput: executedCall.runTxResult,
				evmInput,
				maxPriorityFeePerGas: params.maxPriorityFeePerGas,
				maxFeePerGas: params.maxFeePerGas,
			})
			txHash = 'txHash' in txRes ? txRes.txHash : undefined

			const isGasMining = client.miningConfig.type === 'gas'

			if (shouldAddToChain && txHash) {
				const autoMiningResult = await handleAutomining(client, txHash, isGasMining, false)

				if (autoMiningResult?.errors) {
					errors.push(.../** @type {any} */ (autoMiningResult.errors))
				}
			}

			if ('errors' in txRes && txRes.errors) {
				errors.push(.../** @type {any} */ (txRes.errors))
			}
		} catch (error) {
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
