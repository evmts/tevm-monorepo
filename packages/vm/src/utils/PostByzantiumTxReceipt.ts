import type { BaseTxReceipt } from './BaseTxReceipt.js'

/**
 * Receipt type for Byzantium and beyond replacing the intermediary
 * state root field with a status code field (EIP-658)
 */
export interface PostByzantiumTxReceipt extends BaseTxReceipt {
	/**
	 * Status of transaction, `1` if successful, `0` if an exception occurred
	 */
	status: 0 | 1
}
