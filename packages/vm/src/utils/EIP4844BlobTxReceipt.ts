import type { PostByzantiumTxReceipt } from './PostByzantiumTxReceipt.js'

/**
 * Transaction receipt format for EIP-4844 blob transactions.
 * Extends PostByzantiumTxReceipt with additional blob gas information.
 * @example
 * ```typescript
 * import { EIP4844BlobTxReceipt } from '@tevm/vm'
 *
 * const receipt: EIP4844BlobTxReceipt = {
 *   status: 1n,
 *   cumulativeBlockGasUsed: 100000n,
 *   bitvector: new Uint8Array([]),
 *   logs: [],
 *   blobGasUsed: 131072n,
 *   blobGasPrice: 10n
 * }
 * ```
 */
export interface EIP4844BlobTxReceipt extends PostByzantiumTxReceipt {
	/**
	 * blob gas consumed by a transaction
	 *
	 * Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
	 * and is only provided as part of receipt metadata.
	 */
	blobGasUsed: bigint
	/**
	 * blob gas price for block transaction was included in
	 *
	 * Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
	 * and is only provided as part of receipt metadata.
	 */
	blobGasPrice: bigint
}
