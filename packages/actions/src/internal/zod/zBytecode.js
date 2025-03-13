import { validateBytecode } from '../validators/validateBytecode.js'

// Export the validator function
export { validateBytecode }

// For backward compatibility
export const zBytecode = {
	parse: (value) => {
		const validation = validateBytecode(value)
		if (!validation.isValid) {
			throw new Error(validation.message || 'Invalid bytecode')
		}
		return value
	},
}
