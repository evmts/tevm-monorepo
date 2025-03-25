import { InvalidRequestError } from '@tevm/errors'
import { InvalidJsonError } from '../errors/InvalidJsonError.js'

/**
 * Validates a JSON-RPC request
 * @param {unknown} request - The request to validate
 * @returns {{ isValid: boolean, errors: string[] }} - Validation result
 */
const validateJsonRpcRequest = (request) => {
	const errors = []

	// Check if request is an object
	if (typeof request !== 'object' || request === null) {
		return { isValid: false, errors: ['Request must be an object'] }
	}

	// Check if jsonrpc field is correct when provided
	if ('jsonrpc' in request && request.jsonrpc !== undefined && request.jsonrpc !== '2.0') {
		errors.push('jsonrpc must be "2.0"')
	}

	// Check if id is a string, number, or null
	if (
		'id' in request &&
		request.id !== undefined &&
		typeof request.id !== 'string' &&
		typeof request.id !== 'number' &&
		request.id !== null
	) {
		errors.push('id must be a string, number, or null')
	}

	// Method is required and must be a string
	if (!('method' in request) || typeof request.method !== 'string') {
		errors.push('method is required and must be a string')
	}

	// params is optional but when provided, can be any type

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * Validates a bulk JSON-RPC request
 * @param {unknown} requests - The requests to validate
 * @returns {{ isValid: boolean, errors: string[] }} - Validation result
 */
const validateBulkRequest = (requests) => {
	const errors = []

	// Check if requests is an array
	if (!Array.isArray(requests)) {
		return { isValid: false, errors: ['Bulk request must be an array'] }
	}

	// Validate each request
	for (let i = 0; i < requests.length; i++) {
		const validation = validateJsonRpcRequest(requests[i])
		if (!validation.isValid) {
			errors.push(`Request at index ${i} is invalid: ${validation.errors.join(', ')}`)
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * Parses a request body into a JSON-RPC request object.
 * Returns error if any
 * @param {string} body
 * @throws {never} returns errors as values
 */
export const parseRequest = (body) => {
	/**
	 * @type {unknown}
	 */
	let raw
	try {
		raw = JSON.parse(body)
	} catch (e) {
		const err = /** @type {Error} */ (e)
		return new InvalidJsonError(err.message, { cause: err })
	}

	// Validate either as a single request or a bulk request
	const validation = Array.isArray(raw) ? validateBulkRequest(raw) : validateJsonRpcRequest(raw)

	if (!validation.isValid) {
		return new InvalidRequestError(JSON.stringify({ errors: validation.errors }))
	}

	return raw
}
