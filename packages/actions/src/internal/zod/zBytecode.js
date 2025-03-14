import { validateBytecode } from '../validators/validateBytecode.js'

// Export the validator function
export { validateBytecode }

/**
 * For backward compatibility with Zod interface
 * @type {{parse: (value: unknown) => any}}
 */
export const zBytecode = {
	/**
	 * @param {unknown} value
	 * @returns {any}
	 */
	parse: (value) => {
		const validation = validateBytecode(value)
		if (!validation.isValid) {
			throw new Error(validation.message || 'Invalid bytecode')
		}
		return value
	},
}
