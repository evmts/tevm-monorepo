/**
 * Converts a Uint8Array to a UTF-8 string.
 *
 * @param {Uint8Array} bytes - The input bytes
 * @returns {string} The UTF-8 decoded string
 *
 * @example
 * ```javascript
 * import { bytesToUtf8 } from '@tevm/utils'
 *
 * const bytes = new Uint8Array([72, 101, 108, 108, 111])
 * const str = bytesToUtf8(bytes)
 * // str is 'Hello'
 * ```
 */
export const bytesToUtf8 = (bytes) => {
	return new TextDecoder('utf-8').decode(bytes)
}
