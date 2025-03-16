import type { PostByzantiumTxReceipt } from './PostByzantiumTxReceipt.js'

/**
 * [Description of what this interface represents]
 * @example
 * ```typescript
 * import { EIP4844BlobTxReceipt } from '[package-path]'
 * 
 * const value: EIP4844BlobTxReceipt = {
 *   // Initialize properties
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
