import { InternalError } from '../ethereum/InternalErrorError.js'

/**
 * Parameters for constructing a {@link UnreachableCodeError}.
 * @typedef {Object} UnreachableCodeErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {InternalError|import('@ethereumjs/evm').EvmError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
* Represents an error that occurs when unreachable code is executed. This error always indicates a bug in the Tevm VM.
*
* Unreachable code errors can occur due to:
* - Defensive programming checks to ensure all cases in a switch or if statement are covered.

* To handle this error take the following steps:
* - ensure you did not modify the tevm VM in any unsupported way.
* - Open an issue with a minimal reproducable example
*
* @example
* ```typescript
* import { UnreachableCodeError } from '@tevm/errors'
*
* const x: 'a' | 'b'  = 'a'
*
* if (x === 'a') {
*   console.log('A')
* } else if (x === 'b') {
*   console.log('B')
* } else {
*   throw new UnreachableCodeError(x, 'Unreachable code executed.')
* }
* ```
*
* @param {never} value - The value that should be of type never.
* @param {string} [message='Unreachable code executed.'] - A human-readable error message.
* @param {UnreachableCodeErrorParameters} [args={}] - Additional parameters for the BaseError.
* @property {'UnreachableCodeError'} _tag - Same as name, used internally.
* @property {'UnreachableCodeError'} name - The name of the error, used to discriminate errors.
* @property {string} message - Human-readable error message.
* @property {object} [meta] - Optional object containing additional information about the error.
* @property {number} code - Error code, analogous to the code in JSON RPC error.
* @property {string} docsPath - Path to the documentation for this error.
* @property {string[]} [metaMessages] - Additional meta messages for more context.
*/
export class UnreachableCodeError extends InternalError {
	/**
	 * Constructs an UnreachableCodeError.
	 *
	 * @param {never} value - The value that should be of type never.
	 * @param {string} [message='Unreachable code executed.'] - Human-readable error message.
	 * @param {UnreachableCodeErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='UnreachableCodeError'] - The tag for the error.
	 */
	constructor(value, message = 'Unreachable code executed.', args = {}, tag) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/unreachablecodeerror/',
				details: `Unreachable value: ${JSON.stringify(value)}`,
			},
			tag,
		)
	}
}
