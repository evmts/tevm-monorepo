import type { Address, Hex } from '../common/index.js'
import type { GetAccountError } from '@tevm/errors'

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
	/**
	 * Code hash to set account to
	 */
	codeHash?: Hex
	/**
	 * True if account is a contract
	 */
	isContract?: boolean
	/**
	 * True if account is empty
	 */
	isEmpty?: boolean
}
