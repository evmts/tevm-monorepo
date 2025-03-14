import { validateStateOverrideSet } from '../validators/validateStateOverrideSet.js'

export { validateStateOverrideSet }

/**
 * For backward compatibility with Zod interface
 * @type {{parse: (value: unknown) => any}}
 */
export const zStateOverrideSet = {
	/**
	 * @param {unknown} value
	 * @returns {any}
	 */
	parse: (value) => {
		const validation = validateStateOverrideSet(value)
		if (!validation.isValid) {
			throw new Error(validation.errors[0]?.message || 'Invalid state override set')
		}
		return value
	},
}
