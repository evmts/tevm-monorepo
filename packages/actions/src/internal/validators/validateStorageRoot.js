// Storage root regex (32-byte hex string)
const storageRootRegex = /^0x[0-9a-fA-F]{64}$/

/**
 * Validates if a value is a valid ethereum storage root
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, message?: string }} - Validation result
 */
export const validateStorageRoot = (value) => {
	if (typeof value !== 'string') {
		return { isValid: false, message: 'Storage root must be a string' }
	}

	if (!storageRootRegex.test(value)) {
		return {
			isValid: false,
			message: 'Storage root must be a 32-byte hex string (64 hex characters with a 0x prefix)',
		}
	}

	return { isValid: true }
}
