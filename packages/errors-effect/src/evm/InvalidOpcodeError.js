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
	 * Constructs a new InvalidOpcodeError
	 * @param {Object} props - Error properties
	 * @param {number} [props.opcode] - The invalid opcode
	 * @param {string} [props.message] - Optional custom message
	 */
	constructor(props = {}) {
		super()
		this.opcode = props.opcode
		this.message = props.message ?? (props.opcode !== undefined ? `Invalid opcode: 0x${props.opcode.toString(16)}` : 'Invalid opcode encountered')
		this.code = InvalidOpcodeError.code
		this.docsPath = InvalidOpcodeError.docsPath
	}
}
