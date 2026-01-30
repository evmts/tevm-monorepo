import { Data } from 'effect'

/**
 * TaggedError representing a network error.
 *
 * This error occurs when a network request fails, such as connection refused,
 * DNS resolution failure, or other network-level issues.
 *
 * @example
 * ```typescript
 * import { NetworkError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new NetworkError({
 *     url: 'https://mainnet.infura.io/v3/...',
 *     cause: new Error('Connection refused')
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('NetworkError', (error) => {
 *   console.log(`Network error for ${error.url}: ${error.message}`)
 * })
 * ```
 */
export class NetworkError extends Data.TaggedError('NetworkError') {
	/**
	 * JSON-RPC error code for network errors.
	 * @type {number}
	 */
	static code = -32603

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/networkerror/'

	/**
	 * The URL that was being requested
	 * @readonly
	 * @type {string | undefined}
	 */
	url

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
	 * Constructs a new NetworkError
	 * @param {Object} props - Error properties
	 * @param {string} [props.url] - The URL that failed
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		/** @type {string} */
		this.name = 'NetworkError'
		this.url = props.url
		this.cause = props.cause
		this.message =
			props.message ??
			(props.url !== undefined
				? `Network request failed for '${props.url}'`
				: 'Network request failed')
		this.code = NetworkError.code
		this.docsPath = NetworkError.docsPath
	}
}
