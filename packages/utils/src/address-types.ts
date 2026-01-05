/**
 * Native Address type definitions (migrated from abitype/viem)
 *
 * This provides a simple unbranded Address type that is compatible with viem's API.
 * For branded address types, see @tevm/voltaire's AddressType.
 * @module
 */

/**
 * An Ethereum address - a 20-byte hex string prefixed with '0x'.
 * This is the basic address type used throughout Tevm, matching abitype's definition.
 *
 * @example
 * ```typescript
 * import type { Address } from '@tevm/utils'
 *
 * const myAddress: Address = '0x1234567890abcdef1234567890abcdef12345678'
 * const zeroAddress: Address = '0x0000000000000000000000000000000000000000'
 * ```
 */
export type Address = `0x${string}`
