import { convertToTevmCallErrors, validateCallParamsInternal } from './validateCallParamsInternal.js'

// For backward compatibility
export const zCallParams = {
	parse: (params) => {
		const validation = validateCallParamsInternal(params)
		if (!validation.isValid) {
			// Format the error message based on specific conditions
			if (params && 'code' in params && 'deployedBytecode' in params) {
				throw new Error('Cannot have both code and deployedBytecode set')
			}
			if (params && params.createTransaction === true) {
				if ('stateOverrideSet' in params || 'blockOverrideSet' in params) {
					throw new Error('Cannot have stateOverrideSet or blockOverrideSet for createTransaction')
				}
			}
			// Default error
			throw new Error(validation.errors[0]?.message || 'Invalid call parameters')
		}
		return params
	},
	safeParse: (params) => {
		const validation = validateCallParamsInternal(params)
		if (validation.isValid) {
			return { success: true, data: params }
		}
		return {
			success: false,
			error: {
				errors: convertToTevmCallErrors(validation.errors),
				format: () => {
					// Format errors into a structure similar to Zod errors
					const formatted = { _errors: [] }

					validation.errors.forEach((err) => {
						// Add to top-level errors
						formatted._errors.push(err.message)

						// Add to specific field errors
						if (err.path) {
							if (!formatted[err.path]) {
								formatted[err.path] = { _errors: [] }
							}
							formatted[err.path]._errors.push(err.message)
						}
					})

					return formatted
				},
			},
		}
	},
}
