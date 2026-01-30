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
 *     raw: '0x08c379a0...',
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
	 * The raw revert data (encoded error).
	 * Named 'raw' to match the original @tevm/errors RevertError property.
	 * @readonly
	 * @type {Hex | undefined}
	 */
	raw

	/**
	 * The decoded revert reason, if available
	 * @readonly
	 * @type {string | undefined}
	 */
	reason

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
	 * Constructs a new RevertError
	 * @param {Object} props - Error properties
	 * @param {Hex} [props.raw] - The raw revert data (encoded error)
	 * @param {string} [props.reason] - The decoded revert reason
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all final property values before calling super
		const code = RevertError.code
		const docsPath = RevertError.docsPath
		const raw = props.raw
		const reason = props.reason
		const cause = props.cause
		const message = props.message ?? (props.reason ? `Reverted: ${props.reason}` : 'Execution reverted')

		// Pass properties to super() for Effect.ts equality and hashing
		super({ message, code, docsPath, cause, raw, reason })

		/** @override @type {string} */
		this.name = 'RevertError'
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.raw = raw
		this.reason = reason
		this.cause = cause
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
