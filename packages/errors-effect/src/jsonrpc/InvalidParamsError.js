import { Data } from 'effect'

/**
 * TaggedError representing invalid JSON-RPC parameters.
 *
 * This error occurs when the parameters provided to a JSON-RPC method
 * are invalid, such as wrong types, missing required params, or invalid values.
 *
 * @example
 * ```typescript
 * import { InvalidParamsError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidParamsError({
 *     method: 'eth_getBalance',
 *     params: ['invalid-address', 'latest']
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidParamsError', (error) => {
 *   console.log(`Invalid params for ${error.method}: ${error.message}`)
 * })
 * ```
 */
export class InvalidParamsError extends Data.TaggedError('InvalidParamsError') {
	/**
	 * JSON-RPC error code for invalid params.
	 * Standard JSON-RPC 2.0 error code: -32602
	 * @type {number}
	 */
	static code = -32602

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/invalidparamserror/'

	/**
	 * The method that received invalid parameters
	 * @readonly
	 * @type {string | undefined}
	 */
	method

	/**
	 * The invalid parameters that were provided
	 * @readonly
	 * @type {unknown}
	 */
	params

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
	 * Constructs a new InvalidParamsError
	 * @param {Object} props - Error properties
	 * @param {string} [props.method] - The method that received invalid params
	 * @param {unknown} [props.params] - The invalid parameters
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super({})
		/** @override @type {string} */
		this.name = 'InvalidParamsError'
		this.method = props.method
		this.params = props.params
		this.message =
			props.message ??
			(props.method !== undefined
				? `Invalid parameters for method '${props.method}'`
				: 'Invalid parameters')
		this.code = InvalidParamsError.code
		this.docsPath = InvalidParamsError.docsPath
		this.cause = props.cause
	}
}
