/**
 * Validates if a value is a valid ABI
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, message?: string }} - Validation result
 */
export const validateAbi = (value) => {
	// ABI must be an array
	if (!Array.isArray(value)) {
		return { isValid: false, message: 'ABI must be an array' }
	}

	// Each item in the ABI must be an object
	for (let i = 0; i < value.length; i++) {
		const item = value[i]

		if (typeof item !== 'object' || item === null) {
			return { isValid: false, message: `ABI item at index ${i} must be an object` }
		}

		// Validate required fields for ABI items
		if (!('type' in item)) {
			return { isValid: false, message: `ABI item at index ${i} must have a 'type' property` }
		}

		// Type must be a string
		if (typeof item.type !== 'string') {
			return { isValid: false, message: `'type' property in ABI item at index ${i} must be a string` }
		}

		// Basic validation for common ABI types
		const validTypes = ['function', 'constructor', 'event', 'fallback', 'receive', 'error']
		if (!validTypes.includes(item.type)) {
			return {
				isValid: false,
				message: `Invalid type '${item.type}' in ABI item at index ${i}. Must be one of: ${validTypes.join(', ')}`,
			}
		}

		// More specific validations could be added here based on the type
	}

	return { isValid: true }
}
