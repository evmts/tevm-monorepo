export { toChangeBalance } from './toChangeBalance.js'
export type { BalanceChange, HandleTransactionResult } from './types.js'
import type { TevmNode } from '@tevm/node'
import type { Address, Client } from 'viem'
import type { ContainsAddress } from '../../common/types.js'

export interface BalanceMatchers {
	/**
	 * Checks if a transaction changes an account's balance by the expected amount.
	 *
	 * @param client - The client or node to use for balance queries
	 * @param account - The account address or object with address
	 * @param expectedChange - The expected balance change (can be negative)
	 *
	 * @example
	 * ```typescript
	 * // Check that a transaction increases balance by 100 wei
	 * await expect(txHash).toChangeBalance(client, '0x123...', 100n)
	 *
	 * // Check that a transaction decreases balance by 50 wei
	 * await expect(txPromise).toChangeBalance(client, account, -50n)
	 * ```
	 */
	toChangeBalance(
		client: Client | TevmNode,
		account: Address | ContainsAddress,
		expectedChange: bigint | number | string,
	): Promise<void>
}
