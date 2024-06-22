import type { BaseTxReceipt } from './BaseTxReceipt.js'

/**
 * Pre-Byzantium receipt type with a field
 * for the intermediary state root
 */
export interface PreByzantiumTxReceipt extends BaseTxReceipt {
	/**
	 * Intermediary state root
	 */
	stateRoot: Uint8Array
}
