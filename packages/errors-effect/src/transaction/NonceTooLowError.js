import { Data } from 'effect'

/**
 * @typedef {`0x${string}`} Address
 */

/**
 * TaggedError representing a nonce too low error.
 *
 * This error occurs when a transaction's nonce is lower than the account's
 * current nonce, indicating the transaction may have already been processed.
 *
 * @example
 * ```typescript
 * import { NonceTooLowError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new NonceTooLowError({
 *     address: '0x1234567890123456789012345678901234567890',
 *     expected: 5n,
 *     actual: 3n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('NonceTooLowError', (error) => {
 *   console.log(`Nonce too low for ${error.address}: expected ${error.expected}, got ${error.actual}`)
 * })
 * ```
 */
export class NonceTooLowError extends Data.TaggedError('NonceTooLowError') {
	/**
	 * JSON-RPC error code for invalid transaction.
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/noncetoolowerror/'

	/**
	 * The address of the account
	 * @readonly
	 * @type {Address | undefined}
	 */
	address

	/**
	 * The expected nonce value
	 * @readonly
	 * @type {bigint | undefined}
	 */
	expected

	/**
	 * The actual nonce value provided
	 * @readonly
	 * @type {bigint | undefined}
	 */
	actual

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
	 * Constructs a new NonceTooLowError
	 * @param {Object} props - Error properties
	 * @param {Address} [props.address] - The account address
	 * @param {bigint} [props.expected] - The expected nonce
	 * @param {bigint} [props.actual] - The actual nonce provided
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all properties BEFORE calling super() for Effect.ts equality/hashing
		const name = 'NonceTooLowError'
		const address = props.address
		const expected = props.expected
		const actual = props.actual
		const cause = props.cause
		const code = NonceTooLowError.code
		const docsPath = NonceTooLowError.docsPath

		let message
		if (props.message) {
			message = props.message
		} else if (props.expected !== undefined && props.actual !== undefined) {
			message = `Nonce too low: expected ${props.expected}, got ${props.actual}`
		} else {
			message = 'Transaction nonce too low'
		}

		// Pass all properties to super() for Effect.ts equality and hashing
		super({ name, address, expected, actual, message, code, docsPath, cause })

		// Assign to instance properties
		/** @override @type {string} */
		this.name = name
		this.address = address
		this.expected = expected
		this.actual = actual
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.cause = cause
	}
}
