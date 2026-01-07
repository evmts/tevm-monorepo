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

/**
 * Options for the isAddress function.
 * Compatible with viem's IsAddressOptions type.
 *
 * @example
 * ```typescript
 * import { isAddress, type IsAddressOptions } from '@tevm/utils'
 *
 * // Strict mode (default) - validates checksum
 * isAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', { strict: true })
 *
 * // Non-strict mode - only validates format
 * isAddress('0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed', { strict: false })
 * ```
 */
export type IsAddressOptions = {
	/**
	 * Enables strict mode. Whether or not to compare the address against its checksum.
	 * @default true
	 */
	strict?: boolean | undefined
}
