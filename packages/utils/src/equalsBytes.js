/**
 * Check if two Uint8Array values are equal (same length and same bytes).
 * This is a native implementation replacing the previous dependency on @ethereumjs/util.
 * The implementation is based on @tevm/voltaire's Bytes.equals.
 *
 * @param {Uint8Array} a - First array to compare
 * @param {Uint8Array} b - Second array to compare
 * @returns {boolean} True if the arrays are equal, false otherwise
 *
 * @example
 * ```javascript
 * import { equalsBytes } from '@tevm/utils'
 *
 * const bytes1 = new Uint8Array([1, 2, 3])
 * const bytes2 = new Uint8Array([1, 2, 3])
 * const bytes3 = new Uint8Array([4, 5, 6])
 *
 * equalsBytes(bytes1, bytes2) // => true
 * equalsBytes(bytes1, bytes3) // => false
 * ```
 */
export const equalsBytes = (a, b) => {
	if (a.length !== b.length) return false
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false
	}
	return true
}
