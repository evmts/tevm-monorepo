import type { Address } from 'abitype'
import type { Hex } from 'viem'

/**
 * Tevm params to set an account in the vm state
 * all fields are optional except address
 * @example
 * const accountParams: import('tevm/api').SetAccountParams = {
 *   account: '0x...',
 *   nonce: 5n,
 *   balance: 9000000000000n,
 *   storageRoot: '0x....',
 *   deployedBytecode: '0x....'
 * }
 */
export type SetAccountParams = {
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
