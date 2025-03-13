import { validateAbi } from '../validators/validateAbi.js'

export { validateAbi }

// For backward compatibility
export const zAbi = {
	parse: (value) => {
		const validation = validateAbi(value)
		if (!validation.isValid) {
			throw new Error(validation.message)
		}
		return value
	},
}
