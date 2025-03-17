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

	/** @type {Array<{path: string, message: string}>} */
	const errors = []

	// Event handlers that should be functions
	const eventHandlers = ['onBlock', 'onReceipt', 'onLog']

	// Valid non-handler properties that are part of MineParams
	const validProps = ['blockCount', 'blocks', 'interval', 'throwOnFail']

	// All valid keys
	const validKeys = [...eventHandlers, ...validProps]

	// Validate that event handlers are functions
	for (const handler of eventHandlers) {
		if (handler in events && /** @type {Record<string, unknown>} */ (events)[handler] !== undefined) {
			if (typeof (/** @type {Record<string, unknown>} */ (events)[handler]) !== 'function') {
				errors.push({
					path: handler,
					message: `${handler} must be a function`,
				})
			}
		}
	}

	// Check for any keys that aren't in our list of valid properties
	for (const key in events) {
		if (!validKeys.includes(key)) {
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
