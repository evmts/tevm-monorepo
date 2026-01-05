/**
 * Left pads a `Uint8Array` with zeros to a specified length.
 * If the input is longer than the target length, it is returned unchanged.
 *
 * @param {Uint8Array} bytes - The input bytes to pad
 * @param {number} length - The target length
 * @returns {Uint8Array} The padded bytes
 *
 * @example
 * ```javascript
 * import { setLengthLeft } from '@tevm/utils'
 *
 * const bytes = new Uint8Array([1, 2, 3])
 * const padded = setLengthLeft(bytes, 5)
 * // padded is Uint8Array [0, 0, 1, 2, 3]
 * ```
 */
export const setLengthLeft = (bytes, length) => {
	if (bytes.length >= length) {
		return bytes
	}
	const result = new Uint8Array(length)
	result.set(bytes, length - bytes.length)
	return result
}
