import type { IsAddressOptions } from '@tevm/utils'
import { toBeAddress } from './toBeAddress.js'
import { type IsHexOptions, toBeHex } from './toBeHex.js'
import { toEqualAddress } from './toEqualAddress.js'
import { type EqualHexOptions, toEqualHex } from './toEqualHex.js'

export { toBeAddress, toBeHex, toEqualAddress, toEqualHex }
export type { IsAddressOptions, IsHexOptions, EqualHexOptions }

export interface UtilsMatchers {
	/**
	 * Asserts that a value is a valid Ethereum address.
	 * By default, requires EIP-55 checksum validation.
	 *
	 * @param opts - Options for address validation
	 * @param opts.strict - If true (default), enforces EIP-55 checksum. If false, accepts any case.
	 *
	 * @example
	 * ```typescript
	 * // Validates checksummed address (default)
	 * expect('0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b').toBeAddress()
	 *
	 * // Accept any case
	 * expect('0x742d35cc5db4c8e9f8d4dc1ef70c4c7c8e5b7a6b').toBeAddress({ strict: false })
	 *
	 * // Works with .not
	 * expect('not-an-address').not.toBeAddress()
	 * ```
	 *
	 * @see {@link toEqualAddress} for case-insensitive address comparison
	 */
	toBeAddress(opts?: IsAddressOptions): void

	/**
	 * Asserts that a value is a valid hex string.
	 * Optionally validates the exact byte size.
	 *
	 * @param opts - Options for hex validation
	 * @param opts.strict - If true (default), validates hex characters. If false, only checks for 0x prefix.
	 * @param opts.size - Expected size in bytes (e.g., 32 for a transaction hash)
	 *
	 * @example
	 * ```typescript
	 * // Basic hex validation
	 * expect('0x1234abcd').toBeHex()
	 *
	 * // Validate transaction hash (32 bytes)
	 * expect(txHash).toBeHex({ size: 32 })
	 *
	 * // Validate function selector (4 bytes)
	 * expect('0xa9059cbb').toBeHex({ size: 4 })
	 * ```
	 *
	 * @see {@link toEqualHex} for hex string comparison
	 */
	toBeHex(opts?: IsHexOptions): void

	/**
	 * Asserts that two Ethereum addresses are equal (case-insensitive).
	 * Uses viem's isAddressEqual for comparison.
	 *
	 * @param expected - The expected address
	 *
	 * @example
	 * ```typescript
	 * // Same address, different cases
	 * expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC')
	 *   .toEqualAddress('0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac')
	 *
	 * // Works with .not
	 * expect(address1).not.toEqualAddress(address2)
	 * ```
	 *
	 * @see {@link toBeAddress} for address validation
	 */
	toEqualAddress(expected: unknown): void

	/**
	 * Asserts that two hex strings are equal.
	 * By default, normalizes hex strings by trimming leading zeros.
	 *
	 * @param expected - The expected hex string
	 * @param opts - Options for comparison
	 * @param opts.exact - If true, performs exact string comparison. If false (default), normalizes before comparing.
	 *
	 * @example
	 * ```typescript
	 * // Normalized comparison (default)
	 * expect('0x000123').toEqualHex('0x123')
	 * expect('0x0').toEqualHex('0x00')
	 *
	 * // Exact comparison
	 * expect('0x000123').toEqualHex('0x000123', { exact: true })
	 *
	 * // Case insensitive
	 * expect('0xabcd').toEqualHex('0xABCD')
	 *
	 * // Chain with .not
	 * expect('0x000123').not.toEqualHex('0x123')
	 * ```
	 *
	 * @see {@link toBeHex} for hex validation
	 */
	toEqualHex(expected: unknown, opts?: EqualHexOptions): void
}
