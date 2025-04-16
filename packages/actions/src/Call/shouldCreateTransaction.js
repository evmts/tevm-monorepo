/**
 * @internal
 * Determines if a transaction should be created based on the parameters
 * @param {import('./CallParams.js').CallParams} params
 * @param {import('@tevm/vm').RunTxResult} runTxResult
 * @throws {never} only if the parameter is invalid based on ts type
 */
export const shouldCreateTransaction = (params, runTxResult) => {
	// First check addToMempool, then fall back to createTransaction
	const paramToUse = params.addToMempool !== undefined ? params.addToMempool : params.createTransaction

	if (paramToUse === undefined) {
		return false
	}
	if (paramToUse === true || paramToUse === 'always') {
		return true
	}
	if (paramToUse === false || paramToUse === 'never') {
		return false
	}
	if (paramToUse === 'on-success') {
		return runTxResult.execResult.exceptionError === undefined
	}
	/**
	 * @type {never} this typechecks that we've exhausted all cases
	 */
	const invalidOption = paramToUse
	throw new Error(`Invalid value for addToMempool/createTransaction: ${invalidOption}`)
}

/**
 * @internal
 * Determines if a transaction should be added to the blockchain based on the `addToBlockchain` parameter
 * @param {import('./CallParams.js').CallParams} params
 * @param {import('@tevm/vm').RunTxResult} runTxResult
 * @throws {never} only if the `addToBlockchain` parameter is invalid based on ts type
 */
export const shouldAddToBlockchain = (params, runTxResult) => {
	if (params.addToBlockchain === undefined) {
		return false
	}
	if (params.addToBlockchain === true || params.addToBlockchain === 'always') {
		return true
	}
	if (params.addToBlockchain === false || params.addToBlockchain === 'never') {
		return false
	}
	if (params.addToBlockchain === 'on-success') {
		return runTxResult.execResult.exceptionError === undefined
	}
	/**
	 * @type {never} this typechecks that we've exhausted all cases
	 */
	const invalidOption = params.addToBlockchain
	throw new Error(`Invalid addToBlockchain value: ${invalidOption}`)
}
