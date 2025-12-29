import type { Bloom } from '@tevm/utils'
import type { EvmResult } from '@tevm/evm'
import type { AccessList } from '@tevm/tx'
import type { Hex } from '@tevm/utils'
import type { TxReceipt } from './TxReceipt.js'

/**
 * Execution result of a transaction
 */
export interface RunTxResult extends EvmResult {
	/**
	 * Bloom filter resulted from transaction
	 */
	bloom: Bloom

	/**
	 * The amount of ether used by this transaction
	 */
	amountSpent: bigint

	/**
	 * The tx receipt
	 */
	receipt: TxReceipt

	/**
	 * The amount of gas used in this transaction, which is paid for
	 * This contains the gas units that have been used on execution, plus the upfront cost,
	 * which consists of calldata cost, intrinsic cost and optionally the access list costs
	 */
	totalGasSpent: bigint

	/**
	 * The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)
	 */
	gasRefund: bigint

	/**
	 * EIP-2930 access list generated for the tx (see `reportAccessList` option)
	 */
	accessList?: AccessList

	/**
	 * Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)
	 */
	preimages?: Map<Hex, Uint8Array>

	/**
	 * The value that accrues to the miner by this transaction
	 */
	minerValue: bigint

	/**
	 * This is the blob gas units times the fee per blob gas for 4844 transactions
	 */
	blobGasUsed?: bigint
}
