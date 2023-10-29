/**
 * @module Bytes Schema
 * Types and validators for SBytes.
 */

/**
 * Regular expression for matching a hex string.
 */
const hexRegex = /^0x[0-9a-fA-F]*$/

/**
 * Type guard that returns true if a string is a valid hex string.
 * @param {string} value - The string to check.
 * @returns {boolean} - True if the string is a valid hex string.
 * @example
 * ```javascript
 * import { isBytes } from '@evmts/schemas';
 * const hex = '0x1234567890abcdef1234567890abcdef12345678';
 * const isHex = isBytes(hex);
 * ```
 */
export const isBytes = (value) => {
	return hexRegex.test(value)
}
