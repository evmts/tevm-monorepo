/**
 * @internal
 * Determines if a transaction should be created based on the parameters
 * @param {import('./CallParams.js').CallParams} params
 * @param {import('@tevm/vm').RunTxResult} runTxResult
 * @throws {never} only if the parameter is invalid based on ts type
 */
export const shouldCreateTransaction = (params, runTxResult) => {
	const paramToUse = params.addToMempool ?? params.addToBlockchain ?? params.createTransaction

	if (paramToUse === undefined) {
		return false
	}
	if (paramToUse === 'always') {
		return true
	}
	// true is now an alias for 'always', not 'on-success'
	if (paramToUse === true) {
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
	if (params.addToBlockchain === 'always') {
		return true
	}
	// true is now an alias for 'always', not 'on-success'
	if (params.addToBlockchain === true) {
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
