/**
 * @fileoverview toCreateAddresses matcher for testing contract creation
 */

import type { Address } from 'viem'
import type { TevmClient, TransactionLike } from '../types/index.js'

/**
 * Asserts that a transaction creates contracts at the expected addresses
 *
 * @param received - Transaction object to simulate
 * @param client - Tevm client to simulate transaction
 * @param expectedAddresses - Array of addresses that should be created
 * @returns Promise<{pass: boolean, message: () => string}>
 *
 * @example
 * ```typescript
 * import { expect } from 'vitest'
 * import { toCreateAddresses } from '@tevm/test-matchers'
 *
 * // Test contract creation
 * await expect(deployTransaction).toCreateAddresses(client, [
 *   '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4'
 * ])
 * ```
 */
export async function toCreateAddresses(
	received: TransactionLike,
	client: TevmClient,
	expectedAddresses: Address[],
): Promise<{ pass: boolean; message: () => string }> {
	try {
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

		// Check if result contains created addresses
		// This depends on the client implementation returning created addresses
		const actualAddresses = result.createdAddresses || []

		// Compare expected vs actual addresses
		const expectedSet = new Set(expectedAddresses.map((addr) => addr.toLowerCase()))
		const actualSet = new Set(actualAddresses.map((addr: string) => addr.toLowerCase()))

		const missing = expectedAddresses.filter((addr) => !actualSet.has(addr.toLowerCase()))
		const unexpected = actualAddresses.filter((addr: string) => !expectedSet.has(addr.toLowerCase()))

		const pass = missing.length === 0 && unexpected.length === 0

		return {
			pass,
			message: () => {
				if (pass) {
					return `Expected transaction NOT to create addresses ${expectedAddresses.join(', ')}`
				}

				let message = `Expected transaction to create addresses ${expectedAddresses.join(', ')}`
				if (missing.length > 0) {
					message += `, but missing: ${missing.join(', ')}`
				}
				if (unexpected.length > 0) {
					message += `, and found unexpected: ${unexpected.join(', ')}`
				}
				return message
			},
		}
	} catch (error) {
		return {
			pass: false,
			message: () => `Error checking created addresses: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}
