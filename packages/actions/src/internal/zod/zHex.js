// Import from validators directory
import { hexRegex, transformHex, validateHex } from '../validators/validateHex.js'

// Re-export for backward compatibility
export { hexRegex, validateHex, transformHex }

/**
 * For backward compatibility with Zod interface
 * @type {{parse: (value: unknown) => `0x${string}`}}
 */
export const zHex = {
	/**
	 * @param {unknown} value
	 * @returns {`0x${string}`}
	 */
	parse: (value) => {
		const validation = validateHex(value)
		if (!validation.isValid) {
			throw new Error(validation.message)
		}
		return transformHex(String(value))
	},
}
