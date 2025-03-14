/**
 * Validates mine event handlers
 * @param {any} params - The parameters to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateMineEvents = (params) => {
	const errors = []

	// Validate event handlers
	const eventHandlers = ['onTransactionHash', 'onSuccess', 'onError']
	for (const handler of eventHandlers) {
		if (handler in params && params[handler] !== undefined && typeof params[handler] !== 'function') {
			errors.push({
				path: handler,
				message: `${handler} must be a function`,
			})
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}
