import type { Address } from '@tevm/utils'
import type { Hex } from '@tevm/utils'
import type { BaseParams } from './BaseParams.js'

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
export type SetAccountParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
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
	/**
	 * key-value mapping to override all slots in the account storage before executing the calls
	 */
	state?: Record<Hex, Hex>
	/**
	 * key-value mapping to override individual slots in the account storage before executing the calls
	 */
	stateDiff?: Record<Hex, Hex>
}
