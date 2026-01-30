import { Data } from 'effect'

/**
 * @typedef {`0x${string}`} Address
 */

/**
 * TaggedError representing an account not found error.
 *
 * This error occurs when attempting to access an account that does not exist
 * in the state, typically in non-forking mode or when the account hasn't been created.
 *
 * @example
 * ```typescript
 * import { AccountNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new AccountNotFoundError({
 *     address: '0x1234567890123456789012345678901234567890'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('AccountNotFoundError', (error) => {
 *   console.log(`Account not found: ${error.address}`)
 * })
 * ```
 */
export class AccountNotFoundError extends Data.TaggedError('AccountNotFoundError') {
	/**
	 * JSON-RPC error code for resource not found.
	 * @type {number}
	 */
	static code = -32001

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/accountnotfounderror/'

	/**
	 * The address of the account that was not found
	 * @readonly
	 * @type {Address | undefined}
	 */
	address

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
	 * Constructs a new AccountNotFoundError
	 * @param {Object} props - Error properties
	 * @param {Address} [props.address] - The address that was not found
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		/** @type {string} */
		this.name = 'AccountNotFoundError'
		this.address = props.address
		this.message =
			props.message ??
			(props.address !== undefined
				? `Account '${props.address}' not found`
				: 'Account not found')
		this.code = AccountNotFoundError.code
		this.docsPath = AccountNotFoundError.docsPath
		this.cause = props.cause
	}
}
