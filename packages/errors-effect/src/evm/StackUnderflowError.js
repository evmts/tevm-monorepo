import { Data } from 'effect'

/**
 * TaggedError representing a stack underflow error during EVM execution.
 *
 * This error occurs when an operation tries to pop from an empty stack.
 *
 * @example
 * ```typescript
 * import { StackUnderflowError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new StackUnderflowError())
 * })
 *
 * // Pattern matching
 * Effect.catchTag('StackUnderflowError', (error) => {
 *   console.log('Stack underflow occurred')
 * })
 * ```
 */
export class StackUnderflowError extends Data.TaggedError('StackUnderflowError') {
	/**
	 * JSON-RPC error code for execution error
	 * @type {number}
	 */
	static code = -32015

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/stackunderflowerror/'

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
	 * Enables error chaining for better debugging.
	 * @readonly
	 * @type {unknown}
	 */
	cause

	/**
	 * Constructs a new StackUnderflowError
	 * @param {Object} props - Error properties
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		this.message = props.message ?? 'Stack underflow error occurred.'
		this.code = StackUnderflowError.code
		this.docsPath = StackUnderflowError.docsPath
		this.cause = props.cause
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
