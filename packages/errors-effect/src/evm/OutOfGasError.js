import { Data } from 'effect'

/**
 * TaggedError representing an out of gas error during EVM execution.
 *
 * This error occurs when a transaction runs out of gas during execution.
 *
 * @example
 * ```typescript
 * import { OutOfGasError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new OutOfGasError({
 *     gasUsed: 100000n,
 *     gasLimit: 21000n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('OutOfGasError', (error) => {
 *   console.log(`Gas used: ${error.gasUsed}, limit was: ${error.gasLimit}`)
 * })
 * ```
 */
export class OutOfGasError extends Data.TaggedError('OutOfGasError') {
	/**
	 * JSON-RPC error code for gas limit exceeded
	 * @type {number}
	 */
	static code = -32003

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/outofgaserror/'

	/**
	 * The gas used when the error occurred
	 * @readonly
	 * @type {bigint | undefined}
	 */
	gasUsed

	/**
	 * The gas limit for the transaction
	 * @readonly
	 * @type {bigint | undefined}
	 */
	gasLimit

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
	 * Enables error chaining for better debugging.
	 * @readonly
	 * @type {unknown}
	 */
	cause

	/**
	 * Constructs a new OutOfGasError
	 * @param {Object} props - Error properties
	 * @param {bigint} [props.gasUsed] - The gas used when the error occurred
	 * @param {bigint} [props.gasLimit] - The gas limit for the transaction
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		this.gasUsed = props.gasUsed
		this.gasLimit = props.gasLimit
		this.message =
			props.message ??
			(props.gasUsed !== undefined || props.gasLimit !== undefined
				? `Out of gas: used ${props.gasUsed ?? 'unknown'}, limit ${props.gasLimit ?? 'unknown'}`
				: 'Out of gas error occurred.')
		this.code = OutOfGasError.code
		this.docsPath = OutOfGasError.docsPath
		this.cause = props.cause
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
