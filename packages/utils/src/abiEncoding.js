// @ts-check
/**
 * @fileoverview Native ABI encoding/decoding functions using @tevm/voltaire
 * These functions replace viem's encodeAbiParameters and decodeAbiParameters
 */

import { encodeParameters, decodeParameters } from '@tevm/voltaire/Abi'
import * as Hex from '@tevm/voltaire/Hex'

/**
 * Encodes ABI parameters.
 * Native implementation using @tevm/voltaire that matches viem's encodeAbiParameters API.
 *
 * @template {readonly import('abitype').AbiParameter[]} TParams
 * @param {TParams} params - Array of ABI parameter definitions
 * @param {import('abitype').AbiParametersToPrimitiveTypes<TParams>} values - Array of values to encode
 * @returns {import('viem').Hex} The ABI-encoded hex string
 * @example
 * ```javascript
 * import { encodeAbiParameters } from '@tevm/utils'
 *
 * // Encode a single string
 * const encoded = encodeAbiParameters(
 *   [{ type: 'string' }],
 *   ['Hello, World!']
 * )
 *
 * // Encode multiple parameters
 * const encoded = encodeAbiParameters(
 *   [
 *     { type: 'address', name: 'to' },
 *     { type: 'uint256', name: 'amount' }
 *   ],
 *   ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', 100n]
 * )
 * ```
 */
export function encodeAbiParameters(params, values) {
	const encoded = encodeParameters(
		/** @type {any} */ (params),
		/** @type {any} */ (values),
	)
	return /** @type {import('viem').Hex} */ (Hex.fromBytes(encoded))
}

/**
 * Decodes ABI-encoded parameters.
 * Native implementation using @tevm/voltaire that matches viem's decodeAbiParameters API.
 *
 * @template {readonly import('abitype').AbiParameter[]} TParams
 * @param {TParams} params - Array of ABI parameter definitions
 * @param {import('viem').Hex} data - The ABI-encoded hex string to decode
 * @returns {import('abitype').AbiParametersToPrimitiveTypes<TParams>} The decoded values
 * @example
 * ```javascript
 * import { decodeAbiParameters } from '@tevm/utils'
 *
 * // Decode a single string
 * const [greeting] = decodeAbiParameters(
 *   [{ type: 'string' }],
 *   '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20576f726c642100000000000000000000000000000000000000'
 * )
 *
 * // Decode multiple parameters
 * const [to, amount] = decodeAbiParameters(
 *   [
 *     { type: 'address', name: 'to' },
 *     { type: 'uint256', name: 'amount' }
 *   ],
 *   encoded
 * )
 * ```
 */
export function decodeAbiParameters(params, data) {
	const bytes = Hex.toBytes(data)
	return /** @type {import('abitype').AbiParametersToPrimitiveTypes<TParams>} */ (
		decodeParameters(/** @type {any} */ (params), bytes)
	)
}
