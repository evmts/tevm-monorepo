import { validateAddress } from '../validators/validateAddress.js'

/**
 * Export the address validator
 */
export { validateAddress }

/**
 * For backward compatibility with Zod interface
 * @type {{parse: (value: unknown) => any}}
 */
export const zAddress = {
	/**
	 * @param {unknown} value
	 * @returns {any}
	 */
	parse: (value) => {
		const validation = validateAddress(value)
		if (!validation.isValid) {
			throw new Error(validation.message)
		}
		return value
	},
}
