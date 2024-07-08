import { EthjsAddress, getAddress, bytesToHex, type Address as AddressType } from '@tevm/utils'

/**
 * Utility class for ethereum addresses.
 * Wraps {@link EthjsAddress} with a tevm style API.
 * toString returns a checksummed address rather than lowercase
 * @example
 * ```typescript
 * import { createAddress } from '@tevm/address'`
 *
 * // takes hex string
 * let address = createAddress(`0x${'00'.repeat(20)}`)
 * // takes number and bigint
 * address = createAddress(0)
 * // takes bytes
 * address = createAddress(new Uint8Array()))
 * // non hex string
 * address = createAddress('55'.repeat(20))
 * ```
 */
export class Address extends EthjsAddress {
	override toString(): AddressType {
		return getAddress(bytesToHex(this.bytes))
	}
}
