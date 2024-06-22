/**
 * @internal
 * Determines if a transaction should be created based on the `createTransaction` parameter
 * @param {import('./CallParams.js').CallParams} params
 * @param {import('@tevm/vm').RunTxResult} runTxResult
 * @throws {never} only if the `createTransaction` parameter is invalid based on ts type
 */
export const shouldCreateTransaction = (params, runTxResult) => {
	if (params.createTransaction === undefined) {
		return false
	}
	if (params.createTransaction === true || params.createTransaction === 'always') {
		return true
	}
	if (params.createTransaction === false || params.createTransaction === 'never') {
		return false
	}
	if (params.createTransaction === 'on-success') {
		return runTxResult.execResult.exceptionError === undefined
	}
	/**
	 * @type {never} this typechecks that we've exhausted all cases
	 */
	const invalidOption = params.createTransaction
	throw new Error(`Invalid createTransaction value: ${invalidOption}`)
}
