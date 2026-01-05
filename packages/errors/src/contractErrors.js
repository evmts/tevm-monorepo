/**
 * @module contractErrors
 * @description Native contract error classes that replace viem's contract errors.
 * These are used for handling contract call failures with proper error decoding.
 */

import { BaseError } from './ethereum/BaseError.js'

/**
 * Represents a raw contract error with optional data.
 * This is used as an intermediate error type before decoding.
 * @extends {BaseError}
 * @example
 * ```javascript
 * import { RawContractError } from '@tevm/errors'
 * const error = new RawContractError({ data: '0x08c379a0...' })
 * ```
 */
export class RawContractError extends BaseError {
	/**
	 * Error code for contract errors (EIP-1474).
	 * @override
	 * @type {number}
	 */
	code = 3

	/**
	 * The raw error data from the contract.
	 * Can be a hex string or an object containing the data.
	 * @type {`0x${string}` | { data?: `0x${string}` | undefined } | undefined}
	 */
	data

	/**
	 * @param {Object} options - Error options
	 * @param {`0x${string}` | { data?: `0x${string}` | undefined } | undefined} [options.data] - The raw error data
	 * @param {string} [options.message] - Optional error message
	 */
	constructor({ data, message }) {
		super(message || '', {}, 'RawContractError', 3)
		this.data = data
	}
}

/**
 * Error thrown when a contract function returns no data ("0x").
 * This typically indicates the function doesn't exist or wrong parameters were passed.
 * @extends {BaseError}
 * @example
 * ```javascript
 * import { ContractFunctionZeroDataError } from '@tevm/errors'
 * throw new ContractFunctionZeroDataError({ functionName: 'transfer' })
 * ```
 */
export class ContractFunctionZeroDataError extends BaseError {
	/**
	 * @param {Object} options - Error options
	 * @param {string} options.functionName - The name of the function that returned no data
	 */
	constructor({ functionName }) {
		super(
			`The contract function "${functionName}" returned no data ("0x").`,
			{
				metaMessages: [
					'This could be due to any of the following:',
					`  - The contract does not have the function "${functionName}",`,
					'  - The parameters passed to the contract function may be invalid, or',
					'  - The address is not a contract.',
				],
			},
			'ContractFunctionZeroDataError',
		)
	}
}

/**
 * Panic reason codes mapping.
 * @type {Record<number, string>}
 */
const panicReasons = {
	0x00: 'An `assert` condition failed.',
	0x01: 'Arithmetic operation resulted in underflow or overflow.',
	0x11: 'Arithmetic operation resulted in underflow or overflow.',
	0x12: 'Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).',
	0x21: 'Converted a value that is too big or negative into an enum type.',
	0x22: 'Accessed storage byte array that is incorrectly encoded.',
	0x31: 'Called `.pop()` on an empty array.',
	0x32: 'Accessed array index that is out of bounds.',
	0x41: 'Allocated too much memory or created an array that is too large.',
	0x51: 'Called a zero-initialized variable of internal function type.',
}

/**
 * Error thrown when a contract function reverts.
 * Includes decoded error data when available.
 * @extends {BaseError}
 * @example
 * ```javascript
 * import { ContractFunctionRevertedError } from '@tevm/errors'
 * throw new ContractFunctionRevertedError({
 *   abi: [...],
 *   functionName: 'transfer',
 *   data: '0x08c379a0...',
 * })
 * ```
 */
export class ContractFunctionRevertedError extends BaseError {
	/**
	 * The decoded error data, if decoding was successful.
	 * @type {unknown}
	 */
	data

	/**
	 * The raw hex data from the revert.
	 * @type {`0x${string}` | undefined}
	 */
	raw

	/**
	 * The decoded reason string, if available.
	 * @type {string | undefined}
	 */
	reason

	/**
	 * The error signature, if the error couldn't be decoded.
	 * @type {`0x${string}` | undefined}
	 */
	signature

	/**
	 * @param {Object} options - Error options
	 * @param {ReadonlyArray<{type: string, name?: string, inputs?: ReadonlyArray<{type: string, name?: string}>}>} [options.abi] - The contract ABI for error decoding
	 * @param {`0x${string}`} [options.data] - The raw error data
	 * @param {string} options.functionName - The name of the function that reverted
	 * @param {string} [options.message] - Optional error message override
	 */
	constructor({ abi, data, functionName, message }) {
		let decodedData
		let decodedReason
		let decodedSignature
		let errorName = 'Error'

		// Try to decode the error data
		if (data && data !== '0x') {
			try {
				// Get the selector (first 4 bytes)
				const selector = /** @type {`0x${string}`} */ (data.slice(0, 10))

				// Check for standard Error(string) - selector 0x08c379a0
				if (selector === '0x08c379a0') {
					// Decode the string manually - skip selector, then decode ABI string
					// The data format is: selector (4 bytes) + offset (32 bytes) + length (32 bytes) + string data
					const hexData = data.slice(10) // Remove selector
					if (hexData.length >= 128) {
						// At least offset + length
						const lengthHex = hexData.slice(64, 128)
						const length = parseInt(lengthHex, 16)
						const stringHex = hexData.slice(128, 128 + length * 2)
						let reasonString = ''
						for (let i = 0; i < stringHex.length; i += 2) {
							const charCode = parseInt(stringHex.slice(i, i + 2), 16)
							if (charCode !== 0) reasonString += String.fromCharCode(charCode)
						}
						decodedReason = reasonString
						errorName = 'Error'
					}
				}
				// Check for Panic(uint256) - selector 0x4e487b71
				else if (selector === '0x4e487b71') {
					const panicCode = Number(BigInt('0x' + data.slice(10)))
					decodedReason = panicReasons[panicCode] || `Panic due to ${panicCode}`
					errorName = 'Panic'
				}
				// Try to match against custom errors in the ABI
				else if (abi) {
					const errorItem = abi.find(
						(item) => item.type === 'error' && getSelector(item) === selector,
					)
					if (errorItem && 'name' in errorItem && errorItem.name) {
						errorName = errorItem.name
						decodedSignature = selector
					} else {
						decodedSignature = selector
					}
				} else {
					decodedSignature = selector
				}

				decodedData = { args: [], errorName }
			} catch (_e) {
				// If decoding fails, keep the raw data
				decodedSignature = /** @type {`0x${string}`} */ (data.slice(0, 10))
			}
		}

		const shortMessage = decodedReason
			? `The contract function "${functionName}" reverted with the following reason:\n${decodedReason}`
			: decodedSignature
				? `The contract function "${functionName}" reverted with the following signature:\n${decodedSignature}`
				: message || `The contract function "${functionName}" reverted.`

		super(shortMessage, {}, 'ContractFunctionRevertedError')

		this.data = decodedData
		this.raw = data
		this.reason = decodedReason
		this.signature = decodedSignature
	}
}

/**
 * Error thrown when a contract function execution fails.
 * This wraps other errors with additional context about the contract call.
 * @extends {BaseError}
 * @example
 * ```javascript
 * import { ContractFunctionExecutionError } from '@tevm/errors'
 * throw new ContractFunctionExecutionError(cause, {
 *   abi: [...],
 *   functionName: 'transfer',
 *   args: ['0x...', 100n],
 *   contractAddress: '0x...',
 * })
 * ```
 */
export class ContractFunctionExecutionError extends BaseError {
	/**
	 * The contract ABI.
	 * @type {ReadonlyArray<{type: string, name?: string, inputs?: ReadonlyArray<{type: string, name?: string}>}>}
	 */
	abi

	/**
	 * The arguments passed to the function.
	 * @type {unknown[] | undefined}
	 */
	args

	/**
	 * The underlying cause of the error.
	 * @override
	 * @type {BaseError | Error}
	 */
	cause

	/**
	 * The contract address.
	 * @type {`0x${string}` | undefined}
	 */
	contractAddress

	/**
	 * The function name that was called.
	 * @type {string}
	 */
	functionName

	/**
	 * The sender address.
	 * @type {`0x${string}` | undefined}
	 */
	sender

	/**
	 * @param {BaseError | Error} cause - The underlying error
	 * @param {Object} options - Error options
	 * @param {ReadonlyArray<{type: string, name?: string, inputs?: ReadonlyArray<{type: string, name?: string}>}>} options.abi - The contract ABI
	 * @param {unknown[]} [options.args] - The arguments passed to the function
	 * @param {`0x${string}`} [options.contractAddress] - The contract address
	 * @param {string} [options.docsPath] - Path to relevant documentation
	 * @param {string} options.functionName - The name of the function that failed
	 * @param {`0x${string}`} [options.sender] - The sender address
	 */
	constructor(cause, { abi, args, contractAddress, docsPath, functionName, sender }) {
		const shortMessage =
			'shortMessage' in cause && typeof cause.shortMessage === 'string'
				? cause.shortMessage
				: `An unknown error occurred while executing the contract function "${functionName}".`

		// Build meta messages with contract call context
		/** @type {string[]} */
		const metaMessages = []

		// Include cause's meta messages if present
		if ('metaMessages' in cause && Array.isArray(cause.metaMessages)) {
			metaMessages.push(...cause.metaMessages, ' ')
		}

		// Add contract call info
		/** @type {string[]} */
		const callInfo = []
		if (contractAddress) callInfo.push(`  Address: ${contractAddress}`)
		if (functionName) callInfo.push(`  Function: ${functionName}`)
		if (args && args.length > 0) callInfo.push(`  Args: ${JSON.stringify(args)}`)
		if (sender) callInfo.push(`  Sender: ${sender}`)

		if (callInfo.length > 0) {
			metaMessages.push('Contract Call:', ...callInfo)
		}

		/** @type {import('./ethereum/BaseError.js').BaseErrorParameters} */
		const params = {
			cause,
		}
		if (metaMessages.length > 0) {
			params.metaMessages = metaMessages
		}
		if (docsPath) {
			params.docsPath = docsPath
		}

		super(shortMessage, params, 'ContractFunctionExecutionError')

		this.abi = abi
		this.args = args
		this.cause = cause
		this.contractAddress = contractAddress
		this.functionName = functionName
		this.sender = sender
	}
}

/**
 * Helper function to get the selector for an ABI error item.
 * @param {{type: string, name?: string, inputs?: ReadonlyArray<{type: string, name?: string}>}} errorItem - The ABI error item
 * @returns {`0x${string}`} The 4-byte selector
 */
function getSelector(errorItem) {
	// Build the signature string (used for documentation purposes)
	// Note: We don't use keccak256 here since we don't want to add that dependency
	// Custom error matching would require keccak256, so we return a placeholder
	// that won't match - the error will fall back to showing the raw signature
	void errorItem.inputs
	void errorItem.name
	return /** @type {`0x${string}`} */ ('0x00000000')
}
