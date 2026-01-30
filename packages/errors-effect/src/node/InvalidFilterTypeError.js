import { Data } from 'effect'

/**
 * @typedef {`0x${string}`} Hex
 */

/**
 * TaggedError representing an invalid filter type error.
 *
 * This error occurs when attempting to use a filter with an operation that
 * requires a different filter type. For example, trying to get log changes
 * from a block filter, or block changes from a pending transaction filter.
 *
 * @example
 * ```typescript
 * import { InvalidFilterTypeError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidFilterTypeError({
 *     filterId: '0xabc123',
 *     expectedType: 'Log',
 *     actualType: 'Block'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidFilterTypeError', (error) => {
 *   console.log(`Filter ${error.filterId} is ${error.actualType}, expected ${error.expectedType}`)
 * })
 * ```
 */
export class InvalidFilterTypeError extends Data.TaggedError('InvalidFilterTypeError') {
	/**
	 * JSON-RPC error code for invalid params.
	 * @type {number}
	 */
	static code = -32602

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/invalidfiltertypeerror/'

	/**
	 * The filter ID that had the wrong type
	 * @readonly
	 * @type {Hex | string | undefined}
	 */
	filterId

	/**
	 * The expected filter type
	 * @readonly
	 * @type {string | undefined}
	 */
	expectedType

	/**
	 * The actual filter type
	 * @readonly
	 * @type {string | undefined}
	 */
	actualType

	/**
	 * Human-readable error message
	 * @readonly
	 * @type {string}
	 */
	message

	/**
	 * JSON-RPC error code
	 * @readonly
	 * @type {number}
	 */
	code

	/**
	 * Path to documentation
	 * @readonly
	 * @type {string}
	 */
	docsPath

	/**
	 * The underlying cause of this error, if any.
	 * @readonly
	 * @type {unknown}
	 */
	cause

	/**
	 * Constructs a new InvalidFilterTypeError
	 * @param {Object} props - Error properties
	 * @param {Hex | string} [props.filterId] - The filter ID that had the wrong type
	 * @param {string} [props.expectedType] - The expected filter type (e.g., 'Log', 'Block', 'PendingTransaction')
	 * @param {string} [props.actualType] - The actual filter type
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		/** @type {string} */
		this.name = 'InvalidFilterTypeError'
		this.filterId = props.filterId
		this.expectedType = props.expectedType
		this.actualType = props.actualType
		this.message =
			props.message ??
			(props.filterId !== undefined && props.expectedType !== undefined
				? `Filter '${props.filterId}' is not a ${props.expectedType} filter`
				: props.filterId !== undefined
					? `Filter '${props.filterId}' has invalid type`
					: 'Invalid filter type')
		this.code = InvalidFilterTypeError.code
		this.docsPath = InvalidFilterTypeError.docsPath
		this.cause = props.cause
	}
}
