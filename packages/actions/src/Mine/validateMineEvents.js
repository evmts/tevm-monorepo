/**
 * Validates Mine event handlers
 * These are not part of the JSON-RPC interface but are used internally for mine handling
 * @param {unknown} events - The event handlers to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateMineEvents = (events) => {
	if (!events) {
		return {
			isValid: true,
			errors: [],
		}
	}

	if (typeof events !== 'object' || events === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Events must be an object' }],
		}
	}

	const errors = []
	// Mine doesn't have specific event handlers beyond the base ones
	const handlers = []

	// Check for any keys that aren't in our list of valid handlers
	for (const key in events) {
		if (key.startsWith('on') && !handlers.includes(key)) {
			errors.push({
				path: key,
				message: `Unknown event handler: ${key}`,
			})
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}
