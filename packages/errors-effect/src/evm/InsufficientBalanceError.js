import { Data } from 'effect'

/**
 * @typedef {`0x${string}`} Address
 */

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
	 * JSON-RPC error code for insufficient balance
	 * @type {number}
	 */
	static code = -32000

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/insufficientbalanceerror/'

	/**
	 * The address that has insufficient balance
	 * @type {Address}
	 */
	address

	/**
	 * The required balance to perform the operation
	 * @type {bigint}
	 */
	required

	/**
	 * The available balance in the account
	 * @type {bigint}
	 */
	available

	/**
	 * Human-readable error message
	 * @type {string}
	 */
	message

	/**
	 * JSON-RPC error code
	 * @type {number}
	 */
	code

	/**
	 * Path to documentation
	 * @type {string}
	 */
	docsPath

	/**
	 * Constructs a new InsufficientBalanceError
	 * @param {Object} props - Error properties
	 * @param {Address} props.address - The address with insufficient balance
	 * @param {bigint} props.required - The required balance
	 * @param {bigint} props.available - The available balance
	 * @param {string} [props.message] - Optional custom message
	 */
	constructor(props) {
		super()
		this.address = props.address
		this.required = props.required
		this.available = props.available
		this.message =
			props.message ??
			`Insufficient balance: account ${props.address} requires ${props.required} but has ${props.available}`
		this.code = InsufficientBalanceError.code
		this.docsPath = InsufficientBalanceError.docsPath
	}
}
