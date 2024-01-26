import type { Address, Hex, Log } from '../common/index.js'
import type { CallError } from '@tevm/errors'

/**
 * Result of a Tevm VM Call method
 */
export type CallResult<ErrorType = CallError> = {
	/**
	 * Amount of gas left
	 */
	gas?: bigint
	/**
	 * Amount of gas the code used to run
	 */
	executionGasUsed: bigint
	/**
	 * Array of logs that the contract emitted
	 */
	logs?: Log[]
	/**
	 * The gas refund counter as a uint256
	 */
	gasRefund?: bigint
	/**
	 * Amount of blob gas consumed by the transaction
	 */
	blobGasUsed?: bigint
	/**
	 * Address of created account during transaction, if any
	 */
	createdAddress?: Address
	/**
	 * A set of accounts to selfdestruct
	 */
	selfdestruct?: Set<Address>
	/**
	 * Map of addresses which were created (used in EIP 6780)
	 */
	createdAddresses?: Set<Address>
	/**
	 * Encoded return value from the contract as hex string
	 */
	rawData: Hex
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
}
