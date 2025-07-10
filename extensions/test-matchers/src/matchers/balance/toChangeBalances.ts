import { type TevmNode } from '@tevm/node'
import { type Client, isAddress } from 'viem'
import type { ContainsTransactionAny } from '../../common/types.js'
import { handleTransaction } from './handleTransaction.js'
import type { BalanceChange } from './types.js'

/**
 * Checks if a transaction changes multiple accounts' balances by the expected amounts
 * @param received - The transaction to check
 * @param client - The client or node to use for balance queries
 * @param balanceChanges - Array of expected balance changes
 * @returns Promise with matcher result
 */
export const toChangeBalances = async (
	received: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	client: Client | TevmNode,
	balanceChanges: BalanceChange[],
) => {
	// Handle the transaction and get balance changes
	const { getBalanceChange } = await handleTransaction(received, { client })

	// Validate and normalize balance changes
	const normalizedBalanceChanges = balanceChanges.map((change) => {
		const address = typeof change.account === 'string' ? change.account : change.account.address
		const amount = typeof change.amount === 'bigint' ? change.amount : BigInt(change.amount)

		if (!isAddress(address)) throw new Error(`Invalid address: ${address}`)

		return {
			address,
			amount,
			actualAmount: getBalanceChange(address),
		}
	})

	// Check which balance changes failed
	const failedIndexes = normalizedBalanceChanges
		.filter((change) => change.actualAmount !== change.amount)
		.map((change) => normalizedBalanceChanges.indexOf(change))

	const pass = failedIndexes.length === 0

	return {
		pass,
		message: () =>
			pass
				? 'Expected transaction not to change balances by the specified amounts, but all of them passed'
				: failedIndexes.length === normalizedBalanceChanges.length
					? 'Expected transaction to change balances by the specified amounts, but none of them passed'
					: `Expected transaction to change balances by the specified amounts, but some of them didn't pass (at indexes [${failedIndexes.join(', ')}])`,
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
