import { InvalidAddressError, UnreachableCodeError } from '@tevm/errors'
import { EthjsAddress, hexToBytes } from '@tevm/utils'
import { numberToBytes } from 'viem'
import { Address } from './Address.js'

/**
 * Creates an {@link Address} for safely interacting with an Ethereum
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
 * @param {import("@tevm/utils").AddressLike | number | bigint | string} address
 * @returns {import('./Address.js').Address}
 * @throws {InvalidAddressError} if the input is not a valid address}
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
		throw new UnreachableCodeError(address, `Receieved an unexpected input for createAddress ${address}`)
	} catch (e) {
		if (e instanceof UnreachableCodeError) {
			throw new InvalidAddressError(
				'Recieved an invalid address input type for createAddress. Valid input types include hex string, unprefixed hex, bytes, number, bigint, or EthjsAddress',
				{ cause: e },
			)
		}
		if (e instanceof Error) {
			throw new InvalidAddressError(`Recieved an invalid address input ${e.message}`, { cause: e })
		}
		throw new InvalidAddressError(`Recieved an invalid address input ${address}`, { cause: /** @type {any} */ (e) })
	}
}
