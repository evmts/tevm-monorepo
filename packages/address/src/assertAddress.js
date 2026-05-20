import { InvalidAddressError } from '@tevm/errors'
import { EthjsAddress } from '@tevm/utils'

/**
 * @param {unknown} address
 * @returns {asserts address is EthjsAddress}
 */
export const assertAddress = (address) => {
	const bytes =
		address instanceof EthjsAddress || (typeof address === 'object' && address !== null)
			? /** @type {{ bytes?: unknown }} */ (address).bytes
			: undefined
	if (!(bytes instanceof Uint8Array)) {
		throw new InvalidAddressError('Expected from to be an Address or ethereumjs Address')
	}
	if (bytes.length !== 20) {
		throw new InvalidAddressError('Expected from to be a 20-byte address')
	}
}
