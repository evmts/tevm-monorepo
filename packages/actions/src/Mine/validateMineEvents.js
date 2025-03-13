/**
 * Validates mining event handlers
 * These are not part of the JSON-RPC interface but are used internally for mining operations
 * @param {unknown} events - The event handlers to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateMineEvents = (events) => {
	if (typeof events !== 'object' || events === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Events must be an object' }],
		}
	}

	/** @type {Array<{path: string, message: string}>} */
	const errors = []
	const handlers = ['onBlock', 'onReceipt', 'onLog']

	for (const handler of handlers) {
		if (handler in events && /** @type {Record<string, unknown>} */ (events)[handler] !== undefined) {
			if (typeof (/** @type {Record<string, unknown>} */ (events)[handler]) !== 'function') {
				errors.push({
					path: handler,
					message: `${handler} must be a function`,
				})
			}
		}
	}

	// Check for any keys that aren't in our list of valid handlers
	for (const key in events) {
		if (!handlers.includes(key)) {
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