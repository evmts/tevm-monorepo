import type { Address } from 'abitype'
import type { Hex } from 'viem'

/**
 * Tevm params to put an account into the vm state
 * @example
 * // all fields are optional except address
 * const accountParams: import('@tevm/api').AccountParams = {
 *   account: '0x...',
 *   nonce: 5n,
 *   balance: 9000000000000n,
 *   storageRoot: '0x....',
 *   deployedBytecode: '0x....'
 * }
 */
export type AccountParams = {
	/**
	 * Address of account
	 */
	address: Address
	/**
	 * Nonce to set account to
	 */
	nonce?: bigint
	/**
	 * Balance to set account to
	 */
	balance?: bigint
	/**
	 * Contract bytecode to set account to
	 */
	deployedBytecode?: Hex
	/**
	 * Storage root to set account to
	 */
	storageRoot?: Hex
}
