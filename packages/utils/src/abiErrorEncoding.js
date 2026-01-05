// @ts-nocheck
/**
 * @fileoverview Native ABI error encoding/decoding functions using @tevm/voltaire
 * These functions replace viem's decodeErrorResult and encodeErrorResult
 * Note: @ts-nocheck used because voltaire types are not always available
 */

import { Error as AbiError } from '@tevm/voltaire/Abi'
import * as Hex from '@tevm/voltaire/Hex'

/**
 * Decodes error result data.
 * Native implementation using @tevm/voltaire that matches viem's decodeErrorResult API.
 *
 * @template {import('abitype').Abi} TAbi
 * @param {Object} options - Options object
 * @param {TAbi} options.abi - The contract ABI
 * @param {import('./hex-types.js').Hex} options.data - The encoded error data to decode (selector + encoded args)
 * @returns {{ errorName: string, args: readonly unknown[] }} The decoded error name and arguments
 * @example
 * ```javascript
 * import { decodeErrorResult } from '@tevm/utils'
 *
 * const { errorName, args } = decodeErrorResult({
 *   abi: [{
 *     type: 'error',
 *     name: 'InsufficientBalance',
 *     inputs: [
 *       { type: 'uint256', name: 'balance' },
 *       { type: 'uint256', name: 'required' }
 *     ]
 *   }],
 *   data: '0xcf479181000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000c8'
 * })
 * // errorName: 'InsufficientBalance'
 * // args: [100n, 200n]
 * ```
 */
export function decodeErrorResult({ abi, data }) {
	// Convert data to bytes
	const dataBytes = Hex.toBytes(data)

	if (dataBytes.length < 4) {
		throw new Error('Data too short for error selector')
	}

	// Extract selector (first 4 bytes)
	const selector = dataBytes.slice(0, 4)
	const selectorHex = Hex.fromBytes(selector)

	// Find matching error in ABI by selector
	const errors = /** @type {readonly any[]} */ (abi).filter(
		(/** @type {any} */ item) => item.type === 'error',
	)

	if (errors.length === 0) {
		throw new Error('No errors found in ABI')
	}

	let matchingError
	for (const error of errors) {
		const errorSelector = AbiError.Error.getSelector(error)
		const errorSelectorHex = Hex.fromBytes(errorSelector)

		if (selectorHex === errorSelectorHex) {
			matchingError = error
			break
		}
	}

	if (!matchingError) {
		throw new Error(`No matching error found for selector ${selectorHex}`)
	}

	// Decode the parameters using voltaire
	const decoded = AbiError.Error.decodeParams(matchingError, dataBytes)

	// Convert result to match viem's format (array of values)
	const args = /** @type {unknown[]} */ ([])
	for (const input of matchingError.inputs) {
		const value = decoded[matchingError.inputs.indexOf(input)]
		// Convert Uint8Array to hex for address and bytes types
		if (value instanceof Uint8Array) {
			if (input.type === 'address') {
				args.push(Hex.fromBytes(value.slice(-20)))
			} else if (input.type.startsWith('bytes')) {
				args.push(Hex.fromBytes(value))
			} else {
				args.push(value)
			}
		} else {
			args.push(value)
		}
	}

	return {
		errorName: matchingError.name,
		args,
	}
}

/**
 * Encodes error result data.
 * Native implementation using @tevm/voltaire that matches viem's encodeErrorResult API.
 *
 * @template {import('abitype').Abi} TAbi
 * @template {string} TErrorName
 * @param {Object} options - Options object
 * @param {TAbi} options.abi - The contract ABI
 * @param {TErrorName} options.errorName - The error name to encode
 * @param {readonly unknown[]} [options.args] - The error arguments to encode
 * @returns {import('./hex-types.js').Hex} The ABI-encoded error data (selector + encoded args)
 * @example
 * ```javascript
 * import { encodeErrorResult } from '@tevm/utils'
 *
 * const data = encodeErrorResult({
 *   abi: [{
 *     type: 'error',
 *     name: 'InsufficientBalance',
 *     inputs: [
 *       { type: 'uint256', name: 'balance' },
 *       { type: 'uint256', name: 'required' }
 *     ]
 *   }],
 *   errorName: 'InsufficientBalance',
 *   args: [100n, 200n]
 * })
 * ```
 */
export function encodeErrorResult({ abi, errorName, args }) {
	// Find the error in the ABI
	const error = /** @type {readonly any[]} */ (abi).find(
		(/** @type {any} */ item) => item.type === 'error' && item.name === errorName,
	)

	if (!error) {
		throw new Error(`Error "${errorName}" not found in ABI`)
	}

	// Encode using voltaire
	const encoded = AbiError.Error.encodeParams(error, args ?? [])

	return /** @type {import('./hex-types.js').Hex} */ (Hex.fromBytes(encoded))
}
