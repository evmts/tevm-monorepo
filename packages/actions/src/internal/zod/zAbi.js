import { validateAbi } from '../validators/validateAbi.js'

export { validateAbi }

/**
 * For backward compatibility with Zod interface
 * @type {{parse: (value: unknown) => any}}
 */
export const zAbi = {
	/**
	 * @param {unknown} value
	 * @returns {any}
	 */
	parse: (value) => {
		const validation = validateAbi(value)
		if (!validation.isValid) {
			throw new Error(validation.message)
		}
		return value
	},
}
