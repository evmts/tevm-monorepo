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
		const txRes = await createTransaction(client)({
			throwOnFail: false,
			evmOutput: executedCall.runTxResult,
			evmInput,
			maxPriorityFeePerGas: params.maxPriorityFeePerGas,
			maxFeePerGas: params.maxFeePerGas,
		})
		txHash = 'txHash' in txRes ? txRes.txHash : undefined
		const miningRes = (await handleAutomining(client, txHash)) ?? {}
		const { errors: txCreationErrors } = /** @type {{errors: Array<any>}}*/ (txRes)
		errors.push(...(miningRes.errors ?? []), ...(txCreationErrors ?? []))
	}
	if (errors.length > 0) {
		return {
			errors,
		}
	}
	return { hash: txHash }
}
