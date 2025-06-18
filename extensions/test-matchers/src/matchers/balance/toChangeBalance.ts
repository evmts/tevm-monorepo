import { type TevmNode } from '@tevm/node'
import { type Address, type Client, isAddress } from 'viem'
import type { ContainsAddress, ContainsTransactionAny } from '../../common/types.js'
import { handleTransaction } from './handleTransaction.js'

/**
 * Checks if a transaction changes an account's balance by the expected amount
 * @param received - The transaction to check
 * @param client - The client or node to use for balance queries
 * @param account - The account address or object with address
 * @param expectedChange - The expected balance change (can be negative)
 * @returns Promise with matcher result
 */
export const toChangeBalance = async (
	received: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	client: Client | TevmNode,
	account: Address | ContainsAddress,
	expectedChange: bigint | number | string,
) => {
	// Normalize the address
	const address = typeof account === 'string' ? account : account.address
	if (!isAddress(address)) throw new Error(`Invalid address: ${address}`)

	// Normalize the expected change
	const expectedChangeBigInt = typeof expectedChange === 'bigint' ? expectedChange : BigInt(expectedChange)

	// Handle the transaction and get balance change
	const { getBalanceChange } = await handleTransaction(received, { client })
	const { balanceChange } = await getBalanceChange(address)

	const pass = balanceChange === expectedChangeBigInt

	return {
		pass,
		message: () =>
			pass
				? `Expected account ${address} not to change balance by ${expectedChangeBigInt.toString()}`
				: `Expected account ${address} to change balance by ${expectedChangeBigInt.toString()}`,
		actual: balanceChange,
		expected: expectedChangeBigInt,
	}
}
