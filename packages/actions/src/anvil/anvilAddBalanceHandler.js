import { getBalanceHandler } from '../eth/getBalanceHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

/**
 * Handler for anvil_addBalance - adds to an account's ETH balance
 * This is a convenience method that reads the current balance, adds the amount,
 * and sets the new balance.
 *
 * @param {import('@tevm/node').TevmNode} node
 * @returns {import('./AnvilHandler.js').AnvilAddBalanceHandler}
 * @throws {Error} if setting the balance fails
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
export const anvilAddBalanceHandler = (node) => {
	/**
	 * @type {import('./AnvilHandler.js').AnvilAddBalanceHandler}
	 */
	const handler = async ({ address, amount }) => {
		// Get current balance
		const currentBalance = await getBalanceHandler(node)({
			address,
			blockTag: 'latest',
		})

		// Convert amount to bigint if it's a hex string
		const amountBigInt = typeof amount === 'bigint' ? amount : BigInt(/** @type {`0x${string}`} */ (amount))

		// Calculate new balance
		const newBalance = currentBalance + amountBigInt

		// Set the new balance
		const result = await setAccountHandler(node)({
			address,
			balance: newBalance,
		})

		// Throw if there were errors
		if (result.errors && result.errors.length > 0) {
			throw result.errors[0]
		}

		// Return null on success per the AnvilAddBalanceResult type
		return null
	}
	return handler
}
