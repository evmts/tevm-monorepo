import { validateBlockParam } from '../validators/validateBlockParam.js'

/**
 * Transform a validated block parameter to the correct type
 * @param {string|number|bigint} value - The block parameter
 * @returns {string|bigint} - The properly typed block parameter
 */
export const transformBlockParam = (value) => {
	if (typeof value === 'number') {
		return BigInt(value)
	}
	return value
}

export { validateBlockParam }

// For backward compatibility
export const zBlockParam = {
	parse: (value) => {
		const validation = validateBlockParam(value)
		if (!validation.isValid) {
			throw new Error(validation.message || 'Invalid block parameter')
		}
		return transformBlockParam(value)
	},
}
