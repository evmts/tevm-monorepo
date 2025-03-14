import { validateBlockOverrideSet } from '../validators/validateBlockOverrideSet.js'

export { validateBlockOverrideSet }

/**
 * For backward compatibility with Zod interface
 * @type {{parse: (value: unknown) => any}}
 */
export const zBlockOverrideSet = {
	/**
	 * @param {unknown} value
	 * @returns {any}
	 */
	parse: (value) => {
		const validation = validateBlockOverrideSet(value)
		if (!validation.isValid) {
			throw new Error(validation.errors[0]?.message || 'Invalid block override set')
		}
		return value
	},
}
