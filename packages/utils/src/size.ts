import type { Hex } from './abitype.js'
import { isHex } from './viem.js'

/**
 * Get the size (in bytes) of a hex value or byte array.
 *
 * @param value - The hex string or byte array to get the size of
 * @returns The size in bytes
 *
 * @example
 * ```ts
 * import { size } from '@tevm/utils'
 *
 * size('0x1234')
 * // => 2
 *
 * size(new Uint8Array([1, 2, 3]))
 * // => 3
 * ```
 */
export function size(value: Hex | Uint8Array): number {
	if (isHex(value, { strict: false })) {
		return Math.ceil((value.length - 2) / 2)
	}
	return value.length
}
