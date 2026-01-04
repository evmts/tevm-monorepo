/**
 * Converts a Uint8Array to a hex string without the '0x' prefix.
 *
 * @param {Uint8Array} bytes - The input bytes
 * @returns {string} The hex string without 0x prefix
 *
 * @example
 * ```javascript
 * import { bytesToUnprefixedHex } from '@tevm/utils'
 *
 * const bytes = new Uint8Array([0xde, 0xad, 0xbe, 0xef])
 * const hex = bytesToUnprefixedHex(bytes)
 * // hex is 'deadbeef'
 * ```
 */
export const bytesToUnprefixedHex = (bytes) => {
	let hex = ''
	for (let i = 0; i < bytes.length; i++) {
		const byte = /** @type {number} */ (bytes[i])
		hex += (byte < 16 ? '0' : '') + byte.toString(16)
	}
	return hex
}
