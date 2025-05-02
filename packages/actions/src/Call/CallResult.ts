import type { Address, Hex, Log, TraceResult } from '../common/index.js'
import type { TevmCallError } from './TevmCallError.js'

/**
 * Result of a TEVM VM Call method.
 *
 * @example
 * ```typescript
 * import { createClient } from 'viem'
 * import { createTevmTransport, tevmCall } from 'tevm'
 * import { optimism } from 'tevm/common'
 * import { CallResult } from 'tevm/actions'
 *
 * const client = createClient({
 *   transport: createTevmTransport({}),
 *   chain: optimism,
 * })
 *
 * const callParams = {
 *   data: '0x...',
 *   bytecode: '0x...',
 *   gasLimit: 420n,
 * }
 *
 * const result: CallResult = await tevmCall(client, callParams)
 * console.log(result)
 * ```
 *
 * @see [tevmCall](https://tevm.sh/reference/tevm/memory-client/functions/tevmCall/)
 */
export type CallResult<ErrorType = TevmCallError> = {
	/**
	 * The call trace if tracing is enabled on call.
	 *
	 * @example
	 * ```typescript
	 * const trace = result.trace
	 * trace.structLogs.forEach(console.log)
	 * ```
	 */
	trace?: TraceResult
	/**
	 * The access list if enabled on call.
	 * Mapping of addresses to storage slots.
	 *
	 * @example
	 * ```typescript
	 * const accessList = result.accessList
	 * console.log(accessList) // { "0x...": Set(["0x..."]) }
	 * ```
	 */
	accessList?: Record<Address, Set<Hex>>
	/**
	 * Preimages mapping of the touched accounts from the transaction (see `reportPreimages` option).
	 */
	preimages?: Record<Hex, Hex>
	/**
	 * The returned transaction hash if the call was included in the chain.
	 * Will not be defined if the call was not included in the chain.
	 * Whether a call is included in the chain depends on the `createTransaction` option and the result of the call.
	 *
	 * @example
	 * ```typescript
	 * const txHash = result.txHash
	 * if (txHash) {
	 *   console.log(`Transaction included in the chain with hash: ${txHash}`)
	 * }
	 * ```
	 */
	txHash?: Hex
	/**
	 * Amount of gas left after execution.
	 */
	gas?: bigint
	/**
	 * Amount of gas the code used to run within the EVM.
	 * This only includes gas spent on the EVM execution itself and doesn't account for gas spent on other factors such as data storage.
	 */
	executionGasUsed: bigint
	/**
	 * Array of logs that the contract emitted.
	 *
	 * @example
	 * ```typescript
	 * const logs = result.logs
	 * logs?.forEach(log => console.log(log))
	 * ```
	 */
	logs?: Log[]
	/**
	 * The gas refund counter as a uint256.
	 */
	gasRefund?: bigint
	/**
	 * Amount of blob gas consumed by the transaction.
	 */
	blobGasUsed?: bigint
	/**
	 * Address of created account during the transaction, if any.
	 */
	createdAddress?: Address
	/**
	 * A set of accounts to selfdestruct.
	 */
	selfdestruct?: Set<Address>
	/**
	 * Map of addresses which were created (used in EIP 6780).
	 * Note the addresses are not actually created until the transaction is mined.
	 */
	createdAddresses?: Set<Address>
	/**
	 * Encoded return value from the contract as a hex string.
	 *
	 * @example
	 * ```typescript
	 * const rawData = result.rawData
	 * console.log(`Raw data returned: ${rawData}`)
	 * ```
	 */
	rawData: Hex
	/**
	 * Description of the exception, if any occurred.
	 */
	errors?: ErrorType[]
	/**
	 * Priority fee set by the transaction.
	 */
	priorityFee?: bigint
	/**
	 * The base fee of the transaction.
	 */
	baseFee?: bigint
	/**
	 * L1 fee that should be paid for the transaction.
	 * Only included when an OP-Stack common is provided.
	 *
	 * @see [OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)
	 */
	l1Fee?: bigint
	/**
	 * Amount of L1 gas used to publish the transaction.
	 * Only included when an OP-Stack common is provided.
	 *
	 * @see [OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)
	 */
	l1GasUsed?: bigint
	/**
	 * Current blob base fee known by the L2 chain.
	 *
	 * @see [OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)
	 */
	l1BlobFee?: bigint
	/**
	 * Latest known L1 base fee known by the L2 chain.
	 * Only included when an OP-Stack common is provided.
	 *
	 * @see [OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)
	 */
	l1BaseFee?: bigint
	/**
	 * The amount of gas used in this transaction, which is paid for.
	 * This contains the gas units that have been used on execution, plus the upfront cost,
	 * which consists of calldata cost, intrinsic cost, and optionally the access list costs.
	 * This is analogous to what `eth_estimateGas` would return. Does not include L1 fees.
	 */
	totalGasSpent?: bigint
	/**
	 * The amount of ether used by this transaction. Does not include L1 fees.
	 */
	amountSpent?: bigint
	/**
	 * The value that accrues to the miner by this transaction.
	 */
	minerValue?: bigint
}
