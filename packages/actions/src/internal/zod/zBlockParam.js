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

/**
 * For backward compatibility with Zod interface
 * @type {{parse: (value: unknown) => string|bigint}}
 */
export const zBlockParam = {
	/**
	 * @param {unknown} value
	 * @returns {string|bigint}
	 */
	parse: (value) => {
		const validation = validateBlockParam(value)
		if (!validation.isValid) {
			throw new Error(validation.message || 'Invalid block parameter')
		}
		return transformBlockParam(/** @type {string|number|bigint} */ (value))
	},
}
