import { Data } from 'effect'

/**
 * @typedef {`0x${string}` | 'latest' | 'pending' | 'earliest' | 'safe' | 'finalized' | bigint | number} BlockTag
 */

/**
 * TaggedError representing a block not found error.
 *
 * This error occurs when a specified block could not be found,
 * either by block number, hash, or tag.
 *
 * @example
 * ```typescript
 * import { BlockNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new BlockNotFoundError({
 *     blockTag: 'latest'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('BlockNotFoundError', (error) => {
 *   console.log(`Block ${error.blockTag} not found`)
 * })
 * ```
 */
export class BlockNotFoundError extends Data.TaggedError('BlockNotFoundError') {
	/**
	 * JSON-RPC error code for unknown block.
	 * @type {number}
	 */
	static code = -32001

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/unknownblockerror/'

	/**
	 * The block tag, number, or hash that was not found
	 * @readonly
	 * @type {BlockTag | undefined}
	 */
	blockTag

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
	 * Constructs a new BlockNotFoundError
	 * @param {Object} props - Error properties
	 * @param {BlockTag} [props.blockTag] - The block tag, number, or hash that was not found
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		/** @type {string} */
		this.name = 'BlockNotFoundError'
		this.blockTag = props.blockTag
		this.cause = props.cause
		this.message =
			props.message ??
			(props.blockTag !== undefined
				? `Block '${String(props.blockTag)}' not found`
				: 'Block not found')
		this.code = BlockNotFoundError.code
		this.docsPath = BlockNotFoundError.docsPath
		// NOTE: Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes.
	}
}
