import { Data } from 'effect'

/**
 * Base TaggedError for all TEVM errors in the Effect.ts ecosystem.
 * This provides a common structure for all TEVM errors with typed error handling.
 *
 * @example
 * ```typescript
 * import { TevmError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new TevmError({
 *     message: 'Something went wrong',
 *     code: -32000,
 *     docsPath: '/reference/tevm/errors/classes/tevmerror/'
 *   }))
 * })
 * ```
 */
export class TevmError extends Data.TaggedError('TevmError') {
	/**
	 * The error message
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
	 * Path to documentation for this error
	 * @readonly
	 * @type {string | undefined}
	 */
	docsPath

	/**
	 * The underlying cause of this error, if any
	 * @readonly
	 * @type {unknown}
	 */
	cause

	/**
	 * Constructs a new TevmError
	 * @param {Object} props - Error properties
	 * @param {string} props.message - Human-readable error message
	 * @param {number} [props.code=0] - JSON-RPC error code
	 * @param {string} [props.docsPath] - Path to documentation for this error
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props) {
		super()
		this.message = props.message
		this.code = props.code ?? 0
		this.docsPath = props.docsPath
		this.cause = props.cause
		// Freeze to enforce runtime immutability - JSDoc @readonly is documentation-only
		Object.freeze(this)
	}

	/**
	 * Returns a string representation of the error
	 * @returns {string}
	 */
	toString() {
		const parts = [this.message]
		if (this.docsPath) {
			parts.push(`Docs: https://tevm.sh${this.docsPath}`)
		}
		return parts.join('\n')
	}
}
