import { InvalidAddressError, UnreachableCodeError } from '@tevm/errors'
import { EthjsAddress, hexToBytes, numberToBytes } from '@tevm/utils'
import { Address } from './Address.js'

/**
 * Creates an {@link Address} instance from various input formats for safely
 * interacting with Ethereum addresses.
 *
 * This factory function provides a flexible and robust way to create Address
 * objects, handling multiple input formats:
 *
 * - Hex strings (with or without 0x prefix)
 * - Numbers or BigInts (converted to bytes)
 * - Uint8Array (raw bytes)
 * - Existing EthjsAddress or Address instances
 *
 * The created Address objects provide convenience methods and proper EIP-55
 * checksumming for improved safety when working with Ethereum addresses.
 *
 * This is the recommended way to create Address instances throughout TEVM.
 *
 * @param {import("@tevm/utils").AddressLike | number | bigint | string} address - The input to create an address from
 * @returns {Address} An Address instance representing the input
 * @throws {InvalidAddressError} If the input is not a valid address or cannot be converted to one
 *
 * @example
 * ```javascript
 * import { createAddress } from '@tevm/address'
 *
 * // From checksummed or lowercase hex strings (with 0x prefix)
 * const addr1 = createAddress('0x8ba1f109551bD432803012645Ac136ddd64DBA72')
 * const addr2 = createAddress('0x8ba1f109551bd432803012645ac136ddd64dba72')
 *
 * // From unprefixed hex string
 * const addr3 = createAddress('8ba1f109551bd432803012645ac136ddd64dba72')
 *
 * // From zero address
 * const zeroAddr = createAddress(`0x${'00'.repeat(20)}`)
 * console.log(zeroAddr.toString()) // '0x0000000000000000000000000000000000000000'
 *
 * // From numbers (not recommended for real addresses due to potential overflow)
 * const numAddr = createAddress(1) // Convert 1 to address '0x0000000000000000000000000000000000000001'
 *
 * // From bigint (useful for sequential address generation)
 * const bigintAddr = createAddress(42n) // '0x000000000000000000000000000000000000002A'
 *
 * // From bytes
 * const bytesAddr = createAddress(new Uint8Array(20).fill(1))
 * // '0x0101010101010101010101010101010101010101'
 * ```
 *
 * @example
 * ```javascript
 * // Error handling example
 * import { createAddress } from '@tevm/address'
 * import { InvalidAddressError } from '@tevm/errors'
 *
 * try {
 *   // Invalid address (too short)
 *   const address = createAddress('0x123')
 * } catch (error) {
 *   if (error instanceof InvalidAddressError) {
 *     console.error('Invalid address format:', error.message)
 *   } else {
 *     throw error
 *   }
 * }
 * ```
 */
export const createAddress = (address) => {
	try {
		if (address instanceof EthjsAddress) {
			return new Address(address.bytes)
		}
		if (address instanceof Uint8Array) {
			return new Address(address)
		}
		if (typeof address === 'number' || typeof address === 'bigint') {
			return new Address(numberToBytes(address, { size: 20 }))
		}
		if (typeof address === 'string' && address.startsWith('0x')) {
			return new Address(hexToBytes(/** @type {import('viem').Hex}*/ (address), { size: 20 }))
		}
		if (typeof address === 'string') {
			return new Address(hexToBytes(`0x${address}`, { size: 20 }))
		}
		throw new UnreachableCodeError(address, `Received an unexpected input for createAddress ${address}`)
	} catch (e) {
		if (e instanceof UnreachableCodeError) {
			throw new InvalidAddressError(
				'Received an invalid address input type for createAddress. Valid input types include hex string, unprefixed hex, bytes, number, bigint, or EthjsAddress',
				{ cause: e },
			)
		}
		throw new InvalidAddressError(`Received an invalid address input: ${/** @type {Error} */ (e).message}`, {
			cause: /** @type {Error} */ (e),
		})
	}
}
