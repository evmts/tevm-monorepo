import { validateStorageRoot } from '../validators/validateStorageRoot.js'

export { validateStorageRoot }

/**
 * For backward compatibility with Zod interface
 * @type {{parse: (value: unknown) => any}}
 */
export const zStorageRoot = {
	/**
	 * @param {unknown} value
	 * @returns {any}
	 */
	parse: (value) => {
		const validation = validateStorageRoot(value)
		if (!validation.isValid) {
			throw new Error(validation.message || 'Invalid storage root')
		}
		return value
	},
}
