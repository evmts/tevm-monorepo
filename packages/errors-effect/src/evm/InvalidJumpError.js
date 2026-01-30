import { Data } from 'effect'

/**
 * TaggedError representing an invalid jump destination error.
 *
 * This error occurs during EVM execution when a JUMP or JUMPI instruction
 * attempts to jump to an invalid destination (not a JUMPDEST opcode).
 *
 * @example
 * ```typescript
 * import { InvalidJumpError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidJumpError({
 *     destination: 0x1234,
 *     pc: 0x100
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidJumpError', (error) => {
 *   console.log(`Invalid jump to ${error.destination} from pc ${error.pc}`)
 * })
 * ```
 */
export class InvalidJumpError extends Data.TaggedError('InvalidJumpError') {
	/**
	 * JSON-RPC error code for EVM execution error.
	 * @type {number}
	 */
	static code = -32015

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/invalidjumperror/'

	/**
	 * The invalid jump destination
	 * @readonly
	 * @type {number | undefined}
	 */
	destination

	/**
	 * The program counter where the jump was attempted
	 * @readonly
	 * @type {number | undefined}
	 */
	pc

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
	 * @readonly
	 * @type {unknown}
	 */
	cause

	/**
	 * Constructs a new InvalidJumpError
	 * @param {Object} props - Error properties
	 * @param {number} [props.destination] - The invalid jump destination
	 * @param {number} [props.pc] - The program counter
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		/** @type {string} */
		this.name = 'InvalidJumpError'
		this.destination = props.destination
		this.pc = props.pc

		if (props.message) {
			this.message = props.message
		} else if (props.destination !== undefined) {
			this.message = `Invalid jump destination: 0x${props.destination.toString(16)}`
		} else {
			this.message = 'Invalid jump destination'
		}

		this.code = InvalidJumpError.code
		this.docsPath = InvalidJumpError.docsPath
		this.cause = props.cause
	}
}
