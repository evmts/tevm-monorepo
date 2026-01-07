// @ts-nocheck - Using @ts-nocheck because voltaire types are not available yet
/**
 * @module account-class
 * Native Account class implementation for tevm, replacing @ethereumjs/util Account.
 * Provides an Ethereum account handling class compatible with the ethereumjs API.
 */

import { equalsBytes } from './equalsBytes.js'
import * as Rlp from '@tevm/voltaire/Rlp'
import { KECCAK256_RLP_BYTES, KECCAK256_NULL_BYTES, BIGINT_0, BIGINT_1 } from './constants.js'

/**
 * Convert bigint to bytes with minimal encoding (no leading zeros except for 0n).
 * @param {bigint} value - The bigint to convert
 * @returns {Uint8Array} The bytes
 */
function bigIntToBytes(value) {
	if (value === 0n) return new Uint8Array(0)
	let hex = value.toString(16)
	if (hex.length % 2) hex = '0' + hex
	const bytes = new Uint8Array(hex.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
	}
	return bytes
}

/**
 * @typedef {Object} AccountData
 * @property {bigint} [nonce] - The account nonce (default: 0n)
 * @property {bigint} [balance] - The account balance in wei (default: 0n)
 * @property {Uint8Array} [storageRoot] - The storage root (default: KECCAK256_RLP for empty)
 * @property {Uint8Array} [codeHash] - The code hash (default: KECCAK256_NULL for no code)
 * @property {number} [codeSize] - The code size (optional)
 * @property {number} [version] - The account version (default: 0)
 */

/**
 * Represents an Ethereum account with nonce, balance, storageRoot, and codeHash.
 *
 * This class provides a native implementation compatible with the @ethereumjs/util Account class.
 *
 * @example
 * ```javascript
 * import { Account, createAccount } from '@tevm/utils'
 *
 * // Create a default (empty) account
 * const emptyAccount = new Account()
 * console.log(emptyAccount.nonce) // 0n
 * console.log(emptyAccount.balance) // 0n
 * console.log(emptyAccount.isEmpty()) // true
 *
 * // Create account with values
 * const account = createAccount({ nonce: 1n, balance: 1000000000000000000n })
 * console.log(account.nonce) // 1n
 * console.log(account.balance) // 1000000000000000000n
 * console.log(account.isEmpty()) // false
 *
 * // Serialize for RLP encoding
 * const serialized = account.serialize()
 * ```
 */
export class Account {
	/**
	 * Account version (defaults to 0).
	 * @type {number}
	 * @private
	 */
	_version = 0

	/**
	 * Account nonce.
	 * @type {bigint}
	 * @private
	 */
	_nonce = BIGINT_0

	/**
	 * Account balance in wei.
	 * @type {bigint}
	 * @private
	 */
	_balance = BIGINT_0

	/**
	 * Storage trie root hash.
	 * @type {Uint8Array}
	 * @private
	 */
	_storageRoot = KECCAK256_RLP_BYTES

	/**
	 * Code hash (keccak256 of the deployed code).
	 * @type {Uint8Array}
	 * @private
	 */
	_codeHash = KECCAK256_NULL_BYTES

	/**
	 * Size of the code in bytes.
	 * @type {number | undefined}
	 * @private
	 */
	_codeSize = undefined

	/**
	 * Creates an Account object.
	 * @param {bigint} [nonce] - Account nonce (default: 0n)
	 * @param {bigint} [balance] - Account balance in wei (default: 0n)
	 * @param {Uint8Array} [storageRoot] - Storage root (default: KECCAK256_RLP)
	 * @param {Uint8Array} [codeHash] - Code hash (default: KECCAK256_NULL)
	 * @param {number} [codeSize] - Code size (optional)
	 * @param {number} [version] - Account version (default: 0)
	 */
	constructor(nonce, balance, storageRoot, codeHash, codeSize, version) {
		this._nonce = nonce ?? BIGINT_0
		this._balance = balance ?? BIGINT_0
		this._storageRoot = storageRoot ?? new Uint8Array(KECCAK256_RLP_BYTES)
		this._codeHash = codeHash ?? new Uint8Array(KECCAK256_NULL_BYTES)
		this._codeSize = codeSize
		this._version = version ?? 0
		this._validate()
	}

	/**
	 * Get the account version.
	 * @returns {number} The account version
	 */
	get version() {
		return this._version
	}

	/**
	 * Get the account nonce.
	 * @returns {bigint} The account nonce
	 */
	get nonce() {
		return this._nonce
	}

	/**
	 * Set the account nonce.
	 * @param {bigint} value - The new nonce value
	 */
	set nonce(value) {
		this._nonce = value
	}

	/**
	 * Get the account balance.
	 * @returns {bigint} The account balance in wei
	 */
	get balance() {
		return this._balance
	}

	/**
	 * Set the account balance.
	 * @param {bigint} value - The new balance value
	 */
	set balance(value) {
		this._balance = value
	}

	/**
	 * Get the storage root.
	 * @returns {Uint8Array} The storage root hash
	 */
	get storageRoot() {
		return this._storageRoot
	}

	/**
	 * Get the code hash.
	 * @returns {Uint8Array} The code hash
	 */
	get codeHash() {
		return this._codeHash
	}

	/**
	 * Get the code size.
	 * @returns {number | undefined} The code size in bytes
	 */
	get codeSize() {
		return this._codeSize
	}

	/**
	 * Validates the account data.
	 * @private
	 * @throws {Error} If nonce or balance is invalid
	 */
	_validate() {
		if (this._nonce < BIGINT_0) {
			throw new Error('nonce must be >= 0')
		}
		if (this._balance < BIGINT_0) {
			throw new Error('balance must be >= 0')
		}
	}

	/**
	 * Returns the RLP serialization of the account as an array of Uint8Arrays.
	 * Format: [nonce, balance, storageRoot, codeHash]
	 * @returns {Uint8Array[]} Array of raw values
	 */
	raw() {
		return [
			bigIntToBytes(this._nonce),
			bigIntToBytes(this._balance),
			this._storageRoot,
			this._codeHash
		]
	}

	/**
	 * Returns the RLP serialization of the account.
	 * @returns {Uint8Array} The RLP encoded account
	 */
	serialize() {
		const raw = this.raw()
		return Rlp.encode(raw)
	}

	/**
	 * Returns serialization with partial account info for Verkle.
	 * @returns {Uint8Array} The RLP encoded partial account
	 */
	serializeWithPartialInfo() {
		const raw = [
			bigIntToBytes(BigInt(this._version)),
			bigIntToBytes(this._nonce),
			bigIntToBytes(this._balance),
			this._codeHash,
			bigIntToBytes(BigInt(this._codeSize !== undefined ? this._codeSize : 0))
		]
		return Rlp.encode(raw)
	}

	/**
	 * Returns a `Boolean` determining if the account is a contract.
	 * @returns {boolean} True if account has code (is a contract)
	 */
	isContract() {
		return !equalsBytes(this._codeHash, KECCAK256_NULL_BYTES)
	}

	/**
	 * Returns a `Boolean` determining if the account is empty (nonce and balance are 0).
	 * Note: An account can have code but still be "empty" if nonce and balance are 0.
	 * @returns {boolean} True if nonce and balance are 0
	 */
	isEmpty() {
		return this._nonce === BIGINT_0 && this._balance === BIGINT_0
	}
}

/**
 * Creates an Account object from the given data.
 *
 * @param {AccountData} [accountData] - Optional data to initialize the account
 * @returns {Account} The created Account object
 * @example
 * ```javascript
 * import { createAccount } from '@tevm/utils'
 *
 * // Create empty account
 * const empty = createAccount()
 *
 * // Create account with nonce and balance
 * const account = createAccount({ nonce: 5n, balance: 1000000000000000000n })
 * console.log(account.nonce) // 5n
 * console.log(account.balance) // 1000000000000000000n
 * ```
 */
export function createAccount(accountData) {
	return new Account(
		accountData?.nonce,
		accountData?.balance,
		accountData?.storageRoot,
		accountData?.codeHash,
		accountData?.codeSize,
		accountData?.version
	)
}
