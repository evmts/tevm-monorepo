import { zHex } from './zHex.js'

/**
 * @param {import('viem').Hex} bytecode
 * @returns {boolean}
 */
const isValidEthereumBytecode = (bytecode) => {
	const rawBytecode = bytecode.slice(2)
	if (rawBytecode.length === 0 || rawBytecode.length % 2 !== 0) {
		return false
	}
	return true
}

/**
 * Zod validator for valid Ethereum bytecode
 */
export const zBytecode = zHex
	.refine(isValidEthereumBytecode, { message: 'InvalidLength' })
	.describe('Valid bytecode')
