import { isHex } from '@tevm/utils'

/**
 * Returns a 0x-prefixed hex number string from a hex string or string integer.
 * @param {string} [input] string to check, convert, and return
 * @returns {import('@tevm/utils').Hex | undefined} 0x-prefixed hex string or undefined
 */
export const strNumberToHex = (input) => {
	if (input === undefined) return undefined
	if (!isHex(input)) {
		const regex = new RegExp(/^\d+$/) // test to make sure input contains only digits
		if (!regex.test(input)) {
			const msg = `Cannot convert string to hex string. numberToHex only supports 0x-prefixed hex or integer strings but the given string was: ${input}`
			throw new Error(msg)
		}
		return `0x${Number.parseInt(input, 10).toString(16)}`
	}
	return input
}
