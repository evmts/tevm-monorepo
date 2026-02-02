import { Data } from 'effect'

/**
 * TaggedError representing an internal JSON-RPC error.
 *
 * This error occurs when an internal error is encountered while processing
 * a JSON-RPC request, typically indicating a server-side issue.
 *
 * @example
 * ```typescript
 * import { InternalError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InternalError({
 *     message: 'Database connection failed',
 *     meta: { database: 'state-db', retries: 3 }
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InternalError', (error) => {
 *   console.log(`Internal error: ${error.message}`)
 *   if (error.meta) console.log('Meta:', error.meta)
 * })
 * ```
 */
export class InternalError extends Data.TaggedError('InternalError') {
	/**
	 * JSON-RPC error code for internal error.
	 * Standard JSON-RPC 2.0 error code: -32603
	 * @type {number}
	 */
	static code = -32603

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/internalerror/'

	/**
	 * Additional metadata about the error
	 * @readonly
	 * @type {unknown}
	 */
	meta

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
	 * Constructs a new InternalError
	 * @param {Object} props - Error properties
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.meta] - Additional metadata
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all property values BEFORE calling super()
		const meta = props.meta
		const message = props.message ?? 'Internal JSON-RPC error'
		const code = InternalError.code
		const docsPath = InternalError.docsPath
		const cause = props.cause

		// Pass all properties to super() for Effect.ts equality and hashing
		super({ meta, message, code, docsPath, cause })

		/** @override @type {string} */
		this.name = 'InternalError'
		this.meta = meta
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.cause = cause
	}
}
