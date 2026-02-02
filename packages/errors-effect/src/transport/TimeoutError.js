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
		// Compute all properties BEFORE calling super()
		const name = 'TimeoutError'
		const timeout = props.timeout
		const operation = props.operation
		const cause = props.cause

		let message
		if (props.message) {
			message = props.message
		} else if (props.operation !== undefined && props.timeout !== undefined) {
			message = `Operation '${props.operation}' timed out after ${props.timeout}ms`
		} else if (props.timeout !== undefined) {
			message = `Request timed out after ${props.timeout}ms`
		} else if (props.operation !== undefined) {
			message = `Operation '${props.operation}' timed out`
		} else {
			message = 'Request timed out'
		}

		const code = TimeoutError.code
		const docsPath = TimeoutError.docsPath

		// Pass all properties to super() for Effect.ts equality and hashing
		super({ name, timeout, operation, cause, message, code, docsPath })

		/** @override @type {string} */
		this.name = name
		this.timeout = timeout
		this.operation = operation
		this.cause = cause
		this.message = message
		this.code = code
		this.docsPath = docsPath
	}
}
