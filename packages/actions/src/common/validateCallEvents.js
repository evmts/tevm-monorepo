/**
 * Validates EVM execution event handlers
 * These are not part of the JSON-RPC interface but are used internally for call handling
 * @param {unknown} events - The event handlers to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateCallEvents = (events) => {
	if (typeof events !== 'object' || events === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Events must be an object' }],
		}
	}

	const errors = []
	const handlers = ['onStep', 'onNewContract', 'onBeforeMessage', 'onAfterMessage']
	const eventsObj = /** @type {Record<string, unknown>} */ (events)

	for (const handler of handlers) {
		if (handler in eventsObj && eventsObj[handler] !== undefined) {
			if (typeof eventsObj[handler] !== 'function') {
				errors.push({
					path: handler,
					message: `${handler} must be a function`,
				})
			}
		}
	}

	// Check for any keys that aren't in our list of valid handlers
	for (const key in eventsObj) {
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
