import { Data } from 'effect'

/**
 * TaggedError representing an invalid opcode error during EVM execution.
 *
 * This error occurs when the EVM encounters an invalid or undefined opcode.
 *
 * @example
 * ```typescript
 * import { InvalidOpcodeError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidOpcodeError({
 *     opcode: 0xfe
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidOpcodeError', (error) => {
 *   console.log(`Invalid opcode: ${error.opcode}`)
 * })
 * ```
 */
export class InvalidOpcodeError extends Data.TaggedError('InvalidOpcodeError') {
	/**
	 * JSON-RPC error code for execution error
	 * @type {number}
	 */
	static code = -32015

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/invalidopcodeerror/'

	/**
	 * The invalid opcode that was encountered
	 * @readonly
	 * @type {number | undefined}
	 */
	opcode

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
	 * Constructs a new InvalidOpcodeError
	 * @param {Object} props - Error properties
	 * @param {number} [props.opcode] - The invalid opcode
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all final property values before calling super
		const code = InvalidOpcodeError.code
		const docsPath = InvalidOpcodeError.docsPath
		const opcode = props.opcode
		const cause = props.cause
		const message =
			props.message ??
			(props.opcode !== undefined ? `Invalid opcode: 0x${props.opcode.toString(16)}` : 'Invalid opcode encountered')

		// Pass properties to super() for Effect.ts equality and hashing
		super({ message, code, docsPath, cause, opcode })

		/** @override @type {string} */
		this.name = 'InvalidOpcodeError'
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.opcode = opcode
		this.cause = cause
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
