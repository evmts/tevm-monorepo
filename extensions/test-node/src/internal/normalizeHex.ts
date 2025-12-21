import type { Hex } from 'viem'

/**
 * Normalizes a hex string to lowercase for consistent cache key generation.
 * Handles null/undefined by returning '0x' as a default.
 *
 * @param hex - The hex string to normalize, or null/undefined
 * @returns The lowercase hex string, or '0x' if input is null/undefined
 *
 * @example
 * ```typescript
 * import { normalizeHex } from '@tevm/test-node'
 *
 * normalizeHex('0xABCDef') // '0xabcdef'
 * normalizeHex(null) // '0x'
 * normalizeHex(undefined) // '0x'
 * ```
 */
export const normalizeHex = (hex: Hex | null | undefined) => hex?.toLowerCase() ?? '0x'
