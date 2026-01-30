import { Data } from 'effect'

/**
 * TaggedError representing a stack underflow error during EVM execution.
 *
 * This error occurs when an operation tries to pop more items from the stack
 * than are available.
 *
 * @example
 * ```typescript
 * import { StackUnderflowError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new StackUnderflowError({
 *     requiredItems: 2,
 *     availableItems: 1
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('StackUnderflowError', (error) => {
 *   console.log(`Stack underflow: needed ${error.requiredItems}, had ${error.availableItems}`)
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
	 * The number of stack items required by the operation
	 * @readonly
	 * @type {number | undefined}
	 */
	requiredItems

	/**
	 * The number of stack items available when underflow occurred
	 * @readonly
	 * @type {number | undefined}
	 */
	availableItems

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
	 * Constructs a new StackUnderflowError
	 * @param {Object} props - Error properties
	 * @param {number} [props.requiredItems] - The number of stack items required by the operation
	 * @param {number} [props.availableItems] - The number of stack items available
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all final property values before calling super
		const code = StackUnderflowError.code
		const docsPath = StackUnderflowError.docsPath
		const requiredItems = props.requiredItems
		const availableItems = props.availableItems
		const cause = props.cause
		const message = props.message
			? props.message
			: props.requiredItems !== undefined || props.availableItems !== undefined
				? `Stack underflow error occurred. Required ${props.requiredItems ?? 'unknown'} items, but only ${props.availableItems ?? 'unknown'} available.`
				: 'Stack underflow error occurred.'

		// Pass properties to super() for Effect.ts equality and hashing
		super({ message, code, docsPath, cause, requiredItems, availableItems })

		/** @override @type {string} */
		this.name = 'StackUnderflowError'
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.requiredItems = requiredItems
		this.availableItems = availableItems
		this.cause = cause
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
