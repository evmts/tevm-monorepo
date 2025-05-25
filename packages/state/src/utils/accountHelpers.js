import { Rlp } from '@tevm/rlp'
import { createAccount, createAddressFromString as createAddress } from '@tevm/utils'

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

	/** @type {{nonce: any, balance: any, storageRoot: any, codeHash: any}} */
	const accountData = {
		nonce,
		balance,
		storageRoot,
		codeHash,
	}

	return createAccount(accountData)
}

/**
 * Creates an account from account data
 * @param {{nonce?: bigint, balance?: bigint, storageRoot?: Uint8Array, codeHash?: Uint8Array}} accountData - The account data
 * @returns {import('@tevm/utils').EthjsAccount} The account
 */
export function fromAccountData(accountData) {
	return createAccount(accountData)
}
