import { validateSetAccountParams as validateParamsWithErrors } from './validateSetAccountParams.js'

// For backward compatibility to mimic Zod interface
export const zSetAccountParams = {
	/**
	 * Parse the set account parameters
	 * @param {unknown} value - The value to parse
	 * @returns {any} - The parsed value
	 */
	parse: (value) => {
		const errors = validateParamsWithErrors(value)
		if (errors.length > 0) {
			throw new Error(errors[0]?.message || 'Invalid set account parameters')
		}
		return value
	},
}
