import { Data } from 'effect'

/**
 * @typedef {`0x${string}`} Hex
 */

/**
 * TaggedError representing an invalid block error.
 *
 * This error occurs when a block fails validation, such as invalid header,
 * incorrect state root, or other block structure issues.
 *
 * @example
 * ```typescript
 * import { InvalidBlockError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidBlockError({
 *     blockNumber: 12345n,
 *     reason: 'Invalid state root'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidBlockError', (error) => {
 *   console.log(`Invalid block ${error.blockNumber}: ${error.reason}`)
 * })
 * ```
 */
export class InvalidBlockError extends Data.TaggedError('InvalidBlockError') {
	/**
	 * JSON-RPC error code for invalid block.
	 * @type {number}
	 */
	static code = -32000

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/invalidblockerror/'

	/**
	 * The block number that is invalid
	 * @readonly
	 * @type {bigint | undefined}
	 */
	blockNumber

	/**
	 * The block hash that is invalid
	 * @readonly
	 * @type {Hex | undefined}
	 */
	blockHash

	/**
	 * The reason why the block is invalid
	 * @readonly
	 * @type {string | undefined}
	 */
	reason

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
	 * Constructs a new InvalidBlockError
	 * @param {Object} props - Error properties
	 * @param {bigint} [props.blockNumber] - The block number
	 * @param {Hex} [props.blockHash] - The block hash
	 * @param {string} [props.reason] - The reason for invalidity
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super({})
		/** @override @type {string} */
		this.name = 'InvalidBlockError'
		this.blockNumber = props.blockNumber
		this.blockHash = props.blockHash
		this.reason = props.reason

		if (props.message) {
			this.message = props.message
		} else if (props.blockNumber !== undefined && props.reason !== undefined) {
			this.message = `Invalid block ${props.blockNumber}: ${props.reason}`
		} else if (props.blockNumber !== undefined) {
			this.message = `Block ${props.blockNumber} is invalid`
		} else if (props.reason !== undefined) {
			this.message = `Invalid block: ${props.reason}`
		} else {
			this.message = 'Invalid block'
		}

		this.code = InvalidBlockError.code
		this.docsPath = InvalidBlockError.docsPath
		this.cause = props.cause
	}
}
