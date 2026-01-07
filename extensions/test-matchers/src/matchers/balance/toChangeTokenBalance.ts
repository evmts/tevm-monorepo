import { type TevmNode } from '@tevm/node'
import { type Address, type Client, isAddress } from '@tevm/utils'
import type { ContainsAddress, ContainsTransactionAny } from '../../common/types.js'
import { getDiffMethodsFromPrestateTrace } from './getDiffMethodsFromPrestateTrace.js'

/**
 * Checks if a transaction changes an account's token balance by the expected amount
 * @param received - The transaction to check
 * @param client - The client or node to use for balance queries
 * @param tokenContract - The token contract address or object with address
 * @param account - The account address or object with address
 * @param expectedChange - The expected balance change (can be negative)
 * @returns Promise with matcher result
 */
export const toChangeTokenBalance = async (
	received: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	client: Client | TevmNode,
	tokenContract: Address | ContainsAddress,
	account: Address | ContainsAddress,
	expectedChange: bigint | number | string,
) => {
	// Normalize the token address
	const tokenAddress = typeof tokenContract === 'string' ? tokenContract : tokenContract.address
	if (!isAddress(tokenAddress)) throw new Error(`Invalid token address: ${tokenAddress}`)

	// Normalize the account address
	const address = typeof account === 'string' ? account : account.address
	if (!isAddress(address)) throw new Error(`Invalid address: ${address}`)

	// Normalize the expected change
	const expectedChangeBigInt = typeof expectedChange === 'bigint' ? expectedChange : BigInt(expectedChange)

	// Handle the transaction and get token balance change
	const { getTokenBalanceChange } = await getDiffMethodsFromPrestateTrace(client, received)
	const tokenBalanceChange = await getTokenBalanceChange(tokenAddress, address)

	const pass = tokenBalanceChange === expectedChangeBigInt

	return {
		pass,
		message: () =>
			pass
				? `Expected account ${address} not to change token balance by ${expectedChangeBigInt.toString()}`
				: `Expected account ${address} to change token balance by ${expectedChangeBigInt.toString()}`,
		actual: tokenBalanceChange,
		expected: expectedChangeBigInt,
	}
}
