import type { GetAccountError } from '@tevm/errors'
import type { Address } from 'abitype'
import type { Hex } from 'viem'

/**
 * Result of GetAccount Action
 */
export type GetAccountResult<ErrorType = GetAccountError> = {
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
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
