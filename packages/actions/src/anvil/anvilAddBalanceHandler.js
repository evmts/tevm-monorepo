import { getBalanceHandler } from '../eth/getBalanceHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

/**
 * Handler for anvil_addBalance - adds to an account's ETH balance
 * This is a convenience method that reads the current balance, adds the amount,
 * and sets the new balance.
 *
 * @param {import('@tevm/node').TevmNode} node
 * @returns {import('./AnvilHandler.js').AnvilAddBalanceHandler}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilAddBalanceHandler } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const handler = anvilAddBalanceHandler(node)
 *
 * // Add 1 ETH to an account
 * await handler({
 *   address: '0x1234567890123456789012345678901234567890',
 *   amount: 1000000000000000000n // 1 ETH in wei
 * })
 * ```
 */
export const anvilAddBalanceHandler =
	(node) =>
	async ({ address, amount }) => {
		try {
			// Get current balance
			const currentBalance = await getBalanceHandler(node)({
				address,
				blockTag: 'latest',
			})

			// Convert amount to bigint if it's a hex string
			const amountBigInt = typeof amount === 'bigint' ? amount : BigInt(amount)

			// Calculate new balance
			const newBalance = currentBalance + amountBigInt

			// Set the new balance
			const result = await setAccountHandler(node)({
				address,
				balance: newBalance,
			})

			// Return empty result or errors
			return result.errors ? { errors: result.errors } : {}
		} catch (error) {
			return {
				errors: [
					{
						message: error instanceof Error ? error.message : String(error),
					},
				],
			}
		}
	}
