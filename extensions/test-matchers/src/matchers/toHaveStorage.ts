/**
 * @fileoverview toHaveStorage matcher for testing contract storage
 */

import type { Address, Hex } from 'viem'
import type { ContractLike, StorageState, TevmClient } from '../types/index.js'

/**
 * Asserts that a contract has the expected storage values
 *
 * @param received - Contract object or address string
 * @param client - Tevm client to query storage
 * @param expectedStorage - Expected storage object (partial)
 * @returns Promise<{pass: boolean, message: () => string}>
 *
 * @example
 * ```typescript
 * import { expect } from 'vitest'
 * import { toHaveStorage } from '@tevm/test-matchers'
 *
 * // Test storage values
 * await expect(myContract).toHaveStorage(client, {
 *   '0x0': '0x1234567890abcdef',
 *   '0x1': '0x0000000000000000000000000000000000000000000000000000000000000001'
 * })
 *
 * // Test with address string
 * await expect('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4').toHaveStorage(client, {
 *   '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc': '0x0000000000000000000000001234567890123456789012345678901234567890'
 * })
 * ```
 */
export async function toHaveStorage(
	received: ContractLike | Address,
	client: TevmClient,
	expectedStorage: StorageState,
): Promise<{ pass: boolean; message: () => string }> {
	const address = typeof received === 'string' ? received : received.address

	try {
		// Check each expected storage slot
		const mismatches: string[] = []

		for (const [slot, expectedValue] of Object.entries(expectedStorage)) {
			const actualValue = await client.getStorageAt({
				address,
				slot: slot as Hex,
			})

			if (actualValue !== expectedValue) {
				mismatches.push(`slot ${slot}: expected ${expectedValue}, got ${actualValue}`)
			}
		}

		const pass = mismatches.length === 0

		return {
			pass,
			message: () => {
				if (pass) {
					return `Expected contract ${address} NOT to have storage ${JSON.stringify(expectedStorage)}`
				}
				return `Expected contract ${address} to have storage ${JSON.stringify(expectedStorage)}, but found mismatches:\n${mismatches.join('\n')}`
			},
		}
	} catch (error) {
		return {
			pass: false,
			message: () => `Error checking storage for ${address}: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}
