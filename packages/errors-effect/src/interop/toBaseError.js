import { TevmError } from '../TevmError.js'

/**
 * Library version - should match package.json version
 * @type {string}
 */
const VERSION = '1.0.0-next.148'

/**
 * Helper function to walk through the error chain.
 * Recursively traverses the error's cause property to find a matching error.
 *
 * @param {unknown} err - The error to walk through.
 * @param {((err: unknown) => boolean) | undefined} fn - A predicate function to match errors.
 * @returns {unknown} The first error that matches the function, or null/original error.
 */
const walk = (err, fn) => {
	if (fn?.(err)) return err
	// Check both that cause property exists AND has a value (not undefined/null)
	if (err && typeof err === 'object' && 'cause' in err && /** @type {{ cause: unknown }} */ (err).cause != null) {
		return walk(/** @type {{ cause: unknown }} */ (err).cause, fn)
	}
	return fn ? null : err
}

/**
 * Computes the details string from a cause, matching the behavior of @tevm/errors BaseError.
 *
 * @param {unknown} cause - The cause to extract details from.
 * @returns {string} The computed details string.
 */
const computeDetails = (cause) => {
	// If cause is null/undefined -> empty string
	if (cause === null || cause === undefined) {
		return ''
	}
	// If cause is a string -> use directly
	if (typeof cause === 'string') {
		return cause
	}
	// If cause is not an object -> empty string
	if (typeof cause !== 'object') {
		return ''
	}
	// If cause has a message property -> use it
	if ('message' in cause && typeof cause.message === 'string') {
		return cause.message
	}
	// If cause has an errorType property -> use it
	if ('errorType' in cause && typeof cause.errorType === 'string') {
		return cause.errorType
	}
	// Try to JSON.stringify the cause
	try {
		return JSON.stringify(cause)
	} catch (_e) {
		return 'Unable to parse error details'
	}
}

/**
 * Converts a TaggedError from @tevm/errors-effect to a BaseError-like object.
 *
 * This is useful for backward compatibility when you need to interop with
 * code that expects the Promise-based API and BaseError instances.
 *
 * Note: This does not return an actual BaseError instance from @tevm/errors,
 * but rather a plain object with the same shape that can be used for error
 * handling in Promise-based code. Error-specific properties (address, gasUsed,
 * opcode, etc.) are preserved on the result object.
 *
 * The returned object includes a `walk` method for traversing error chains,
 * matching the BaseError interface from @tevm/errors.
 *
 * @example
 * ```typescript
 * import { toBaseError, InsufficientBalanceError } from '@tevm/errors-effect'
 *
 * const taggedError = new InsufficientBalanceError({
 *   address: '0x1234...',
 *   required: 1000n,
 *   available: 500n
 * })
 *
 * const baseErrorLike = toBaseError(taggedError)
 * // Error-specific properties are preserved
 * console.log(baseErrorLike.address) // '0x1234...'
 * console.log(baseErrorLike.required) // 1000n
 *
 * // Use walk to traverse error chain
 * const rootCause = baseErrorLike.walk((err) => !(err instanceof Error))
 *
 * // Can now throw or use with Promise-based code
 * throw baseErrorLike
 * ```
 *
 * @template {TevmError | import('../evm/InsufficientBalanceError.js').InsufficientBalanceError | import('../evm/OutOfGasError.js').OutOfGasError | import('../evm/RevertError.js').RevertError | import('../evm/InvalidOpcodeError.js').InvalidOpcodeError | import('../evm/StackOverflowError.js').StackOverflowError | import('../evm/StackUnderflowError.js').StackUnderflowError} T
 * @param {T} taggedError - The TaggedError to convert
 * @returns {BaseErrorLike & Omit<T, '_tag' | 'message' | 'code' | 'docsPath'>} A BaseError-like object with preserved error-specific properties
 */
export const toBaseError = (taggedError) => {
	// Explicitly extract cause from taggedError to preserve error chain
	const cause = /** @type {unknown} */ (taggedError.cause)

	// Create Error with cause option to preserve error chain for walk method
	const error = cause !== undefined
		? new Error(taggedError.message, { cause })
		: new Error(taggedError.message)

	// Compute details from cause like the original BaseError does
	const details = computeDetails(cause)

	// Extract metaMessages if present (some errors may have this)
	const metaMessages = /** @type {string[] | undefined} */ (
		'metaMessages' in taggedError ? taggedError['metaMessages'] : undefined
	)

	// Base properties that exist on all errors
	const baseProps = {
		_tag: taggedError._tag,
		name: taggedError._tag,
		code: taggedError.code,
		docsPath: taggedError.docsPath,
		shortMessage: taggedError.message,
		version: VERSION,
		details,
		cause,
		metaMessages,
		/**
		 * Walks through the error chain to find a matching error.
		 *
		 * @param {((err: unknown) => boolean) | undefined} fn - A predicate function to execute on each error.
		 * @returns {unknown} The first error that matches the function, or the original error if no predicate.
		 */
		walk: (fn) => walk(error, fn),
	}

	// Collect error-specific properties (everything except base properties)
	/** @type {Record<string, unknown>} */
	const specificProps = {}
	const baseKeys = new Set(['_tag', 'name', 'message', 'code', 'docsPath', 'cause', 'metaMessages'])

	for (const key of Object.keys(taggedError)) {
		if (!baseKeys.has(key) && taggedError[/** @type {keyof T} */ (key)] !== undefined) {
			specificProps[key] = taggedError[/** @type {keyof T} */ (key)]
		}
	}

	const result = /** @type {BaseErrorLike & Omit<T, '_tag' | 'message' | 'code' | 'docsPath'>} */ (
		Object.assign(error, baseProps, specificProps)
	)

	return result
}

/**
 * @typedef {Object} BaseErrorLike
 * @property {string} _tag - Internal tag for the error
 * @property {string} name - The name of the error
 * @property {string} message - Human-readable error message
 * @property {number} code - JSON-RPC error code
 * @property {string | undefined} docsPath - Path to documentation
 * @property {string} shortMessage - Short description of the error
 * @property {string} version - Library version
 * @property {string} details - Error details computed from cause (matches BaseError behavior)
 * @property {unknown} cause - The underlying cause of the error (for error chaining)
 * @property {string[] | undefined} metaMessages - Additional meta messages for display
 * @property {(fn?: (err: unknown) => boolean) => unknown} walk - Walk through error chain to find matching error
 */
