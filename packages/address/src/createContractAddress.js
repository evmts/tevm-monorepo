import { InvalidAddressError } from '@tevm/errors'
import { EthjsAddress, keccak256, toRlp } from '@tevm/utils'
import { numberToBytes } from 'viem'
import { Address } from './Address.js'
import { createAddress } from './createAddress.js'

/**
 * Generates an {@link Address} for a newly created contract.
 * @param {EthjsAddress} from - The address of the account creating the contract.
 * @param {bigint} nonce - The nonce of the account creating the contract.
 * @returns {Address} The generated contract address.
 * @throws {InvalidAddressError} If the 'from' parameter is not a valid EthjsAddress.
 * @see {@link https://ethereum.org/en/developers/docs/smart-contracts/deploying/#contract-creation-code|Ethereum Contract Creation}
 */
export const createContractAddress = (from, nonce) => {
	if (!(from.bytes instanceof Uint8Array)) {
		throw new InvalidAddressError('Expected from to be an Address or ethereumjs Address')
	}
	if (nonce === 0n) {
		return createAddress(keccak256(toRlp([from.bytes, Uint8Array.from([])]), 'bytes').subarray(-20))
	}
	return createAddress(keccak256(toRlp([from.bytes, numberToBytes(nonce)]), 'bytes').subarray(-20))
}
