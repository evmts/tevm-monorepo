import { Data } from 'effect'

/**
 * @typedef {`0x${string}`} Hex
 */

/**
 * TaggedError representing a state root not found error.
 *
 * This error occurs when attempting to access state at a specific
 * state root that doesn't exist or is no longer available.
 *
 * @example
 * ```typescript
 * import { StateRootNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new StateRootNotFoundError({
 *     stateRoot: '0x1234567890abcdef...'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('StateRootNotFoundError', (error) => {
 *   console.log(`State root ${error.stateRoot} not found`)
 * })
 * ```
 */
export class StateRootNotFoundError extends Data.TaggedError('StateRootNotFoundError') {
	/**
	 * JSON-RPC error code for invalid params (state root is a parameter).
	 * @type {number}
	 */
	static code = -32602

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/staterootnotfounderror/'

	/**
	 * The state root hash that was not found
	 * @readonly
	 * @type {Hex | undefined}
	 */
	stateRoot

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
	 * Constructs a new StateRootNotFoundError
	 * @param {Object} props - Error properties
	 * @param {Hex} [props.stateRoot] - The state root hash that was not found
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		/** @type {string} */
		this.name = 'StateRootNotFoundError'
		this.stateRoot = props.stateRoot
		this.cause = props.cause
		this.message =
			props.message ??
			(props.stateRoot !== undefined
				? `State root '${props.stateRoot}' not found`
				: 'State root not found')
		this.code = StateRootNotFoundError.code
		this.docsPath = StateRootNotFoundError.docsPath
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
