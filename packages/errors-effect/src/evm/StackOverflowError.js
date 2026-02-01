import { Data } from 'effect'

/**
 * TaggedError representing a stack overflow error during EVM execution.
 *
 * This error occurs when the EVM stack exceeds its maximum depth (1024).
 *
 * @example
 * ```typescript
 * import { StackOverflowError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new StackOverflowError({
 *     stackSize: 1025
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('StackOverflowError', (error) => {
 *   console.log(`Stack overflow: ${error.stackSize} items`)
 * })
 * ```
 */
export class StackOverflowError extends Data.TaggedError('StackOverflowError') {
	/**
	 * JSON-RPC error code for execution error
	 * @type {number}
	 */
	static code = -32015

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/stackoverflowerror/'

	/**
	 * The stack size when overflow occurred
	 * @readonly
	 * @type {number | undefined}
	 */
	stackSize

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
	 * Enables error chaining for better debugging.
	 * @override
	 * @readonly
	 * @type {unknown}
	 */
	cause

	/**
	 * Constructs a new StackOverflowError
	 * @param {Object} props - Error properties
	 * @param {number} [props.stackSize] - The stack size when overflow occurred
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all final property values before calling super
		const code = StackOverflowError.code
		const docsPath = StackOverflowError.docsPath
		const stackSize = props.stackSize
		const cause = props.cause
		const message = props.message
			? props.message
			: props.stackSize !== undefined
				? `Stack overflow error occurred. Stack size: ${props.stackSize} (max: 1024).`
				: 'Stack overflow error occurred.'

		// Pass properties to super() for Effect.ts equality and hashing
		super({ message, code, docsPath, cause, stackSize })

		/** @override @type {string} */
		this.name = 'StackOverflowError'
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.stackSize = stackSize
		this.cause = cause
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
