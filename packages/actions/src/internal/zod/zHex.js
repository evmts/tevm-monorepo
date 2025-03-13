// Import from validators directory
import { hexRegex, transformHex, validateHex } from '../validators/validateHex.js'

// Re-export for backward compatibility
export { hexRegex, validateHex, transformHex }

// For backward compatibility
export const zHex = {
	parse: (value) => {
		const validation = validateHex(value)
		if (!validation.isValid) {
			throw new Error(validation.message)
		}
		return transformHex(value)
	},
}
