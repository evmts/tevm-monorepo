import { InvalidAddressError } from '../errors/address.js'
import { isAddress } from '../utils/address/isAddress.js'
/**
 * @description Creates an Account from a custom signing implementation.
 *
 * @returns A Local Account.
 */
export function toAccount(source) {
	if (typeof source === 'string') {
		if (!isAddress(source)) throw new InvalidAddressError({ address: source })
		return {
			address: source,
			type: 'json-rpc',
		}
	}
	if (!isAddress(source.address))
		throw new InvalidAddressError({ address: source.address })
	return {
		address: source.address,
		signMessage: source.signMessage,
		signTransaction: source.signTransaction,
		signTypedData: source.signTypedData,
		source: 'custom',
		type: 'local',
	}
}
//# sourceMappingURL=toAccount.js.map
