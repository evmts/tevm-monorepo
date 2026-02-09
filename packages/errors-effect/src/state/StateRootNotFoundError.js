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
	 * @override
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
		// Compute all property values BEFORE calling super() for Effect.ts equality/hashing
		const name = 'StateRootNotFoundError'
		const stateRoot = props.stateRoot
		const message =
			props.message ??
			(props.stateRoot !== undefined ? `State root '${props.stateRoot}' not found` : 'State root not found')
		const code = StateRootNotFoundError.code
		const docsPath = StateRootNotFoundError.docsPath
		const cause = props.cause

		// Pass all properties to super() for Effect.ts equality and hashing
		super({ name, stateRoot, message, code, docsPath, cause })

		/** @override @type {string} */
		this.name = name
		this.stateRoot = stateRoot
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.cause = cause
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
