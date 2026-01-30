import { Data } from 'effect'

/**
 * TaggedError representing a method not found error.
 *
 * This error occurs when the requested JSON-RPC method does not exist
 * or is not available on the server.
 *
 * @example
 * ```typescript
 * import { MethodNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new MethodNotFoundError({
 *     method: 'eth_unknownMethod'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('MethodNotFoundError', (error) => {
 *   console.log(`Method not found: ${error.method}`)
 * })
 * ```
 */
export class MethodNotFoundError extends Data.TaggedError('MethodNotFoundError') {
	/**
	 * JSON-RPC error code for method not found.
	 * Standard JSON-RPC 2.0 error code: -32601
	 * @type {number}
	 */
	static code = -32601

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/methodnotfounderror/'

	/**
	 * The method name that was not found
	 * @readonly
	 * @type {string | undefined}
	 */
	method

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
	 * Constructs a new MethodNotFoundError
	 * @param {Object} props - Error properties
	 * @param {string} [props.method] - The method that was not found
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all property values BEFORE calling super()
		const method = props.method
		const message =
			props.message ??
			(props.method !== undefined
				? `Method '${props.method}' not found`
				: 'Method not found')
		const code = MethodNotFoundError.code
		const docsPath = MethodNotFoundError.docsPath
		const cause = props.cause

		// Pass all properties to super() for Effect.ts equality and hashing
		super({ method, message, code, docsPath, cause })

		/** @override @type {string} */
		this.name = 'MethodNotFoundError'
		this.method = method
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.cause = cause
	}
}
