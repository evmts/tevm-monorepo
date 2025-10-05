import { anvilSetStorageAtJsonRpcProcedure, contractHandler, type PrestateTraceResult } from '@tevm/actions'
import { ERC20 } from '@tevm/contract'
import type { TevmNode } from '@tevm/node'
import { isEqual } from 'ox/Hex'
import { type Address, type Hex, hexToBigInt, numberToHex } from 'viem'

/**
 * Gets the token balance change for a specific token and address by analyzing storage changes
 * @param node - The TevmNode instance
 * @param tokenAddress - The token contract address
 * @param address - The address to check balance change for
 * @param prestateTrace - The prestate trace containing storage changes
 * @returns The balance change and slot information
 */
export const getTokenBalanceChange = async (
	node: TevmNode,
	tokenAddress: Address,
	address: Address,
	prestateTrace: PrestateTraceResult<true>,
): Promise<bigint> => {
	// Get the current balance
	const currentBalanceResponse = await contractHandler(node)({
		...ERC20.withAddress(tokenAddress).read.balanceOf(address),
		throwOnFail: false,
	})

	if (currentBalanceResponse.errors || currentBalanceResponse.data === undefined) {
		throw new Error(
			`Failed to get initial balance for token ${tokenAddress} and address ${address} when trying to find the balanceOf slot. Could not retrieve the balance change.\n\n${JSON.stringify(currentBalanceResponse, null, 2)}`,
		)
	}

	const currentBalance = currentBalanceResponse.data

	// Iterate through all addresses that have storage changes
	for (const [contractAddress, traceData] of Object.entries(prestateTrace.post)) {
		// Skip if no storage changes
		if (!traceData.storage) continue

		// For each storage slot that was accessed
		for (const [slot, currentValue] of Object.entries(traceData.storage)) {
			// Skip early if the value is not the encoded current balance
			if (!isEqual(currentValue, numberToHex(currentBalance))) continue

			try {
				// Set to a different value to see if it affects the balance
				const nextValue = numberToHex(currentBalance + 1n, { size: 32 })
				await anvilSetStorageAtJsonRpcProcedure(node)({
					method: 'anvil_setStorageAt',
					params: [contractAddress as Address, slot as Hex, nextValue],
					id: 1,
					jsonrpc: '2.0',
				})

				// Check if the balance changed
				const nextBalanceResponse = await contractHandler(node)(ERC20.withAddress(tokenAddress).read.balanceOf(address))

				// If balance didn't change, that's not the slot we're looking for
				if (nextBalanceResponse.data === undefined || nextBalanceResponse.data === currentBalance) continue

				// Get the previous balance from the prestate trace
				const preSlotValue = prestateTrace.pre[contractAddress as Address]?.storage?.[slot as Hex]
				if (preSlotValue === undefined) throw new Error('preSlotValue is undefined') // this can't happen as it was in the post state

				const previousBalance = hexToBigInt(preSlotValue)
				return currentBalance - previousBalance
			} catch (_) {
				// If there's an error, we'll try the next slot
			} finally {
				// Always restore the original value
				await anvilSetStorageAtJsonRpcProcedure(node)({
					method: 'anvil_setStorageAt',
					params: [contractAddress as Address, slot as Hex, currentValue],
					id: 1,
					jsonrpc: '2.0',
				})
			}
		}
	}

	// If no storage slot affected the balance, that means this account was untouched so its balance didn't change
	// or it was touched but only accessed (balance is in pre state but not in post state)
	return 0n
}
