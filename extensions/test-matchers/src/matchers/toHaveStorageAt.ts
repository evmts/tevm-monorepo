/**
 * @fileoverview toHaveStorageAt matcher for testing specific storage slots
 */

import type { Address, Hex } from 'viem'
import type { ContractLike, StorageSlot, TevmClient } from '../types/index.js'

/**
 * Asserts that a contract has the expected value at a specific storage slot or slots
 *
 * @param received - Contract object or address string
 * @param client - Tevm client to query storage
 * @param expected - Single storage slot or array of storage slots
 * @returns Promise<{pass: boolean, message: () => string}>
 *
 * @example
 * ```typescript
 * import { expect } from 'vitest'
 * import { toHaveStorageAt } from '@tevm/test-matchers'
 *
 * // Test single storage slot
 * await expect(myContract).toHaveStorageAt(client, {
 *   slot: '0x0',
 *   value: '0x1234567890abcdef'
 * })
 *
 * // Test multiple storage slots
 * await expect(myContract).toHaveStorageAt(client, [
 *   { slot: '0x0', value: '0x1234567890abcdef' },
 *   { slot: '0x1', value: '0x0000000000000000000000000000000000000000000000000000000000000001' }
 * ])
 *
 * // Test with address string
 * await expect('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4').toHaveStorageAt(client, {
 *   slot: '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
 *   value: '0x0000000000000000000000001234567890123456789012345678901234567890'
 * })
 * ```
 */
export async function toHaveStorageAt(
	received: ContractLike | Address,
	client: TevmClient,
	expected: StorageSlot | StorageSlot[],
): Promise<{ pass: boolean; message: () => string }> {
	const address = typeof received === 'string' ? received : received.address
	const slots = Array.isArray(expected) ? expected : [expected]

	try {
		// Check each storage slot
		const mismatches: string[] = []

		for (const { slot, value: expectedValue } of slots) {
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
					const slotsDescription =
						slots.length === 1
							? `slot ${slots[0].slot} to NOT have value ${slots[0].value}`
							: 'storage slots to NOT have expected values'
					return `Expected contract ${address} ${slotsDescription}`
				}

				const slotsDescription =
					slots.length === 1
						? `slot ${slots[0].slot} to have value ${slots[0].value}`
						: 'storage slots to have expected values'
				return `Expected contract ${address} ${slotsDescription}, but found mismatches:\n${mismatches.join('\n')}`
			},
		}
	} catch (error) {
		return {
			pass: false,
			message: () => `Error checking storage for ${address}: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}
