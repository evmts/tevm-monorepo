import type { EthjsLog } from '@tevm/utils'

/**
 * Abstract interface with common transaction receipt fields
 */
export interface BaseTxReceipt {
	/**
	 * Cumulative gas used in the block including this tx
	 */
	cumulativeBlockGasUsed: bigint
	/**
	 * Bloom bitvector
	 */
	bitvector: Uint8Array
	/**
	 * Logs emitted
	 */
	logs: EthjsLog[]
}
