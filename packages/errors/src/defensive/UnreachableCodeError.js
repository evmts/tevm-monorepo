import { InternalError } from '../ethereum/InternalErrorError.js'

/**
 * Parameters for constructing a {@link UnreachableCodeError}.
 * @typedef {Object} UnreachableCodeErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {InternalError|import('@evmts/zevm/evm-error').EVMError} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when unreachable code is executed.
 * This error always indicates a bug in the Tevm VM.
 *
 * @example
 * ```javascript
 * import { UnreachableCodeError } from '@tevm/errors'
 *
 * function assertUnreachable(x) {
 *   throw new UnreachableCodeError(x, 'Unreachable code executed')
 * }
 *
 * function getArea(shape) {
 *   switch (shape) {
 *     case 'circle':
 *       return Math.PI * Math.pow(radius, 2)
 *     case 'square':
 *       return side * side
 *     default:
 *       return assertUnreachable(shape)
 *   }
 * }
 *
 * try {
 *   getArea('triangle') // This should be unreachable
 * } catch (error) {
 *   if (error instanceof UnreachableCodeError) {
 *     console.error('Unreachable code executed:', error.message)
 *     console.log('Unreachable value:', error.value)
 *     // This indicates a bug in the Tevm VM
 *     reportBugToTevmRepository(error)
 *   }
 * }
 * ```
 *
 * @extends {InternalError}
 */
export class UnreachableCodeError extends InternalError {
	/**
	 * The value that should be unreachable.
	 * @type {*}
	 */
	value

	/**
	 * Constructs an UnreachableCodeError.
	 *
	 * @param {*} value - The value that should be unreachable.
	 * @param {string} [message] - Human-readable error message.
	 * @param {UnreachableCodeErrorParameters} [args] - Additional parameters for the error.
	 */
	constructor(value, message, args = {}) {
		super(
			message || `Unreachable code executed with value: ${JSON.stringify(value)}`,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/unreachablecodeerror/',
				details: `Unreachable value: ${JSON.stringify(value)}`,
			},
			'UnreachableCodeError',
		)

		this.value = value
		this.name = 'UnreachableCodeError'
		this._tag = 'UnreachableCodeError'
	}
}
