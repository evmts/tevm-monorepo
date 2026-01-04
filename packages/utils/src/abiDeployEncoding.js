// @ts-check
/**
 * @fileoverview Native deploy data encoding using @tevm/voltaire
 * This function replaces viem's encodeDeployData
 */

import { encodeParameters } from '@tevm/voltaire/Abi'
import * as Hex from '@tevm/voltaire/Hex'

/**
 * Encodes deploy data (bytecode + constructor parameters).
 * Native implementation using @tevm/voltaire that matches viem's encodeDeployData API.
 *
 * @template {import('viem').Abi} TAbi
 * @param {Object} options - Options object
 * @param {TAbi} options.abi - The contract ABI
 * @param {import('viem').Hex} options.bytecode - The contract bytecode
 * @param {readonly unknown[]} [options.args] - The constructor arguments
 * @returns {import('viem').Hex} The encoded deploy data (bytecode + ABI-encoded constructor args)
 * @example
 * ```javascript
 * import { encodeDeployData } from '@tevm/utils'
 *
 * // Encode deploy data without constructor args
 * const deployData = encodeDeployData({
 *   abi: [],
 *   bytecode: '0x6080604052...'
 * })
 *
 * // Encode deploy data with constructor args
 * const deployData = encodeDeployData({
 *   abi: [{
 *     type: 'constructor',
 *     inputs: [
 *       { type: 'string', name: 'name' },
 *       { type: 'uint256', name: 'value' }
 *     ],
 *     stateMutability: 'nonpayable'
 *   }],
 *   bytecode: '0x6080604052...',
 *   args: ['MyToken', 100n]
 * })
 * ```
 */
export function encodeDeployData({ abi, bytecode, args }) {
	// If no args, just return the bytecode
	if (!args || args.length === 0) {
		return bytecode
	}

	// Find the constructor in the ABI
	const constructor = /** @type {any[]} */ (abi).find(
		(/** @type {any} */ item) => item.type === 'constructor',
	)

	if (!constructor) {
		throw new Error(
			'No constructor found in ABI. Cannot encode constructor arguments.',
		)
	}

	// Encode the constructor parameters
	const encodedParams = encodeParameters(constructor.inputs, /** @type {any} */ (args))
	const encodedParamsHex = /** @type {string} */ (Hex.fromBytes(encodedParams))

	// Concatenate bytecode + encoded params (remove '0x' from params)
	return /** @type {import('viem').Hex} */ (bytecode + encodedParamsHex.slice(2))
}
