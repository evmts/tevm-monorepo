import { Data } from 'effect'

/**
 * TaggedError representing a filter not found error.
 *
 * This error occurs when attempting to use a filter that does not exist,
 * typically because it was never created, has expired, or was removed.
 *
 * @example
 * ```typescript
 * import { FilterNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new FilterNotFoundError({
 *     filterId: '0xabc123'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('FilterNotFoundError', (error) => {
 *   console.log(`Filter not found: ${error.filterId}`)
 * })
 * ```
 */
export class FilterNotFoundError extends Data.TaggedError('FilterNotFoundError') {
	/**
	 * JSON-RPC error code for resource not found.
	 * @type {number}
	 */
	static code = -32001

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/filternotfounderror/'

	/**
	 * The filter ID that was not found
	 * @readonly
	 * @type {`0x${string}` | string | undefined}
	 */
	filterId

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
	 * Constructs a new FilterNotFoundError
	 * @param {Object} props - Error properties
	 * @param {`0x${string}` | string} [props.filterId] - The filter ID that was not found
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super({})
		/** @override @type {string} */
		this.name = 'FilterNotFoundError'
		this.filterId = props.filterId
		this.message =
			props.message ??
			(props.filterId !== undefined
				? `Filter '${props.filterId}' not found`
				: 'Filter not found')
		this.code = FilterNotFoundError.code
		this.docsPath = FilterNotFoundError.docsPath
		this.cause = props.cause
	}
}
