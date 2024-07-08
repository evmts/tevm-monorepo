import { InvalidAddressError } from '@tevm/errors'
import { EthjsAddress, keccak256, toRlp } from '@tevm/utils'
import { numberToBytes } from 'viem'
import { Address } from './Address.js'
import { createAddress } from './createAddress.js'

/**
 * @typedef {import('@tevm/errors').InvalidAddressError} CreateContractAddressError
 */

/**
 * Generates an {@link Address} for a newly generated contract
 * address.
 * @param {EthjsAddress} from
 * @param {bigint} nonce
 * @returns {import('./Address.js').Address}
 * @throws {CreateContractAddressError}
 */
export const createContractAddress = (from, nonce) => {
	if (from.bytes instanceof Uint8Array === false) {
		throw new InvalidAddressError('Expected from to be an Adress or ethereumjs Address')
	}
	if (nonce === 0n) {
		return createAddress(keccak256(toRlp([from.bytes, Uint8Array.from([])]), 'bytes').subarray(-20))
	}
	return createAddress(keccak256(toRlp([from.bytes, numberToBytes(nonce)]), 'bytes').subarray(-20))
}
