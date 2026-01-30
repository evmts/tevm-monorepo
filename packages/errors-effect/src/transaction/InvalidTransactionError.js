import { Data } from 'effect'

/**
 * TaggedError representing an invalid transaction error.
 *
 * This error occurs when a transaction doesn't conform to
 * the required format or validation rules.
 *
 * @example
 * ```typescript
 * import { InvalidTransactionError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidTransactionError({
 *     reason: 'Invalid nonce',
 *     tx: { to: '0x123...', value: 100n }
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidTransactionError', (error) => {
 *   console.log(`Invalid transaction: ${error.reason}`)
 * })
 * ```
 */
export class InvalidTransactionError extends Data.TaggedError('InvalidTransactionError') {
	/**
	 * JSON-RPC error code for invalid transaction.
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/invalidtransactionerror/'

	/**
	 * The reason why the transaction is invalid
	 * @readonly
	 * @type {string | undefined}
	 */
	reason

	/**
	 * The invalid transaction object
	 * @readonly
	 * @type {unknown}
	 */
	tx

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
	 * Constructs a new InvalidTransactionError
	 * @param {Object} props - Error properties
	 * @param {string} [props.reason] - The reason why the transaction is invalid
	 * @param {unknown} [props.tx] - The invalid transaction object
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super({})
		/** @override @type {string} */
		this.name = 'InvalidTransactionError'
		this.reason = props.reason
		this.tx = props.tx
		this.cause = props.cause
		this.message =
			props.message ??
			(props.reason !== undefined
				? `Invalid transaction: ${props.reason}`
				: 'Invalid transaction')
		this.code = InvalidTransactionError.code
		this.docsPath = InvalidTransactionError.docsPath
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
