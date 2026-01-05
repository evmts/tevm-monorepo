/**
 * Native Hex type definitions (migrated from viem)
 *
 * This provides a simple unbranded Hex type that is compatible with viem's API.
 * For branded hex types, see @tevm/voltaire's HexType.
 * @module
 */

/**
 * A hex string prefixed with '0x'.
 * This is the basic hex type used throughout Tevm, matching viem's definition.
 *
 * @example
 * ```typescript
 * import type { Hex } from '@tevm/utils'
 *
 * const address: Hex = '0x1234567890abcdef1234567890abcdef12345678'
 * const data: Hex = '0xdeadbeef'
 * const emptyHex: Hex = '0x'
 * ```
 */
export type Hex = `0x${string}`
