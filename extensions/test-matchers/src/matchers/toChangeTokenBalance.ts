/**
 * @fileoverview toChangeTokenBalance matcher for testing ERC20 token balance changes
 */

import type { Address } from 'viem'
import type { TevmClient, TransactionLike } from '../types/index.js'

/**
 * Asserts that a transaction changes an account's ERC20 token balance by the expected amount
 *
 * @param received - Transaction object to simulate
 * @param client - Tevm client to simulate transaction
 * @param tokenAddress - Address of the ERC20 token contract
 * @param accountAddress - Address whose token balance change to check
 * @param expectedChange - Expected token balance change (can be positive or negative)
 * @returns Promise<{pass: boolean, message: () => string}>
 *
 * @example
 * ```typescript
 * import { expect } from 'vitest'
 * import { toChangeTokenBalance } from '@tevm/test-matchers'
 *
 * // Test positive token balance change (receiving tokens)
 * await expect(transaction).toChangeTokenBalance(
 *   client,
 *   '0xA0b86a33E6441e8b35b1c3fc2A1b55C4B3D63D29', // token address
 *   '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', // account address
 *   100n
 * )
 *
 * // Test negative token balance change (sending tokens)
 * await expect(transaction).toChangeTokenBalance(
 *   client,
 *   '0xA0b86a33E6441e8b35b1c3fc2A1b55C4B3D63D29',
 *   '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4',
 *   -100n
 * )
 * ```
 */
export async function toChangeTokenBalance(
	received: TransactionLike,
	client: TevmClient,
	tokenAddress: Address,
	accountAddress: Address,
	expectedChange: bigint,
): Promise<{ pass: boolean; message: () => string }> {
	try {
		// This would need to:
		// 1. Get token balance before transaction
		// 2. Simulate transaction
		// 3. Get token balance after transaction
		// 4. Compare the difference

		// For now, return a placeholder implementation
		// In a real implementation, this would need to:
		// - Call balanceOf(accountAddress) on the token contract before and after
		// - Execute or simulate the transaction and track state changes

		return {
			pass: false,
			message: () =>
				`toChangeTokenBalance matcher is not yet fully implemented. Expected ${accountAddress} token balance for ${tokenAddress} to change by ${expectedChange}`,
		}
	} catch (error) {
		return {
			pass: false,
			message: () => `Error checking token balance change: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}
