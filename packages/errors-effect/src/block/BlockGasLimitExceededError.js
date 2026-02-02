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
	 * Constructs a new BlockGasLimitExceededError
	 * @param {Object} props - Error properties
	 * @param {bigint} [props.blockGasLimit] - The block's gas limit
	 * @param {bigint} [props.gasUsed] - The gas used or required
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all properties BEFORE calling super() for Effect.ts equality/hashing
		const blockGasLimit = props.blockGasLimit
		const gasUsed = props.gasUsed
		const cause = props.cause

		let message
		if (props.message) {
			message = props.message
		} else if (props.blockGasLimit !== undefined && props.gasUsed !== undefined) {
			message = `Block gas limit exceeded: used ${props.gasUsed} of ${props.blockGasLimit}`
		} else if (props.gasUsed !== undefined) {
			message = `Gas usage ${props.gasUsed} exceeds block gas limit`
		} else {
			message = 'Block gas limit exceeded'
		}

		const code = BlockGasLimitExceededError.code
		const docsPath = BlockGasLimitExceededError.docsPath

		// Pass ALL properties to super() for Effect.ts equality and hashing
		super({ blockGasLimit, gasUsed, cause, message, code, docsPath })

		/** @override @type {string} */
		this.name = 'BlockGasLimitExceededError'
		this.blockGasLimit = blockGasLimit
		this.gasUsed = gasUsed
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.cause = cause
	}
}
