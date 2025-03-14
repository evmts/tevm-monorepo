import { validateLoadStateParams as validateParamsWithErrors } from './validateLoadStateParams.js'

// For backward compatibility to mimic Zod interface
export const zLoadStateParams = {
	/**
	 * Parse the load state parameters
	 * @param {unknown} value - The value to parse
	 * @returns {any} - The parsed value
	 */
	parse: (value) => {
		const errors = validateParamsWithErrors(value)
		if (errors.length > 0) {
			throw new Error(errors[0]?.message || 'Invalid load state parameters')
		}
		return value
	},

	/**
	 * Safely parse the load state parameters
	 * @param {unknown} value - The value to parse
	 * @returns {{ success: boolean, data?: any, error?: { format: () => {_errors: string[], state?: {_errors: string[]}} } }} - The parse result
	 */
	safeParse: (value) => {
		const errors = validateParamsWithErrors(value)
		if (errors.length === 0) {
			return { success: true, data: value }
		}
		return {
			success: false,
			error: {
				/**
				 * Format the error messages
				 * @returns {{ _errors: string[], state?: {_errors: string[]} }} - The formatted errors
				 */
				format: () => {
					/** @type {{_errors: string[], state?: {_errors: string[]}}} */
					const formatted = { _errors: [] }
					errors.forEach((err) => {
						const message = err.message
						if (message && typeof message === 'string' && message.startsWith('state.')) {
							const pathParts = message.split('.')
							if (pathParts.length > 1) {
								if (!formatted.state) {
									formatted.state = { _errors: [] }
								}
								formatted.state._errors.push(message)
							}
						} else if (message) {
							formatted._errors.push(message)
						}
					})
					return formatted
				},
			},
		}
	},
}

// For backward compatibility to mimic Zod interface
export const zAccountStorage = {
	/**
	 * Parse the account storage
	 * @param {unknown} value - The value to parse
	 * @returns {any} - The parsed value
	 */
	parse: (value) => {
		// We can now rely on validateLoadStateParams to validate individual account storage
		// Create a fake state with a single account
		const errors = validateParamsWithErrors({ state: { '0x0': value } })
		if (errors.length > 0) {
			throw new Error(errors[0]?.message || 'Invalid account storage')
		}
		return value
	},
}
