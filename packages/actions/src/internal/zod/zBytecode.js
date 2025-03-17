import { zHex } from './zHex.js'

/**
 * @param {string} bytecode
 * @returns {boolean}
 */
const isValidEthereumBytecode = (bytecode) => {
	// Make sure it's a string and starts with 0x
	if (typeof bytecode !== 'string' || !bytecode.startsWith('0x')) {
		return false
	}
	const rawBytecode = bytecode.slice(2)
	if (rawBytecode.length === 0 || rawBytecode.length % 2 !== 0) {
		return false
	}
	return true
}

/**
 * Zod validator for valid Ethereum bytecode
 */
export const zBytecode = zHex.refine(isValidEthereumBytecode, { message: 'InvalidLength' }).describe('Valid bytecode')
