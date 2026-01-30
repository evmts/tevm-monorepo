import { Data } from 'effect'

/**
 * TaggedError representing a block gas limit exceeded error.
 *
 * This error occurs when a transaction or set of transactions exceeds
 * the block's gas limit.
 *
 * @example
 * ```typescript
 * import { BlockGasLimitExceededError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new BlockGasLimitExceededError({
 *     blockGasLimit: 30000000n,
 *     gasUsed: 35000000n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('BlockGasLimitExceededError', (error) => {
 *   console.log(`Block gas limit exceeded: used ${error.gasUsed} of ${error.blockGasLimit}`)
 * })
 * ```
 */
export class BlockGasLimitExceededError extends Data.TaggedError('BlockGasLimitExceededError') {
	/**
	 * JSON-RPC error code for gas limit exceeded.
	 * @type {number}
	 */
	static code = -32000

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/blockgaslimitexceedederror/'

	/**
	 * The block's gas limit
	 * @readonly
	 * @type {bigint | undefined}
	 */
	blockGasLimit

	/**
	 * The gas used or required
	 * @readonly
	 * @type {bigint | undefined}
	 */
	gasUsed

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
	 * Constructs a new BlockGasLimitExceededError
	 * @param {Object} props - Error properties
	 * @param {bigint} [props.blockGasLimit] - The block's gas limit
	 * @param {bigint} [props.gasUsed] - The gas used or required
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		/** @type {string} */
		this.name = 'BlockGasLimitExceededError'
		this.blockGasLimit = props.blockGasLimit
		this.gasUsed = props.gasUsed

		if (props.message) {
			this.message = props.message
		} else if (props.blockGasLimit !== undefined && props.gasUsed !== undefined) {
			this.message = `Block gas limit exceeded: used ${props.gasUsed} of ${props.blockGasLimit}`
		} else if (props.gasUsed !== undefined) {
			this.message = `Gas usage ${props.gasUsed} exceeds block gas limit`
		} else {
			this.message = 'Block gas limit exceeded'
		}

		this.code = BlockGasLimitExceededError.code
		this.docsPath = BlockGasLimitExceededError.docsPath
		this.cause = props.cause
	}
}
