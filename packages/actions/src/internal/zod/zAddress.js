import { validateAddress } from '../validators/validateAddress.js'

/**
 * Export the address validator
 */
export { validateAddress }

// For backward compatibility
export const zAddress = {
	parse: (value) => {
		const validation = validateAddress(value)
		if (!validation.isValid) {
			throw new Error(validation.message)
		}
		return value
	},
}
