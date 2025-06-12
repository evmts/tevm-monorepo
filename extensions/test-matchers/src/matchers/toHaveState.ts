/**
 * @fileoverview toHaveState matcher for testing account state
 */

import type { Address } from 'viem'
import type { AccountState, ContractLike, TevmClient } from '../types/index.js'

/**
 * Asserts that a contract or address has the expected account state
 *
 * @param received - Contract object or address string
 * @param client - Tevm client to query state
 * @param expectedState - Expected state object (partial)
 * @returns Promise<{pass: boolean, message: () => string}>
 *
 * @example
 * ```typescript
 * import { expect } from 'vitest'
 * import { toHaveState } from '@tevm/test-matchers'
 *
 * // Test account state
 * await expect(myContract).toHaveState(client, {
 *   balance: 100n,
 *   nonce: 1
 * })
 *
 * // Test with address string
 * await expect('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4').toHaveState(client, {
 *   balance: 1000000000000000000n
 * })
 * ```
 */
export async function toHaveState(
	received: ContractLike | Address,
	client: TevmClient,
	expectedState: AccountState,
): Promise<{ pass: boolean; message: () => string }> {
	const address = typeof received === 'string' ? received : received.address

	try {
		// Get current account state
		const account = await client.getAccount({ address })

		if (!account) {
			return {
				pass: false,
				message: () => `Expected account ${address} to exist but it was not found`,
			}
		}

		// Check each expected state property
		const mismatches: string[] = []

		if (expectedState.balance !== undefined) {
			if (account.balance !== expectedState.balance) {
				mismatches.push(`balance: expected ${expectedState.balance}, got ${account.balance}`)
			}
		}

		if (expectedState.nonce !== undefined) {
			if (account.nonce !== expectedState.nonce) {
				mismatches.push(`nonce: expected ${expectedState.nonce}, got ${account.nonce}`)
			}
		}

		if (expectedState.code !== undefined) {
			const code = await client.getCode({ address })
			if (code !== expectedState.code) {
				mismatches.push(`code: expected ${expectedState.code}, got ${code}`)
			}
		}

		const pass = mismatches.length === 0

		return {
			pass,
			message: () => {
				if (pass) {
					return `Expected account ${address} NOT to have state ${JSON.stringify(expectedState, (key, value) => (typeof value === 'bigint' ? value.toString() : value))}`
				}
				return `Expected account ${address} to have state ${JSON.stringify(expectedState, (key, value) => (typeof value === 'bigint' ? value.toString() : value))}, but found mismatches:\n${mismatches.join('\n')}`
			},
		}
	} catch (error) {
		return {
			pass: false,
			message: () =>
				`Error checking account state for ${address}: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}
