import { Data } from 'effect'

/**
 * TaggedError representing insufficient balance during EVM execution.
 *
 * This error occurs when an account has insufficient balance to perform a transaction.
 *
 * @example
 * ```typescript
 * import { InsufficientBalanceError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InsufficientBalanceError({
 *     address: '0x1234...',
 *     required: 1000000000000000000n,
 *     available: 500000000000000000n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InsufficientBalanceError', (error) => {
 *   console.log(`Account ${error.address} needs ${error.required} but has ${error.available}`)
 * })
 * ```
 */
export class InsufficientBalanceError extends Data.TaggedError('InsufficientBalanceError') {
	/**
	 * JSON-RPC error code for insufficient balance.
	 * Uses -32015 to match the original @tevm/errors ExecutionError code.
	 * @type {number}
	 */
	static code = -32015

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/insufficientbalanceerror/'

	/**
	 * The address that has insufficient balance
	 * @readonly
	 * @type {`0x${string}` | undefined}
	 */
	address

	/**
	 * The required balance to perform the operation
	 * @readonly
	 * @type {bigint | undefined}
	 */
	required

	/**
	 * The available balance in the account
	 * @readonly
	 * @type {bigint | undefined}
	 */
	available

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
	 * Constructs a new InsufficientBalanceError
	 * @param {Object} props - Error properties
	 * @param {`0x${string}`} [props.address] - The address with insufficient balance
	 * @param {bigint} [props.required] - The required balance
	 * @param {bigint} [props.available] - The available balance
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all final property values before calling super
		const code = InsufficientBalanceError.code
		const docsPath = InsufficientBalanceError.docsPath
		const address = props.address
		const required = props.required
		const available = props.available
		const cause = props.cause
		const message =
			props.message ??
			(props.address !== undefined
				? `Insufficient balance: account ${props.address} requires ${props.required} but has ${props.available}`
				: 'Insufficient balance error occurred.')

		// Pass properties to super() for Effect.ts equality and hashing
		super({ message, code, docsPath, cause, address, required, available })

		/** @override @type {string} */
		this.name = 'InsufficientBalanceError'
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.address = address
		this.required = required
		this.available = available
		this.cause = cause
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
