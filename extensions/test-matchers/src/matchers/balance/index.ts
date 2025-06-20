export { toChangeBalance } from './toChangeBalance.js'
export { toChangeBalances } from './toChangeBalances.js'
export { toChangeTokenBalance } from './toChangeTokenBalance.js'
export type { BalanceChange, HandleTransactionResult } from './types.js'
import type { TevmNode } from '@tevm/node'
import type { Address, Client } from 'viem'
import type { ContainsAddress } from '../../common/types.js'
import type { BalanceChange } from './types.js'

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

	/**
	 * Checks if a transaction changes multiple accounts' balances by the expected amounts.
	 *
	 * @param client - The client or node to use for balance queries
	 * @param balanceChanges - Array of expected balance changes
	 *
	 * @example
	 * ```typescript
	 * // Check multiple balance changes
	 * await expect(txHash).toChangeBalances(client, [
	 *   { account: '0x123...', amount: -100n }, // sender loses 100
	 *   { account: '0x456...', amount: 100n },  // recipient gains 100
	 * ])
	 * ```
	 *
	 * @example
	 * ```typescript
	 * // Use an account object
	 * await expect(txHash).toChangeBalances(client, [
	 *   { account: { address: '0x123...', ... }, amount: -100n }, // sender loses 100
	 *   { account: { address: '0x456...', ... }, amount: 100n },  // recipient gains 100
	 * ])
	 * ```
	 */
	toChangeBalances(client: Client | TevmNode, balanceChanges: BalanceChange[]): Promise<void>

	/**
	 * Checks if a transaction changes an account's token balance by the expected amount.
	 *
	 * @param client - The client or node to use for balance queries
	 * @param tokenContract - The token contract address or object with address
	 * @param account - The account address or object with address
	 * @param expectedChange - The expected balance change (can be negative)
	 *
	 * @example
	 * ```typescript
	 * // Check that a transaction increases token balance by 100 tokens
	 * await expect(txHash).toChangeTokenBalance(client, '0xTokenAddress...', '0x123...', 100n)
	 *
	 * // Check that a transaction decreases token balance by 50 tokens
	 * await expect(txPromise).toChangeTokenBalance(client, tokenContract, account, -50n)
	 * ```
	 */
	toChangeTokenBalance(
		client: Client | TevmNode,
		tokenContract: Address | ContainsAddress,
		account: Address | ContainsAddress,
		expectedChange: bigint | number | string,
	): Promise<void>
}
