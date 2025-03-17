/**
 * Validates EVM execution event handlers
 * These are not part of the JSON-RPC interface but are used internally for call handling
 * @param {unknown} events - The event handlers to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 * @typedef {Record<string, any>} EventHandlers
 */
export const validateCallEvents = (events) => {
	if (typeof events !== 'object' || events === null) {
		return {
			isValid: false,
			errors: [{ path: '', message: 'Events must be an object' }],
		}
	}

	/** @type {EventHandlers} */
	const validEvents = events

	const errors = []
	const handlers = ['onStep', 'onNewContract', 'onBeforeMessage', 'onAfterMessage']

	for (const handler of handlers) {
		if (Object.prototype.hasOwnProperty.call(validEvents, handler) && validEvents[handler] !== undefined) {
			const handlerFn = validEvents[handler]
			if (typeof handlerFn !== 'function') {
				errors.push({
					path: handler,
					message: `${handler} must be a function`,
				})
			}
		}
	}

	// Check for any keys that aren't in our list of valid handlers
	for (const key in validEvents) {
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
