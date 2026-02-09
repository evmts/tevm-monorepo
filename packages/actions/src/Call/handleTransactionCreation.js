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
	let txHash
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

	// Auto-mine only if:
	// 1. Auto-mining is enabled
	// 2. addToBlockchain is explicitly set to a truthy value (true, 'always', 'on-success')
	// Note: createTransaction (deprecated) and addToMempool do NOT trigger auto-mining.
	// They only add to the mempool. Use addToBlockchain to auto-mine.
	const shouldAutoMine =
		client.miningConfig.type === 'auto' &&
		params.addToBlockchain !== undefined &&
		params.addToBlockchain !== false &&
		params.addToBlockchain !== 'never'
	const shouldAddToChain = shouldAutoMine || shouldAddToBlockchain(params, executedCall.runTxResult)
	const shouldCreateTx = shouldAddToChain || shouldCreateTransaction(params, executedCall.runTxResult)

	if (shouldCreateTx) {
		try {
			const txRes = await createTransaction(client)({
				throwOnFail: false,
				evmOutput: executedCall.runTxResult,
				evmInput,
				maxPriorityFeePerGas: params.maxPriorityFeePerGas,
				maxFeePerGas: params.maxFeePerGas,
				nonceOverride: params.nonce,
			})
			txHash = 'txHash' in txRes ? txRes.txHash : undefined

			if (shouldAddToChain && txHash) {
				const autoMiningResult = await handleAutomining(client, txHash, false, false)

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
