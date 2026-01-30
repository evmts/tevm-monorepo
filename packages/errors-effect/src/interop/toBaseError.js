import { TevmError } from '../TevmError.js'

/**
 * Library version - should match package.json version
 * @type {string}
 */
const VERSION = '1.0.0-next.148'

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
 * // Can now throw or use with Promise-based code
 * throw baseErrorLike
 * ```
 *
 * @template {TevmError | import('../evm/InsufficientBalanceError.js').InsufficientBalanceError | import('../evm/OutOfGasError.js').OutOfGasError | import('../evm/RevertError.js').RevertError | import('../evm/InvalidOpcodeError.js').InvalidOpcodeError | import('../evm/StackOverflowError.js').StackOverflowError | import('../evm/StackUnderflowError.js').StackUnderflowError} T
 * @param {T} taggedError - The TaggedError to convert
 * @returns {BaseErrorLike & Omit<T, '_tag' | 'message' | 'code' | 'docsPath'>} A BaseError-like object with preserved error-specific properties
 */
export const toBaseError = (taggedError) => {
	const error = new Error(taggedError.message)

	// Base properties that exist on all errors
	const baseProps = {
		_tag: taggedError._tag,
		name: taggedError._tag,
		code: taggedError.code,
		docsPath: taggedError.docsPath,
		shortMessage: taggedError.message,
		version: VERSION,
		details: '',
	}

	// Collect error-specific properties (everything except base properties)
	/** @type {Record<string, unknown>} */
	const specificProps = {}
	const baseKeys = new Set(['_tag', 'name', 'message', 'code', 'docsPath'])

	for (const key of Object.keys(taggedError)) {
		if (!baseKeys.has(key) && taggedError[/** @type {keyof T} */ (key)] !== undefined) {
			specificProps[key] = taggedError[/** @type {keyof T} */ (key)]
		}
	}

	/** @type {BaseErrorLike & Omit<T, '_tag' | 'message' | 'code' | 'docsPath'>} */
	const result = Object.assign(error, baseProps, specificProps)

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
 * @property {string} details - Error details
 */
