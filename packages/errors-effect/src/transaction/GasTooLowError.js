import { Data } from 'effect'

/**
 * TaggedError representing a gas too low error.
 *
 * This error occurs when the gas limit provided for a transaction is insufficient
 * to cover the intrinsic gas cost of the transaction.
 *
 * @example
 * ```typescript
 * import { GasTooLowError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new GasTooLowError({
 *     gasLimit: 21000n,
 *     intrinsicGas: 53000n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('GasTooLowError', (error) => {
 *   console.log(`Gas too low: provided ${error.gasLimit}, need ${error.intrinsicGas}`)
 * })
 * ```
 */
export class GasTooLowError extends Data.TaggedError('GasTooLowError') {
	/**
	 * JSON-RPC error code for invalid transaction.
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/gastoolowerror/'

	/**
	 * The gas limit provided in the transaction
	 * @readonly
	 * @type {bigint | undefined}
	 */
	gasLimit

	/**
	 * The minimum intrinsic gas required
	 * @readonly
	 * @type {bigint | undefined}
	 */
	intrinsicGas

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
	 * Constructs a new GasTooLowError
	 * @param {Object} props - Error properties
	 * @param {bigint} [props.gasLimit] - The gas limit provided
	 * @param {bigint} [props.intrinsicGas] - The minimum gas required
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		/** @type {string} */
		this.name = 'GasTooLowError'
		this.gasLimit = props.gasLimit
		this.intrinsicGas = props.intrinsicGas

		if (props.message) {
			this.message = props.message
		} else if (props.gasLimit !== undefined && props.intrinsicGas !== undefined) {
			this.message = `Gas too low: provided ${props.gasLimit}, but intrinsic gas is ${props.intrinsicGas}`
		} else if (props.gasLimit !== undefined) {
			this.message = `Gas limit ${props.gasLimit} is too low`
		} else {
			this.message = 'Transaction gas limit too low'
		}

		this.code = GasTooLowError.code
		this.docsPath = GasTooLowError.docsPath
		this.cause = props.cause
	}
}
