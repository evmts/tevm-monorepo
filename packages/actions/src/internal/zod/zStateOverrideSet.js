import { validateStateOverrideSet } from '../validators/validateStateOverrideSet.js'

export { validateStateOverrideSet }

// For backward compatibility
export const zStateOverrideSet = {
	parse: (value) => {
		const validation = validateStateOverrideSet(value)
		if (!validation.isValid) {
			throw new Error(validation.errors[0]?.message || 'Invalid state override set')
		}
		return value
	},
}
