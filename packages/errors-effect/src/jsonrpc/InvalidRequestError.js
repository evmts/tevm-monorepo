import { Data } from 'effect'

/**
 * TaggedError representing an invalid JSON-RPC request.
 *
 * This error occurs when the JSON-RPC request object is invalid,
 * such as missing required fields or malformed structure.
 *
 * @example
 * ```typescript
 * import { InvalidRequestError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidRequestError({
 *     message: 'Missing "method" field in request'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidRequestError', (error) => {
 *   console.log(`Invalid request: ${error.message}`)
 * })
 * ```
 */
export class InvalidRequestError extends Data.TaggedError('InvalidRequestError') {
	/**
	 * JSON-RPC error code for invalid request.
	 * Standard JSON-RPC 2.0 error code: -32600
	 * @type {number}
	 */
	static code = -32600

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/invalidrequesterror/'

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
	 * Constructs a new InvalidRequestError
	 * @param {Object} props - Error properties
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all property values BEFORE calling super()
		const message = props.message ?? 'Invalid JSON-RPC request'
		const code = InvalidRequestError.code
		const docsPath = InvalidRequestError.docsPath
		const cause = props.cause

		// Pass all properties to super() for Effect.ts equality and hashing
		super({ message, code, docsPath, cause })

		/** @override @type {string} */
		this.name = 'InvalidRequestError'
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.cause = cause
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
	}
}
