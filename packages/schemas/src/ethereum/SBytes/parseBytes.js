/**
 * @module Bytes Schema
 * Types and validators for SBytes.
 */

import { parseBytesSafe } from './parseBytesSafe.js'
import { runSync } from 'effect/Effect'

/**
 * Parses a Bytes and returns the value if no errors.
 * @template {import("./SBytes.js").Bytes} TBytes
 * @param {TBytes} hex
 * @returns {TBytes}
 * @example
 * ```javascript
 * import { parseBytes } from '@evmts/schemas';
 * const parsedBytes = parseBytes('0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseBytes = (hex) => {
	return runSync(parseBytesSafe(hex))
}
