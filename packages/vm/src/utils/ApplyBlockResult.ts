import type { Bloom } from '@tevm/utils'
import type { Hex } from '@tevm/utils'
import type { RunTxResult } from './RunTxResult.js'
import type { TxReceipt } from './TxReceipt.js'

/**
 * Result of {@link applyBlock}
 */
export interface ApplyBlockResult {
	/**
	 * The Bloom filter
	 */
	bloom: Bloom
	/**
	 * The gas used after executing the block
	 */
	gasUsed: bigint
	/**
	 * The receipt root after executing the block
	 */
	receiptsRoot: Uint8Array
	/**
	 * Receipts generated for transactions in the block
	 */
	receipts: TxReceipt[]
	/**
	 * Results of executing the transactions in the block
	 */
	results: RunTxResult[]
	/**
	 * Preimages mapping of the touched accounts from the block (see reportPreimages option)
	 */
	preimages?: Map<Hex, Uint8Array>
}
