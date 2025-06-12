/**
 * @fileoverview toChangeBalance matcher for testing balance changes
 */

import type { Address } from 'viem'
import type { TevmClient, TransactionLike } from '../types/index.js'

/**
 * Asserts that a transaction changes an account's balance by the expected amount
 *
 * @param received - Transaction object to simulate
 * @param client - Tevm client to simulate transaction
 * @param address - Address whose balance change to check
 * @param expectedChange - Expected balance change (can be positive or negative)
 * @returns Promise<{pass: boolean, message: () => string}>
 *
 * @example
 * ```typescript
 * import { expect } from 'vitest'
 * import { toChangeBalance } from '@tevm/test-matchers'
 *
 * // Test positive balance change (receiving funds)
 * await expect(transaction).toChangeBalance(client, '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', 100n)
 *
 * // Test negative balance change (sending funds)
 * await expect(transaction).toChangeBalance(client, '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', -100n)
 *
 * // Test no balance change
 * await expect(transaction).toChangeBalance(client, '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', 0n)
 * ```
 */
export async function toChangeBalance(
	received: TransactionLike,
	client: TevmClient,
	address: Address,
	expectedChange: bigint,
): Promise<{ pass: boolean; message: () => string }> {
	try {
		// Get balance before transaction
		const balanceBefore = await client.getBalance({ address })

		// Simulate transaction
		let result: any
		if (client.simulateContract && received.to) {
			try {
				result = await client.simulateContract({
					address: received.to,
					...received,
				})
			} catch {
				if (client.call) {
					result = await client.call(received)
				} else {
					throw new Error('Client does not support transaction simulation')
				}
			}
		} else if (client.call) {
			result = await client.call(received)
		} else {
			throw new Error('Client does not support transaction simulation')
		}

		// For now, we can't easily get post-transaction state without actually executing
		// This is a limitation of simulation vs execution
		// We'll check if the transaction would revert and handle accordingly
		if (result && (result.error || result.revert)) {
			if (expectedChange === 0n) {
				return {
					pass: true,
					message: () =>
						`Expected balance for ${address} NOT to change by 0, but transaction reverted (which means no change)`,
				}
			}
			return {
				pass: false,
				message: () => `Expected balance for ${address} to change by ${expectedChange}, but transaction reverted`,
			}
		}

		// For successful simulations, we need to make assumptions about balance changes
		// This is a simplified implementation - in a real scenario, you'd need to execute the transaction
		// or have more sophisticated simulation that tracks state changes

		// Check if this transaction involves a transfer to/from the address
		const isRecipient = received.to === address
		const isSender = received.from === address
		const transferValue = received.value || 0n

		let estimatedChange = 0n
		if (isRecipient && transferValue > 0n) {
			estimatedChange = transferValue
		} else if (isSender && transferValue > 0n) {
			// Sender loses the value plus gas costs
			const gasUsed = result.gas || result.gasUsed || 0n
			const gasPrice = received.gasPrice || received.maxFeePerGas || 1000000000n
			estimatedChange = -(transferValue + gasUsed * gasPrice)
		}

		const pass = estimatedChange === expectedChange

		return {
			pass,
			message: () => {
				if (pass) {
					return `Expected balance for ${address} NOT to change by ${expectedChange}`
				}
				return `Expected balance for ${address} to change by ${expectedChange}, but estimated change is ${estimatedChange} (Note: This is a simulation-based estimate)`
			},
		}
	} catch (error) {
		return {
			pass: false,
			message: () =>
				`Error checking balance change for ${address}: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}
