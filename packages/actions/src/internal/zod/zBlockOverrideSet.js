import { validateBlockOverrideSet } from '../validators/validateBlockOverrideSet.js'

export { validateBlockOverrideSet }

// For backward compatibility
export const zBlockOverrideSet = {
	parse: (value) => {
		const validation = validateBlockOverrideSet(value)
		if (!validation.isValid) {
			throw new Error(validation.errors[0]?.message || 'Invalid block override set')
		}
		return value
	},
}
