/**
 * Validates call event handlers
 * These are not part of the JSON-RPC interface but are used internally for call handling
 *
 * @param {object} events - The event handlers to validate
 * @param {Function} [events.onStep] - Handler called on each EVM step (instruction execution)
 * @param {Function} [events.onNewContract] - Handler called when a new contract is created
 * @param {Function} [events.onBeforeMessage] - Handler called before a message (call) is processed
 * @param {Function} [events.onAfterMessage] - Handler called after a message (call) is processed
 * @returns {object} The validated event handlers
 */
export const validateCallEvents = (events) => {
	if (events === null || typeof events !== 'object') {
		throw new Error('Event handlers must be an object')
	}

	const { onStep, onNewContract, onBeforeMessage, onAfterMessage } = events

	if (onStep !== undefined && typeof onStep !== 'function') {
		throw new Error('onStep must be a function')
	}

	if (onNewContract !== undefined && typeof onNewContract !== 'function') {
		throw new Error('onNewContract must be a function')
	}

	if (onBeforeMessage !== undefined && typeof onBeforeMessage !== 'function') {
		throw new Error('onBeforeMessage must be a function')
	}

	if (onAfterMessage !== undefined && typeof onAfterMessage !== 'function') {
		throw new Error('onAfterMessage must be a function')
	}

	return events
}

/**
 * Checks if the input contains valid call event handlers
 * @param {unknown} events - The event handlers to check
 * @returns {boolean} True if the event handlers are valid
 */
export const isValidCallEvents = (events) => {
	if (events === null || typeof events !== 'object') {
		return false
	}

	const { onStep, onNewContract, onBeforeMessage, onAfterMessage } = events

	if (onStep !== undefined && typeof onStep !== 'function') {
		return false
	}

	if (onNewContract !== undefined && typeof onNewContract !== 'function') {
		return false
	}

	if (onBeforeMessage !== undefined && typeof onBeforeMessage !== 'function') {
		return false
	}

	if (onAfterMessage !== undefined && typeof onAfterMessage !== 'function') {
		return false
	}

	return true
}
