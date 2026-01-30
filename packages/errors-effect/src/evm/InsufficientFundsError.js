import { Data } from 'effect'

/**
 * @typedef {`0x${string}`} Address
 */

/**
 * TaggedError representing insufficient funds for gas * price + value.
 *
 * This error occurs when the sender account doesn't have enough balance
 * to cover the transaction's gas fees plus the value being sent.
 * This is different from InsufficientBalanceError which is about contract execution.
 *
 * @example
 * ```typescript
 * import { InsufficientFundsError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InsufficientFundsError({
 *     address: '0x1234567890123456789012345678901234567890',
 *     required: 1000000000000000000n,
 *     available: 500000000000000000n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InsufficientFundsError', (error) => {
 *   console.log(`Insufficient funds for ${error.address}: need ${error.required}, have ${error.available}`)
 * })
 * ```
 */
export class InsufficientFundsError extends Data.TaggedError('InsufficientFundsError') {
	/**
	 * JSON-RPC error code for insufficient funds.
	 * @type {number}
	 */
	static code = -32000

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/insufficientfundserror/'

	/**
	 * The address of the account
	 * @readonly
	 * @type {Address | undefined}
	 */
	address

	/**
	 * The total required balance (gas * price + value)
	 * @readonly
	 * @type {bigint | undefined}
	 */
	required

	/**
	 * The available balance
	 * @readonly
	 * @type {bigint | undefined}
	 */
	available

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
	 * Constructs a new InsufficientFundsError
	 * @param {Object} props - Error properties
	 * @param {Address} [props.address] - The account address
	 * @param {bigint} [props.required] - The total required balance
	 * @param {bigint} [props.available] - The available balance
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		/** @type {string} */
		this.name = 'InsufficientFundsError'
		this.address = props.address
		this.required = props.required
		this.available = props.available

		if (props.message) {
			this.message = props.message
		} else if (props.required !== undefined && props.available !== undefined) {
			this.message = `Insufficient funds: requires ${props.required} but account has ${props.available}`
		} else {
			this.message = 'Insufficient funds for gas * price + value'
		}

		this.code = InsufficientFundsError.code
		this.docsPath = InsufficientFundsError.docsPath
		this.cause = props.cause
	}
}
