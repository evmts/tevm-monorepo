import type { Address } from 'viem'

/**
 * Information about a balance change from a transaction
 */
export interface BalanceChange {
	/**
	 * The account address whose balance changed
	 */
	address: Address
	/**
	 * The balance before the transaction
	 */
	balanceBefore: bigint
	/**
	 * The balance after the transaction
	 */
	balanceAfter: bigint
	/**
	 * The change in balance (balanceAfter - balanceBefore)
	 */
	balanceChange: bigint
}

/**
 * Result of handling a transaction for balance changes
 */
export interface HandleTransactionResult {
	/**
	 * Function to get balance change for a specific address
	 */
	getBalanceChange: (address: Address) => Promise<BalanceChange>
}
