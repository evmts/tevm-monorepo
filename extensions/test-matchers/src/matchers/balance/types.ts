import type { Address } from 'viem'

/**
 * Result of handling a transaction for balance changes
 */
export interface HandleTransactionResult {
	/**
	 * Function to get balance change for a specific address
	 */
	getBalanceChange: (address: Address) => bigint
}
