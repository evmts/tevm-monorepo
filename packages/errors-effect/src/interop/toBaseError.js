import { TevmError } from '../TevmError.js'

/**
 * Converts a TaggedError from @tevm/errors-effect to a BaseError-like object.
 *
 * This is useful for backward compatibility when you need to interop with
 * code that expects the Promise-based API and BaseError instances.
 *
 * Note: This does not return an actual BaseError instance from @tevm/errors,
 * but rather a plain object with the same shape that can be used for error
 * handling in Promise-based code.
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
 * // Can now throw or use with Promise-based code
 * throw baseErrorLike
 * ```
 *
 * @template {TevmError | import('../evm/InsufficientBalanceError.js').InsufficientBalanceError | import('../evm/OutOfGasError.js').OutOfGasError | import('../evm/RevertError.js').RevertError | import('../evm/InvalidOpcodeError.js').InvalidOpcodeError | import('../evm/StackOverflowError.js').StackOverflowError | import('../evm/StackUnderflowError.js').StackUnderflowError} T
 * @param {T} taggedError - The TaggedError to convert
 * @returns {BaseErrorLike} A BaseError-like object
 */
export const toBaseError = (taggedError) => {
	const error = new Error(taggedError.message)

	/** @type {BaseErrorLike} */
	const result = Object.assign(error, {
		_tag: taggedError._tag,
		name: taggedError._tag,
		code: taggedError.code,
		docsPath: taggedError.docsPath,
		shortMessage: taggedError.message,
		version: '1.0.0-next.148',
		details: '',
	})

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
