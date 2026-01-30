import { Data } from 'effect'

/**
 * TaggedError representing a timeout error.
 *
 * This error occurs when a request exceeds the configured timeout duration,
 * typically during network requests or long-running operations.
 *
 * @example
 * ```typescript
 * import { TimeoutError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new TimeoutError({
 *     timeout: 30000,
 *     operation: 'eth_call'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('TimeoutError', (error) => {
 *   console.log(`Operation '${error.operation}' timed out after ${error.timeout}ms`)
 * })
 * ```
 */
export class TimeoutError extends Data.TaggedError('TimeoutError') {
	/**
	 * JSON-RPC error code for timeout.
	 * @type {number}
	 */
	static code = -32002

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/timeouterror/'

	/**
	 * The timeout duration in milliseconds
	 * @readonly
	 * @type {number | undefined}
	 */
	timeout

	/**
	 * The operation that timed out
	 * @readonly
	 * @type {string | undefined}
	 */
	operation

	/**
	 * Human-readable error message
	 * @override
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
	 * @override
	 * @readonly
	 * @type {unknown}
	 */
	cause

	/**
	 * Constructs a new TimeoutError
	 * @param {Object} props - Error properties
	 * @param {number} [props.timeout] - The timeout duration in milliseconds
	 * @param {string} [props.operation] - The operation that timed out
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super({})
		/** @override @type {string} */
		this.name = 'TimeoutError'
		this.timeout = props.timeout
		this.operation = props.operation
		this.cause = props.cause

		if (props.message) {
			this.message = props.message
		} else if (props.operation !== undefined && props.timeout !== undefined) {
			this.message = `Operation '${props.operation}' timed out after ${props.timeout}ms`
		} else if (props.timeout !== undefined) {
			this.message = `Request timed out after ${props.timeout}ms`
		} else if (props.operation !== undefined) {
			this.message = `Operation '${props.operation}' timed out`
		} else {
			this.message = 'Request timed out'
		}

		this.code = TimeoutError.code
		this.docsPath = TimeoutError.docsPath
	}
}
