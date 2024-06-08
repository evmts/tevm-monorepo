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
	 * Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)
	 */
	preimages?: Record<Hex, Hex>
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
	 * Note the addresses are not actually created til the tx is mined
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
	/**
	 * Priority fee set by the transaction.
	 */
	priorityFee?: bigint
	/**
	 * The base fee of the transaction
	 */
	baseFee?: bigint
	/**
	 * The data fee charged for calldata on an Rollup transaction
	 * @see [OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)
	 */
	l1DataFee?: bigint
	/**
	 * The amount of gas used in this transaction, which is paid for
	 * This contains the gas units that have been used on execution, plus the upfront cost,
	 * which consists of calldata cost, intrinsic cost and optionally the access list costs
	 */
	totalGasSpent?: bigint
	/**
	 * The amount of ether used by this transaction
	 */
	amountSpent?: bigint
	/**
	 * The value that accrues to the miner by this transaction
	 */
	minerValue?: bigint
}
