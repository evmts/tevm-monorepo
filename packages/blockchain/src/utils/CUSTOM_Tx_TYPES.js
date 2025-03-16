/**
 * Array of custom transaction type identifiers for L2 (Layer 2) chains
 *
 * These transaction types are specific to different L2 solutions like Optimism and Arbitrum,
 * which extend Ethereum's transaction types (EIP-2718) with their own custom types for
 * special operations like deposits or cross-layer communications.
 *
 * Used for recognizing and correctly handling these non-standard transaction types
 * when processing blocks from different L2 networks.
 *
 * @example
 * ```typescript
 * import { customTxTypes } from '@tevm/blockchain'
 *
 * // Check if a transaction type is a known L2-specific type
 * function isCustomL2TxType(txType) {
 *   return customTxTypes.includes(txType)
 * }
 *
 * // Handle transaction type appropriately
 * function processTransaction(tx) {
 *   if (isCustomL2TxType(tx.type)) {
 *     console.log(`Processing L2-specific tx type: ${tx.type}`)
 *     // Apply special L2 handling based on type
 *   } else {
 *     // Handle standard Ethereum transaction
 *   }
 * }
 * ```
 */
export const customTxTypes = [
	'0x7e', // Optimism deposit tx
	'0x6a', // ArbitrumDepositTxType
	'0x6b', // ArbitrumUnsignedTxType
	'0x6c', // ArbitrumContractTxType
	'0x6d', // ArbitrumRetryTxType
	'0x6e', // ArbitrumSubmitRetryableTxType
	'0x6f', // ArbitrumInternalTxType
]
