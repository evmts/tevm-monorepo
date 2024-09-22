import { InvalidSaltError } from '@tevm/errors'
import { EthjsAddress, concatBytes, hexToBytes, keccak256 } from '@tevm/utils'
import { Address } from './Address.js'
import { createAddress } from './createAddress.js'

/**
 * @typedef {import('@tevm/errors').InvalidSaltError | import('@tevm/errors').InvalidAddressError} Create2ContractAddressError
 */

/**
 * Generates an {@link Address} for a contract created using CREATE2.
 * @param {EthjsAddress} from The address which is creating this new address
 * @param {import('@tevm/utils').Hex} salt A 32-byte salt value as a hex string
 * @param {import('@tevm/utils').Hex} code The creation code of the contract
 * @returns {Address} The generated contract address
 * @throws {Create2ContractAddressError} If salt is not 32 bytes or if inputs are invalid
 * @see {@link https://eips.ethereum.org/EIPS/eip-1014|EIP-1014} for more information on CREATE2
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
