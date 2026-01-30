import { Data } from 'effect'

/**
 * TaggedError representing a fork transport error.
 *
 * This error occurs when attempting to fetch a resource from a forked transport
 * fails, such as network issues, timeouts, or JSON-RPC errors.
 *
 * @example
 * ```typescript
 * import { ForkError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new ForkError({
 *     method: 'eth_getBalance',
 *     cause: new Error('Network timeout')
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('ForkError', (error) => {
 *   console.log(`Fork request failed for ${error.method}: ${error.cause}`)
 * })
 * ```
 */
export class ForkError extends Data.TaggedError('ForkError') {
	/**
	 * JSON-RPC error code for fork errors.
	 * Uses -32604 (resource not found) as default.
	 * @type {number}
	 */
	static code = -32604

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/forkerror/'

	/**
	 * The JSON-RPC method that was being called when the error occurred
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
	 * The underlying cause of this error.
	 * Typically contains the original JSON-RPC error or network error.
	 * @override
	 * @readonly
	 * @type {unknown}
	 */
	cause

	/**
	 * Constructs a new ForkError
	 * @param {Object} props - Error properties
	 * @param {string} [props.method] - The JSON-RPC method that failed
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all properties BEFORE calling super()
		const name = 'ForkError'
		const method = props.method
		const cause = props.cause
		const message =
			props.message ??
			(props.method !== undefined
				? `Fork request failed for method '${props.method}'`
				: 'Fork request failed')
		// If cause has a code, use it; otherwise use the static default
		const code =
			props.cause && typeof props.cause === 'object' && 'code' in props.cause && typeof props.cause.code === 'number'
				? props.cause.code
				: ForkError.code
		const docsPath = ForkError.docsPath

		// Pass all properties to super() for Effect.ts equality and hashing
		super({ name, method, cause, message, code, docsPath })

		/** @override @type {string} */
		this.name = name
		this.method = method
		this.cause = cause
		this.message = message
		this.code = code
		this.docsPath = docsPath
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
