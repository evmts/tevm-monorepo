import { EVMError } from '@ethereumjs/evm'
import { GasLimitExceededError } from '../GasLimitExceededError.js'

/**
 * Parameters for constructing a {@link CodeSizeExceedsMaximumError}.
 * @typedef {Object} CodeSizeExceedsMaximumErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {GasLimitExceededError|import('@ethereumjs/evm').EVMError} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {object} [meta] - Optional object containing additional information about the error.
 */

/**
 * Represents an calldata/creation error that occurs when the code size exceeds the maximum limit.
 * This error is typically encountered when the contract size to be deployed exceeds the maximum allowed size.
 *
 * Code size exceeds maximum errors can occur due to:
 * - Deployment of contracts with large bytecode.
 * - Contracts with a significant amount of embedded data or logic.
 * - Incorrect settings for contract size limits in TEVM configuration.
 *
 * To debug a code size exceeds maximum error:
 * 1. **Review Contract Size**: Ensure that the contract bytecode size is within the allowed limits. Consider refactoring the contract to reduce its size.
 * 2. **Optimize Contract Code**: Break down large contracts into smaller, modular contracts and use libraries or inheritance to share code.
 * 3. **Configure TEVM Memory Client**: When creating a TEVM MemoryClient instance, set `allowUnlimitedContractSize` to `true` if necessary. Note that even with this setting, you may still encounter block limits.
 *    ```typescript
 *    import { createMemoryClient } from 'tevm'
 *
 *    const client = createMemoryClient({ allowUnlimitedContractSize: true })
 *    ```
 * 4. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment process and inspect the bytecode size.
 * 5. **Use Other Tools**: Use other tools to analyze and optimize contract bytecode.
 *
 * @example
 * ```typescript
 * import { CodeSizeExceedsMaximumError } from '@tevm/errors'
 * try {
 *   // Some operation that can throw a CodeSizeExceedsMaximumError
 * } catch (error) {
 *   if (error instanceof CodeSizeExceedsMaximumError) {
 *     console.error(error.message);
 *     // Handle the code size exceeds maximum error
 *   }
 * }
 * ```
 *
 * @param {string} [message='Code size exceeds maximum error occurred.'] - A human-readable error message.
 * @param {CodeSizeExceedsMaximumErrorParameters} [args={}] - Additional parameters for the BaseError.
 * @property {'CodeSizeExceedsMaximumError'} _tag - Same as name, used internally.
 * @property {'CodeSizeExceedsMaximumError'} name - The name of the error, used to discriminate errors.
 * @property {string} message - Human-readable error message.
 * @property {object} [meta] - Optional object containing additional information about the error.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {string} docsPath - Path to the documentation for this error.
 * @property {string[]} [metaMessages] - Additional meta messages for more context.
 */
export class CodeSizeExceedsMaximumError extends GasLimitExceededError {
	/** @type {string} */ static EVMErrorMessage = EVMError.errorMessages.CODESIZE_EXCEEDS_MAXIMUM
	/**
	 * Constructs a CodeSizeExceedsMaximumError.
	 * Represents an calldata/creation error that occurs when the code size exceeds the maximum limit.
	 * This error is typically encountered when the contract size to be deployed exceeds the maximum allowed size.
	 *
	 * Code size exceeds maximum errors can occur due to:
	 * - Deployment of contracts with large bytecode.
	 * - Contracts with a significant amount of embedded data or logic.
	 * - Incorrect settings for contract size limits in TEVM configuration.
	 *
	 * To debug a code size exceeds maximum error:
	 * 1. **Review Contract Size**: Ensure that the contract bytecode size is within the allowed limits. Consider refactoring the contract to reduce its size.
	 * 2. **Optimize Contract Code**: Break down large contracts into smaller, modular contracts and use libraries or inheritance to share code.
	 * 3. **Configure TEVM Memory Client**: When creating a TEVM MemoryClient instance, set `allowUnlimitedContractSize` to `true` if necessary. Note that even with this setting, you may still encounter block limits.
	 *    ```typescript
	 *    import { createMemoryClient } from 'tevm'
	 *
	 *    const client = createMemoryClient({ allowUnlimitedContractSize: true })
	 *    ```
	 * 4. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment process and inspect the bytecode size.
	 * 5. **Use Other Tools**: Use other tools to analyze and optimize contract bytecode.
	 *
	 *
	 * @param {string} [message='Code size exceeds maximum error occurred.'] - Human-readable error message.
	 * @param {CodeSizeExceedsMaximumErrorParameters} [args={}] - Additional parameters for the BaseError.
	 * @param {string} [tag='CodeSizeExceedsMaximumError'] - The tag for the error.
	 */
	constructor(message = 'Code size exceeds maximum error occurred.', args = {}, tag = 'CodeSizeExceedsMaximumError') {
		super(
			message,
			{
				...args,
				docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh',
				docsPath: args.docsPath ?? '/reference/tevm/errors/classes/codesizeexceedsmaximumerror/',
			},
			tag,
		)
	}
}
