import { TypeOutput, toType } from './typeOutput.js'
import { bytesToHex, hexToBytes, toBytes } from './viem.js'

/**
 * Flexible input data type for BigInt-like values
 * @typedef {string | number | bigint | Uint8Array} BigIntLike
 */

/**
 * Flexible input data type for EIP-4895 withdrawal data with amount in Gwei to
 * match CL representation and for eventual ssz withdrawalsRoot
 * @typedef {{
 *   index: BigIntLike
 *   validatorIndex: BigIntLike
 *   address: string | Uint8Array
 *   amount: BigIntLike
 * }} WithdrawalData
 */

/**
 * @typedef {[Uint8Array, Uint8Array, Uint8Array, Uint8Array]} WithdrawalBytes
 */

/**
 * @typedef {{
 *   index: `0x${string}`
 *   validatorIndex: `0x${string}`
 *   address: `0x${string}`
 *   amount: `0x${string}`
 * }} JsonRpcWithdrawal
 */

/**
 * Converts a bigint to its minimal Uint8Array representation.
 * Returns empty Uint8Array for 0n.
 * @param {bigint} value
 * @returns {Uint8Array}
 */
function bigintToMinimalBytes(value) {
	if (value === 0n) {
		return new Uint8Array()
	}
	// Get the hex representation without 0x prefix
	let hex = value.toString(16)
	// Ensure even length
	if (hex.length % 2 !== 0) {
		hex = '0' + hex
	}
	return hexToBytes(/** @type {`0x${string}`} */ (`0x${hex}`))
}

/**
 * Converts a bigint to a prefixed hex string.
 * Returns '0x0' for 0n.
 * @param {bigint} value
 * @returns {`0x${string}`}
 */
function bigIntToHex(value) {
	return /** @type {`0x${string}`} */ (`0x${value.toString(16)}`)
}

/**
 * Representation of EIP-4895 withdrawal data.
 * Amount is in Gwei to match CL representation and for eventual ssz withdrawalsRoot.
 *
 * @example
 * ```javascript
 * import { Withdrawal, createWithdrawal } from '@tevm/utils'
 *
 * // Create a withdrawal using the factory function
 * const withdrawal = createWithdrawal({
 *   index: 0n,
 *   validatorIndex: 65535n,
 *   address: '0x0000000000000000000000000000000000000001',
 *   amount: 1000000000n, // 1 ETH in Gwei
 * })
 *
 * // Access properties
 * console.log(withdrawal.index) // 0n
 * console.log(withdrawal.validatorIndex) // 65535n
 * console.log(withdrawal.address) // Uint8Array of the address
 * console.log(withdrawal.amount) // 1000000000n
 *
 * // Convert to JSON for RPC
 * console.log(withdrawal.toJSON())
 * // { index: '0x0', validatorIndex: '0xffff', address: '0x0000000000000000000000000000000000000001', amount: '0x3b9aca00' }
 *
 * // Get raw bytes for RLP encoding
 * console.log(withdrawal.raw())
 * // [Uint8Array, Uint8Array, Uint8Array, Uint8Array]
 * ```
 */
export class Withdrawal {
	/** @type {bigint} */
	index
	/** @type {bigint} */
	validatorIndex
	/** @type {Uint8Array} */
	address
	/** @type {bigint} */
	amount

	/**
	 * This constructor assigns and validates the values.
	 * Use the static factory methods to assist in creating a Withdrawal object from varying data types.
	 * Its amount is in Gwei to match CL representation and for eventual ssz withdrawalsRoot
	 *
	 * @param {bigint} index - The withdrawal index
	 * @param {bigint} validatorIndex - The validator index
	 * @param {Uint8Array} address - The recipient address as bytes (20 bytes)
	 * @param {bigint} amount - The withdrawal amount in Gwei
	 */
	constructor(index, validatorIndex, address, amount) {
		this.index = index
		this.validatorIndex = validatorIndex
		this.address = address
		this.amount = amount
	}

	/**
	 * Convert the withdrawal to a byte array for RLP encoding
	 * @returns {WithdrawalBytes}
	 */
	raw() {
		const indexBytes = bigintToMinimalBytes(this.index)
		const validatorIndexBytes = bigintToMinimalBytes(this.validatorIndex)
		const addressBytes = this.address
		const amountBytes = bigintToMinimalBytes(this.amount)
		return [indexBytes, validatorIndexBytes, addressBytes, amountBytes]
	}

	/**
	 * Convert the withdrawal to a value object
	 * @returns {{ index: bigint, validatorIndex: bigint, address: Uint8Array, amount: bigint }}
	 */
	toValue() {
		return {
			index: this.index,
			validatorIndex: this.validatorIndex,
			address: this.address,
			amount: this.amount,
		}
	}

	/**
	 * Convert the withdrawal to JSON-RPC format
	 * @returns {JsonRpcWithdrawal}
	 */
	toJSON() {
		return {
			index: bigIntToHex(this.index),
			validatorIndex: bigIntToHex(this.validatorIndex),
			address: bytesToHex(this.address),
			amount: bigIntToHex(this.amount),
		}
	}
}

/**
 * Creates a validator withdrawal request to be submitted to the consensus layer.
 *
 * @example
 * ```javascript
 * import { createWithdrawal } from '@tevm/utils'
 *
 * // Create from hex strings
 * const withdrawal1 = createWithdrawal({
 *   index: '0x1',
 *   validatorIndex: '0xffff',
 *   address: '0x0000000000000000000000000000000000000001',
 *   amount: '0x3b9aca00',
 * })
 *
 * // Create from bigints
 * const withdrawal2 = createWithdrawal({
 *   index: 1n,
 *   validatorIndex: 65535n,
 *   address: '0x0000000000000000000000000000000000000001',
 *   amount: 1000000000n,
 * })
 *
 * // Create from numbers
 * const withdrawal3 = createWithdrawal({
 *   index: 1,
 *   validatorIndex: 65535,
 *   address: '0x0000000000000000000000000000000000000001',
 *   amount: 1000000000,
 * })
 * ```
 *
 * @param {WithdrawalData} withdrawalData - The withdrawal data with flexible input types
 * @returns {Withdrawal} A Withdrawal object
 */
export function createWithdrawal(withdrawalData) {
	const { index: indexData, validatorIndex: validatorIndexData, address: addressData, amount: amountData } = withdrawalData
	const index = toType(indexData, TypeOutput.BigInt)
	const validatorIndex = toType(validatorIndexData, TypeOutput.BigInt)

	/** @type {Uint8Array} */
	let address
	if (addressData instanceof Uint8Array) {
		address = addressData
	} else if (typeof addressData === 'string') {
		// Handle hex address strings
		address = toBytes(addressData)
	} else {
		throw new Error(`Invalid address type: ${typeof addressData}`)
	}

	const amount = toType(amountData, TypeOutput.BigInt)
	return new Withdrawal(index, validatorIndex, address, amount)
}

/**
 * Creates a validator withdrawal request from an RLP decoded byte array
 *
 * @example
 * ```javascript
 * import { createWithdrawalFromBytesArray } from '@tevm/utils'
 *
 * // Decode from RLP array
 * const bytes = [
 *   new Uint8Array([0x01]),           // index
 *   new Uint8Array([0xff, 0xff]),     // validatorIndex
 *   new Uint8Array(20),               // address (20 bytes)
 *   new Uint8Array([0x3b, 0x9a, 0xca, 0x00]), // amount
 * ]
 * const withdrawal = createWithdrawalFromBytesArray(bytes)
 * ```
 *
 * @param {WithdrawalBytes} withdrawalArray - RLP decoded array of withdrawal data
 * @returns {Withdrawal} A Withdrawal object
 * @throws {Error} If the array length is not 4
 */
export function createWithdrawalFromBytesArray(withdrawalArray) {
	if (withdrawalArray.length !== 4) {
		throw new Error(`Invalid withdrawalArray length expected=4 actual=${withdrawalArray.length}`)
	}
	const [index, validatorIndex, address, amount] = withdrawalArray
	return createWithdrawal({ index, validatorIndex, address, amount })
}
