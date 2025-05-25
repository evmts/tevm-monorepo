import { Rlp } from '@tevm/rlp'
import { EthjsAccount, createAddressFromString as createAddress } from '@tevm/utils'

/**
 * Helper to create an address from a string
 * @param {string} addressString - The address string
 * @returns {import('@tevm/utils').EthjsAddress} The address
 */
export function createAddressFromString(addressString) {
	return createAddress(addressString)
}

/**
 * Creates an account from RLP serialized data
 * @param {Uint8Array} serialized - The RLP serialized account data
 * @returns {import('@tevm/utils').EthjsAccount} The account
 */
export function fromRlpSerializedAccount(serialized) {
	const decoded = Rlp.decode(serialized)
	if (!Array.isArray(decoded) || decoded.length !== 4) {
		throw new Error('Invalid RLP serialized account')
	}

	const [nonce, balance, storageRoot, codeHash] = decoded

	return new EthjsAccount(nonce, balance, storageRoot, codeHash)
}

/**
 * Creates an account from account data
 * @param {Object} accountData - The account data
 * @param {bigint} [accountData.nonce] - The nonce
 * @param {bigint} [accountData.balance] - The balance
 * @param {Uint8Array} [accountData.storageRoot] - The storage root
 * @param {Uint8Array} [accountData.codeHash] - The code hash
 * @returns {import('@tevm/utils').EthjsAccount} The account
 */
export function fromAccountData(accountData) {
	return new EthjsAccount(accountData.nonce, accountData.balance, accountData.storageRoot, accountData.codeHash)
}
