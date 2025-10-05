import type { TevmNode } from '@tevm/node'
import type { Address, Client } from 'viem'

export { toChangeBalance } from './toChangeBalance.js'
export { toChangeBalances } from './toChangeBalances.js'
export { toChangeTokenBalance } from './toChangeTokenBalance.js'
export { toChangeTokenBalances } from './toChangeTokenBalances.js'
export type { BalanceChange, HandleTransactionResult } from './types.js'

import type { ContainsAddress } from '../../common/types.js'

export interface BalanceMatchers {
	/**
	 * Asserts that a transaction changes an account's ETH balance by the expected amount.
	 *
	 * @param client - The client or node to use for balance queries
	 * @param account - The account address or object with address
	 * @param expectedChange - The expected balance change in wei (negative for decrease)
	 *
	 * @example
	 * ```typescript
	 * // Account gains 100 wei
	 * await expect(txHash).toChangeBalance(client, '0x123...', 100n)
	 *
	 * // Account loses 50 wei
	 * await expect(txHash).toChangeBalance(client, account, -50n)
	 *
	 * // Works with transaction promises
	 * await expect(client.sendTransaction(tx))
	 *   .toChangeBalance(client, sender, -1000n)
	 * ```
	 *
	 * @see {@link toChangeBalances} to test multiple accounts
	 * @see {@link toChangeTokenBalance} to test ERC20 token balances
	 */
	toChangeBalance(
		client: Client | TevmNode,
		account: Address | ContainsAddress,
		expectedChange: bigint | number | string,
	): Promise<void>

	/**
	 * Asserts that a transaction changes multiple accounts' ETH balances by the expected amounts.
	 *
	 * When using .not, it will pass if at least one balance change differs from expected.
	 *
	 * @param client - The client or node to use for balance queries
	 * @param balanceChanges - Array of expected balance changes
	 *
	 * @example
	 * ```typescript
	 * // Test a simple transfer
	 * await expect(txHash).toChangeBalances(client, [
	 *   { account: sender, amount: -100n },    // sender loses 100 wei
	 *   { account: recipient, amount: 100n },  // recipient gains 100 wei
	 * ])
	 *
	 * // Test contract deployment (deployer pays gas)
	 * await expect(deployTx).toChangeBalances(client, [
	 *   { account: deployer, amount: -gasUsed },
	 *   { account: contractAddress, amount: 0n },
	 * ])
	 * ```
	 *
	 * @see {@link toChangeBalance} to test a single account
	 * @see {@link toChangeTokenBalances} to test multiple ERC20 balances
	 */
	toChangeBalances(client: Client | TevmNode, balanceChanges: BalanceChange[]): Promise<void>

	/**
	 * Asserts that a transaction changes an account's ERC20 token balance by the expected amount.
	 *
	 * @param client - The client or node to use for balance queries
	 * @param tokenContract - The ERC20 token contract address or object with address
	 * @param account - The account address or object with address
	 * @param expectedChange - The expected token balance change (negative for decrease)
	 *
	 * @example
	 * ```typescript
	 * // Account gains 100 tokens
	 * await expect(txHash).toChangeTokenBalance(
	 *   client,
	 *   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
	 *   '0x123...',
	 *   100n
	 * )
	 *
	 * // Using contract object
	 * await expect(txHash).toChangeTokenBalance(
	 *   client,
	 *   tokenContract,
	 *   account,
	 *   -50_000000n // 50 USDC (6 decimals)
	 * )
	 * ```
	 *
	 * @see {@link toChangeTokenBalances} to test multiple accounts
	 * @see {@link toChangeBalance} to test ETH balances
	 */
	toChangeTokenBalance(
		client: Client | TevmNode,
		tokenContract: Address | ContainsAddress,
		account: Address | ContainsAddress,
		expectedChange: bigint | number | string,
	): Promise<void>

	/**
	 * Asserts that a transaction changes multiple accounts' ERC20 token balances by the expected amounts.
	 *
	 * When using .not, it will pass if at least one token balance change differs from expected.
	 *
	 * @param client - The client or node to use for balance queries
	 * @param tokenContract - The ERC20 token contract address or object with address
	 * @param balanceChanges - Array of expected token balance changes
	 *
	 * @example
	 * ```typescript
	 * // Test a token transfer
	 * await expect(txHash).toChangeTokenBalances(
	 *   client,
	 *   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
	 *   [
	 *     { account: sender, amount: -1000000n },    // -1 USDC
	 *     { account: recipient, amount: 1000000n },  // +1 USDC
	 *   ]
	 * )
	 *
	 * // Test token minting
	 * await expect(mintTx).toChangeTokenBalances(client, tokenContract, [
	 *   { account: mintRecipient, amount: 1000n },
	 *   { account: treasury, amount: 50n }, // 5% mint fee
	 * ])
	 * ```
	 *
	 * @see {@link toChangeTokenBalance} to test a single account
	 * @see {@link toChangeBalances} to test multiple ETH balances
	 */
	toChangeTokenBalances(
		client: Client | TevmNode,
		tokenContract: Address | ContainsAddress,
		balanceChanges: BalanceChange[],
	): Promise<void>
}
