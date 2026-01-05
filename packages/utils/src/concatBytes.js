/**
 * Concatenate multiple Uint8Array values into a single Uint8Array.
 * This is a native implementation replacing the previous dependency on @ethereumjs/util.
 * The implementation is based on @tevm/voltaire's Bytes.concat.
 *
 * @param {...Uint8Array} arrays - The arrays to concatenate
 * @returns {Uint8Array} The concatenated array
 *
 * @example
 * ```javascript
 * import { concatBytes } from '@tevm/utils'
 *
 * const bytes1 = new Uint8Array([1, 2])
 * const bytes2 = new Uint8Array([3, 4])
 * const result = concatBytes(bytes1, bytes2)
 * // => Uint8Array([1, 2, 3, 4])
 * ```
 */
export const concatBytes = (...arrays) => {
	const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0)
	const result = new Uint8Array(totalLength)
	let offset = 0
	for (const arr of arrays) {
		result.set(arr, offset)
		offset += arr.length
	}
	return result
}
