import { type TevmNode } from '@tevm/node'
import { type Address, type Client, isAddress } from 'viem'
import type { ContainsAddress, ContainsTransactionAny } from '../../common/types.js'
import { handleTransaction } from './handleTransaction.js'
import type { BalanceChange } from './types.js'

/**
 * Checks if a transaction changes multiple accounts' token balances by the expected amounts
 * @param received - The transaction to check
 * @param client - The client or node to use for balance queries
 * @param tokenContract - The token contract address or object with address
 * @param balanceChanges - Array of expected token balance changes
 * @returns Promise with matcher result
 */
export const toChangeTokenBalances = async (
	received: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	client: Client | TevmNode,
	tokenContract: Address | ContainsAddress,
	balanceChanges: BalanceChange[],
) => {
	// Normalize the token address
	const tokenAddress = typeof tokenContract === 'string' ? tokenContract : tokenContract.address
	if (!isAddress(tokenAddress)) throw new Error(`Invalid token address: ${tokenAddress}`)

	// Handle the transaction and get token balance changes
	const { getTokenBalanceChange } = await handleTransaction(received, { client })

	// Validate and normalize token balance changes
	const normalizedBalanceChanges = await Promise.all(
		balanceChanges.map(async (change) => {
			const address = typeof change.account === 'string' ? change.account : change.account.address
			const amount = typeof change.amount === 'bigint' ? change.amount : BigInt(change.amount)

			if (!isAddress(address)) throw new Error(`Invalid address: ${address}`)

			const balanceChange = await getTokenBalanceChange(
				tokenAddress,
				address,
			)

			return {
				address,
				amount,
				actualAmount: balanceChange,
			}
		}),
	)

	// Check which balance changes failed
	const failedIndexes = normalizedBalanceChanges
		.filter((change) => change.actualAmount !== change.amount)
		.map((change) => normalizedBalanceChanges.indexOf(change))

	const pass = failedIndexes.length === 0

	return {
		pass,
		message: () =>
			pass
				? 'Expected transaction not to change token balances by the specified amounts, but all of them passed'
				: failedIndexes.length === normalizedBalanceChanges.length
					? 'Expected transaction to change token balances by the specified amounts, but none of them passed'
					: `Expected transaction to change token balances by the specified amounts, but some of them didn't pass (at indexes [${failedIndexes.join(', ')}])`,
		actual: balanceChanges.map((change, i) => ({
			account: change.account,
			amount: normalizedBalanceChanges[i]?.actualAmount,
		})),
		expected: balanceChanges.map((change, i) => ({
			account: change.account,
			amount: normalizedBalanceChanges[i]?.amount,
		})),
	}
}