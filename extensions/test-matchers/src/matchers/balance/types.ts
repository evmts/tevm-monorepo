import type { Address } from 'viem'
import type { ContainsAddress } from '../../common/types.js'

/**
 * Result of handling a transaction for balance changes
 */
export interface HandleTransactionResult {
	/**
	 * Function to get balance change for a specific address
	 */
	getBalanceChange: (address: Address) => bigint
	/**
	 * Function to get token balance change for a specific token and address
	 */
	getTokenBalanceChange: (tokenAddress: Address, address: Address) => Promise<bigint>
}

/**
 * Balance change specification for the toChangeBalances matcher
 */
export interface BalanceChange {
	account: Address | ContainsAddress
	amount: bigint | number | string
}
