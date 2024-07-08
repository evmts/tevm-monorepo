import { InvalidSaltError } from '@tevm/errors'
import { EthjsAddress, concatBytes, hexToBytes, keccak256 } from '@tevm/utils'
import { Address } from './Address.js'
import { createAddress } from './createAddress.js'

/**
 * @typedef {InvalidSaltError | import('@tevm/errors').InvalidAddressError} Create2ContractAddressError
 */

/**
 * Generates an {@link Address} for a contract created using CREATE2.
 * @param {EthjsAddress} from The address which is creating this new address
 * @param {import('@tevm/utils').Hex} salt A 32-byte salt value as a hex string
 * @param {import('@tevm/utils').Hex} code THe creation code of the contract
 * @returns {import('./Address.js').Address}
 * @throws {Create2ContractAddressError} if salt is not 32 bytes or input is wrong in some other way
 */
export const create2ContractAddress = (from, salt, code) => {
	const saltBytes = hexToBytes(salt)
	if (saltBytes.length !== 32) {
		throw new InvalidSaltError('Expected salt to be of length 32 bytes')
	}
	return createAddress(
		keccak256(concatBytes(hexToBytes('0xff'), from.bytes, saltBytes, keccak256(code, 'bytes')), 'bytes').subarray(-20),
	)
}
