import { Data } from 'effect'

/**
 * @typedef {`0x${string}`} Hex
 */

/**
 * TaggedError representing a revert during EVM execution.
 *
 * This error occurs when a transaction or call explicitly reverts.
 *
 * @example
 * ```typescript
 * import { RevertError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new RevertError({
 *     data: '0x08c379a0...',
 *     reason: 'Insufficient allowance'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('RevertError', (error) => {
 *   console.log(`Reverted: ${error.reason}`)
 * })
 * ```
 */
export class RevertError extends Data.TaggedError('RevertError') {
	/**
	 * JSON-RPC error code for execution reverted
	 * @type {number}
	 */
	static code = 3

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/reverterror/'

	/**
	 * The revert data (encoded error)
	 * @readonly
	 * @type {Hex | undefined}
	 */
	data

	/**
	 * The decoded revert reason, if available
	 * @readonly
	 * @type {string | undefined}
	 */
	reason

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
	 * Constructs a new RevertError
	 * @param {Object} props - Error properties
	 * @param {Hex} [props.data] - The revert data (encoded error)
	 * @param {string} [props.reason] - The decoded revert reason
	 * @param {string} [props.message] - Optional custom message
	 */
	constructor(props = {}) {
		super()
		this.data = props.data
		this.reason = props.reason
		this.message = props.message ?? (props.reason ? `Reverted: ${props.reason}` : 'Execution reverted')
		this.code = RevertError.code
		this.docsPath = RevertError.docsPath
	}
}
