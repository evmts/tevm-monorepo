import { validateStorageRoot } from '../validators/validateStorageRoot.js'

export { validateStorageRoot }

// For backward compatibility
export const zStorageRoot = {
	parse: (value) => {
		const validation = validateStorageRoot(value)
		if (!validation.isValid) {
			throw new Error(validation.message || 'Invalid storage root')
		}
		return value
	},
}
