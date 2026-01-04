// @ts-check
/**
 * @fileoverview Native ABI function encoding/decoding functions using @tevm/voltaire
 * These functions replace viem's encodeFunctionData, decodeFunctionData, decodeFunctionResult, and encodeFunctionResult
 */

import { encodeFunction, decodeFunction, encodeParameters, decodeParameters } from '@tevm/voltaire/Abi'
import * as Hex from '@tevm/voltaire/Hex'

/**
 * Encodes function call data (selector + parameters).
 * Native implementation using @tevm/voltaire that matches viem's encodeFunctionData API.
 *
 * @template {import('./abitype.js').Abi} TAbi
 * @template {import('./contract-types.js').ContractFunctionName<TAbi>} TFunctionName
 * @param {Object} options - Options object
 * @param {TAbi} options.abi - The contract ABI
 * @param {TFunctionName} options.functionName - The function name to encode
 * @param {import('./contract-types.js').ContractFunctionArgs<TAbi, import('./abitype.js').AbiStateMutability, TFunctionName>} [options.args] - The function arguments
 * @returns {import('./hex-types.js').Hex} The encoded function data (selector + ABI-encoded parameters)
 * @example
 * ```javascript
 * import { encodeFunctionData } from '@tevm/utils'
 *
 * const data = encodeFunctionData({
 *   abi: [{
 *     type: 'function',
 *     name: 'transfer',
 *     inputs: [
 *       { type: 'address', name: 'to' },
 *       { type: 'uint256', name: 'amount' }
 *     ],
 *     outputs: [{ type: 'bool' }],
 *     stateMutability: 'nonpayable'
 *   }],
 *   functionName: 'transfer',
 *   args: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', 100n]
 * })
 * ```
 */
export function encodeFunctionData({ abi, functionName, args }) {
	const hex = encodeFunction(
		/** @type {any} */ (abi),
		functionName,
		/** @type {readonly unknown[]} */ (args ?? []),
	)
	return /** @type {import('./hex-types.js').Hex} */ (hex)
}

/**
 * Decodes function call data (identifies function and decodes parameters).
 * Native implementation using @tevm/voltaire that matches viem's decodeFunctionData API.
 *
 * @template {import('./abitype.js').Abi} TAbi
 * @param {Object} options - Options object
 * @param {TAbi} options.abi - The contract ABI
 * @param {import('./hex-types.js').Hex} options.data - The encoded function data to decode
 * @returns {{ functionName: string, args: readonly unknown[] }} The decoded function name and arguments
 * @example
 * ```javascript
 * import { decodeFunctionData } from '@tevm/utils'
 *
 * const { functionName, args } = decodeFunctionData({
 *   abi: [{
 *     type: 'function',
 *     name: 'transfer',
 *     inputs: [
 *       { type: 'address', name: 'to' },
 *       { type: 'uint256', name: 'amount' }
 *     ],
 *     outputs: [{ type: 'bool' }],
 *     stateMutability: 'nonpayable'
 *   }],
 *   data: '0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb00000000000000000000000000000000000000000000000000000000000000064'
 * })
 * // functionName: 'transfer'
 * // args: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', 100n]
 * ```
 */
export function decodeFunctionData({ abi, data }) {
	const result = decodeFunction(/** @type {any} */ (abi), data)
	return {
		functionName: result.name,
		args: result.params,
	}
}

/**
 * Decodes function return data.
 * Native implementation using @tevm/voltaire that matches viem's decodeFunctionResult API.
 *
 * @template {import('./abitype.js').Abi} TAbi
 * @template {import('./contract-types.js').ContractFunctionName<TAbi>} TFunctionName
 * @param {Object} options - Options object
 * @param {TAbi} options.abi - The contract ABI
 * @param {TFunctionName} options.functionName - The function name whose result to decode
 * @param {import('./hex-types.js').Hex} options.data - The encoded return data to decode
 * @returns {import('./contract-types.js').ContractFunctionReturnType<TAbi, import('./abitype.js').AbiStateMutability, TFunctionName>} The decoded return value(s)
 * @example
 * ```javascript
 * import { decodeFunctionResult } from '@tevm/utils'
 *
 * const result = decodeFunctionResult({
 *   abi: [{
 *     type: 'function',
 *     name: 'balanceOf',
 *     inputs: [{ type: 'address', name: 'account' }],
 *     outputs: [{ type: 'uint256' }],
 *     stateMutability: 'view'
 *   }],
 *   functionName: 'balanceOf',
 *   data: '0x0000000000000000000000000000000000000000000000000000000000000064'
 * })
 * // result: 100n
 * ```
 */
export function decodeFunctionResult({ abi, functionName, data }) {
	// Find the function in the ABI
	const fn = /** @type {readonly any[]} */ (abi).find(
		(/** @type {any} */ item) => item.type === 'function' && item.name === functionName,
	)

	if (!fn) {
		throw new Error(`Function "${functionName}" not found in ABI`)
	}

	const bytes = Hex.toBytes(data)
	const decoded = decodeParameters(fn.outputs, bytes)

	// If there's only one output, return it directly (viem behavior)
	if (fn.outputs.length === 1) {
		return /** @type {any} */ (decoded[0])
	}

	return /** @type {any} */ (decoded)
}

/**
 * Encodes function return data.
 * Native implementation using @tevm/voltaire that matches viem's encodeFunctionResult API.
 *
 * @template {import('./abitype.js').Abi} TAbi
 * @template {import('./contract-types.js').ContractFunctionName<TAbi>} TFunctionName
 * @param {Object} options - Options object
 * @param {TAbi} options.abi - The contract ABI
 * @param {TFunctionName} options.functionName - The function name whose result to encode
 * @param {import('./contract-types.js').ContractFunctionReturnType<TAbi, import('./abitype.js').AbiStateMutability, TFunctionName>} options.result - The value(s) to encode
 * @returns {import('./hex-types.js').Hex} The ABI-encoded return data
 * @example
 * ```javascript
 * import { encodeFunctionResult } from '@tevm/utils'
 *
 * const data = encodeFunctionResult({
 *   abi: [{
 *     type: 'function',
 *     name: 'balanceOf',
 *     inputs: [{ type: 'address', name: 'account' }],
 *     outputs: [{ type: 'uint256' }],
 *     stateMutability: 'view'
 *   }],
 *   functionName: 'balanceOf',
 *   result: 100n
 * })
 * ```
 */
export function encodeFunctionResult({ abi, functionName, result }) {
	// Find the function in the ABI
	const fn = /** @type {readonly any[]} */ (abi).find(
		(/** @type {any} */ item) => item.type === 'function' && item.name === functionName,
	)

	if (!fn) {
		throw new Error(`Function "${functionName}" not found in ABI`)
	}

	// Wrap single value in array (viem behavior)
	const values = fn.outputs.length === 1 ? [result] : result

	const encoded = encodeParameters(fn.outputs, /** @type {any} */ (values))
	return /** @type {import('./hex-types.js').Hex} */ (Hex.fromBytes(encoded))
}
