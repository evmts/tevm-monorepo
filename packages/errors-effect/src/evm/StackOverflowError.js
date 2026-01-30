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
	 * @type {number | undefined}
	 */
	stackSize

	/**
	 * Human-readable error message
	 * @type {string}
	 */
	message

	/**
	 * JSON-RPC error code
	 * @type {number}
	 */
	code

	/**
	 * Path to documentation
	 * @type {string}
	 */
	docsPath

	/**
	 * Constructs a new StackOverflowError
	 * @param {Object} props - Error properties
	 * @param {number} [props.stackSize] - The stack size when overflow occurred
	 * @param {string} [props.message] - Optional custom message
	 */
	constructor(props = {}) {
		super()
		this.stackSize = props.stackSize
		this.message = props.message ?? 'Stack overflow error occurred.'
		this.code = StackOverflowError.code
		this.docsPath = StackOverflowError.docsPath
	}
}
