import type { CallError } from '@tevm/errors'
import type { Address, Hex, Log } from '../common/index.js'
import type { DebugTraceCallResult } from './DebugResult.js'

/**
 * Result of a Tevm VM Call method
 */
export type CallResult<ErrorType = CallError> = {
	/**
	 * The call trace if tracing is enabled on call
	 */
	trace?: DebugTraceCallResult
	/**
	 * The access list if enabled on call
	 * Mapping of addresses to storage slots
	 */
	accessList?: Record<Address, Set<Hex>>
	/**
	 * The returned tx hash if the call was included in the chain
	 * Will not be defined if the call was not included in the chain
	 * Whether a call is included in the chain depends on if the
	 * `createTransaction` option and the result of the call
	 */
	txHash?: Hex
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
