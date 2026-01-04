/**
 * @module getContractError
 * @description Native implementation of getContractError that replaces viem's version.
 * Converts raw errors into detailed contract function errors with proper context.
 */

import {
	ContractFunctionExecutionError,
	ContractFunctionRevertedError,
	ContractFunctionZeroDataError,
	RawContractError,
} from '@tevm/errors'

/**
 * Internal RPC error code for execution reverted.
 * @type {number}
 */
const EXECUTION_REVERTED_ERROR_CODE = 3

/**
 * Invalid input RPC error code.
 * @type {number}
 */
const INVALID_INPUT_ERROR_CODE = -32000

/**
 * Internal RPC error code.
 * @type {number}
 */
const INTERNAL_ERROR_CODE = -32603

/**
 * Converts a raw contract error into a detailed ContractFunctionExecutionError.
 * This function handles various error types and formats them consistently.
 *
 * @param {Error | RawContractError} err - The error to convert
 * @param {Object} options - Options for error formatting
 * @param {ReadonlyArray<{type: string, name?: string, inputs?: ReadonlyArray<{type: string, name?: string}>}>} options.abi - The contract ABI
 * @param {`0x${string}`} [options.address] - The contract address
 * @param {unknown[]} [options.args] - The arguments passed to the function
 * @param {string} [options.docsPath] - Path to relevant documentation
 * @param {string} options.functionName - The name of the function that failed
 * @param {`0x${string}`} [options.sender] - The sender address
 * @returns {ContractFunctionExecutionError} A detailed contract function execution error
 *
 * @example
 * ```javascript
 * import { getContractError, RawContractError } from '@tevm/utils'
 *
 * const rawError = new RawContractError({ data: '0x08c379a0...' })
 * const detailedError = getContractError(rawError, {
 *   abi: contractAbi,
 *   functionName: 'transfer',
 *   address: '0x...',
 *   args: ['0x...', 100n],
 * })
 * ```
 */
export function getContractError(err, { abi, address, args, docsPath, functionName, sender }) {
	// Extract error data from different error types
	const error = extractErrorData(err)
	const { code, data, details, message, shortMessage } = error

	// Determine the cause based on error type and data
	const cause = determineCause(err, {
		abi,
		code,
		data,
		details,
		functionName,
		message,
		shortMessage,
	})

	// Wrap in ContractFunctionExecutionError with full context
	return new ContractFunctionExecutionError(cause, {
		abi,
		args,
		contractAddress: address,
		docsPath,
		functionName,
		sender,
	})
}

/**
 * Extracts error data from various error types.
 * Handles RawContractError, BaseError with walk(), and plain objects.
 *
 * @param {Error | RawContractError} err - The error to extract data from
 * @returns {{ code?: number, data?: `0x${string}` | { data?: `0x${string}` }, details?: string, message?: string, shortMessage?: string }}
 */
function extractErrorData(err) {
	if (err instanceof RawContractError) {
		return /** @type {any} */ (err)
	}

	// Handle errors with a walk method (BaseError pattern)
	if (err && typeof err === 'object' && 'walk' in err && typeof err.walk === 'function') {
		// Try to find an error with 'data' property
		const errorWithData = err.walk((/** @type {unknown} */ e) => e && typeof e === 'object' && 'data' in e)
		if (errorWithData) {
			return /** @type {any} */ (errorWithData)
		}
		// Fall back to the deepest cause
		return /** @type {any} */ (err.walk())
	}

	// Return as-is for other error types
	return /** @type {any} */ (err)
}

/**
 * Determines the appropriate cause error based on error type and data.
 *
 * @param {Error | RawContractError} originalErr - The original error
 * @param {Object} options - Error data and options
 * @param {ReadonlyArray<{type: string, name?: string, inputs?: ReadonlyArray<{type: string, name?: string}>}>} options.abi - The contract ABI
 * @param {number} [options.code] - The error code
 * @param {`0x${string}` | { data?: `0x${string}` } | undefined} [options.data] - The error data
 * @param {string} [options.details] - Error details
 * @param {string} options.functionName - The function name
 * @param {string} [options.message] - Error message
 * @param {string} [options.shortMessage] - Short error message
 * @returns {Error} The appropriate cause error
 */
function determineCause(originalErr, { abi, code, data, details, functionName, message, shortMessage }) {
	// Check for AbiDecodingZeroDataError pattern (when data is "0x")
	if (
		originalErr &&
		typeof originalErr === 'object' &&
		'name' in originalErr &&
		originalErr.name === 'AbiDecodingZeroDataError'
	) {
		return new ContractFunctionZeroDataError({ functionName })
	}

	// Check if this is an execution reverted error with data
	const isExecutionReverted =
		code === EXECUTION_REVERTED_ERROR_CODE ||
		code === INTERNAL_ERROR_CODE ||
		(code === INVALID_INPUT_ERROR_CODE && details === 'execution reverted')

	const hasRevertData = data || details || message || shortMessage

	if (isExecutionReverted && hasRevertData) {
		// Extract the actual data value
		const revertData =
			typeof data === 'object' && data !== null && 'data' in data
				? /** @type {`0x${string}`} */ (data.data)
				: /** @type {`0x${string}` | undefined} */ (data)

		return new ContractFunctionRevertedError({
			abi,
			data: revertData,
			functionName,
			message: shortMessage ?? message,
		})
	}

	// Return original error as cause
	return originalErr
}

// Re-export RawContractError for convenience
export { RawContractError } from '@tevm/errors'
