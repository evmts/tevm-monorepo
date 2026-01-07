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
 * Convert a Uint8Array to a bigint (big-endian).
 * Empty arrays return 0n.
 * @param {Uint8Array} bytes - The bytes to convert
 * @returns {bigint} The bigint value
 */
function bytesToBigInt(bytes) {
	if (bytes.length === 0) return 0n
	let hex = '0x'
	for (let i = 0; i < bytes.length; i++) {
		hex += /** @type {number} */ (bytes[i]).toString(16).padStart(2, '0')
	}
	return BigInt(hex)
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

	const [nonceBytes, balanceBytes, storageRoot, codeHash] = decoded

	// Convert nonce and balance from Uint8Array to bigint
	const nonce = nonceBytes instanceof Uint8Array ? bytesToBigInt(nonceBytes) : BigInt(/** @type {string | number | bigint | boolean} */ (/** @type {unknown} */ (nonceBytes)) ?? 0)
	const balance = balanceBytes instanceof Uint8Array ? bytesToBigInt(balanceBytes) : BigInt(/** @type {string | number | bigint | boolean} */ (/** @type {unknown} */ (balanceBytes)) ?? 0)

	/** @type {{nonce: bigint, balance: bigint, storageRoot: Uint8Array, codeHash: Uint8Array}} */
	const accountData = {
		nonce,
		balance,
		storageRoot: storageRoot instanceof Uint8Array ? storageRoot : new Uint8Array(0),
		codeHash: codeHash instanceof Uint8Array ? codeHash : new Uint8Array(0),
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
