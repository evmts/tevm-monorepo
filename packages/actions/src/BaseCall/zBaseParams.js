/**
 * Validates base parameters shared across tevm actions
 * @param {object} params - The parameters to validate
 * @param {boolean} [params.throwOnFail] - If true, the action handler will throw errors rather than returning errors on the `errors` property
 * @returns {object} The validated parameters
 */
export const validateBaseParams = (params) => {
	if (params === null || typeof params !== 'object') {
		throw new Error('Parameters must be an object')
	}

	const { throwOnFail } = params

	if (throwOnFail !== undefined && typeof throwOnFail !== 'boolean') {
		throw new Error('throwOnFail must be a boolean')
	}

	return params
}

/**
 * Checks if the input contains valid base parameters
 * @param {unknown} params - The parameters to check
 * @returns {boolean} True if the parameters are valid
 */
export const isValidBaseParams = (params) => {
	if (params === null || typeof params !== 'object') {
		return false
	}

	const { throwOnFail } = params

	if (throwOnFail !== undefined && typeof throwOnFail !== 'boolean') {
		return false
	}

	return true
}
