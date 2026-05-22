import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'

/**
 * Parameters for constructing an InvalidDeployedBytecodeError.
 * @typedef {Object} InvalidDeployedBytecodeErrorParameters
 * @property {string} [docsBaseUrl]
 * @property {string} [docsPath]
 * @property {string} [docsSlug]
 * @property {string[]} [metaMessages]
 * @property {import('../ethereum/BaseError.js').BaseError|Error} [cause]
 * @property {string} [details]
 * @property {object} [meta]
 */

/**
 * Represents an error that occurs when the deployedBytecode parameter is invalid.
 *
 * This error is typically encountered when a transaction or operation references a deployedBytecode parameter that is invalid or does not conform to the expected structure.
 *
 * @example
 * ```javascript
 * import { InvalidDeployedBytecodeError } from '@tevm/errors'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.setAccount({
 *     address: '0x...',
 *     deployedBytecode: 'invalid', // This should be valid bytecode
 *   })
 * } catch (error) {
 *   if (error instanceof InvalidDeployedBytecodeError) {
 *     console.error('Invalid deployed bytecode:', error.message)
 *     console.log('Documentation:', error.docsLink)
 *   }
 * }
 * ```
 *
 * @extends {InvalidParamsError}
 */
export class InvalidDeployedBytecodeError extends InvalidParamsError {
	/**
	 * Constructs an InvalidDeployedBytecodeError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {InvalidDeployedBytecodeErrorParameters} [args={}] - Additional parameters for the InvalidDeployedBytecodeError.
	 */
	constructor(message, args = {}) {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/invaliddeployedbytecodeerror/',
			},
			'InvalidDeployedBytecodeError',
		)

		this.name = 'InvalidDeployedBytecodeError'
		this._tag = 'InvalidDeployedBytecodeError'
	}
}
