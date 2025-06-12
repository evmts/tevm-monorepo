/**
 * @fileoverview toBeAccount matcher for testing account existence and type
 */

import type { Address } from 'viem'
import type { AccountState, TevmClient } from '../types/index.js'

/**
 * Account type enum
 */
export type AccountType = 'EOA' | 'contract'

/**
 * Chainable account matcher that can be extended with state checks
 */
export interface AccountMatcher {
	withState: (expectedState: AccountState) => Promise<{ pass: boolean; message: () => string }>
}

/**
 * Asserts that an address is an initialized account, optionally of a specific type
 *
 * @param received - Address string to check
 * @param client - Tevm client to query account
 * @param accountType - Optional account type ('EOA' or 'contract')
 * @returns Promise<{pass: boolean, message: () => string}> or AccountMatcher for chaining
 *
 * @example
 * ```typescript
 * import { expect } from 'vitest'
 * import { toBeAccount } from '@tevm/test-matchers'
 *
 * // Test account existence
 * await expect('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4').toBeAccount(client)
 *
 * // Test EOA account
 * await expect('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4').toBeAccount(client, 'EOA')
 *
 * // Test contract account
 * await expect('0x6B175474E89094C44Da98b954EedeAC495271d0F').toBeAccount(client, 'contract')
 *
 * // Test account with state
 * await expect('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4')
 *   .toBeAccount(client)
 *   .withState({ balance: 100n, nonce: 1 })
 * ```
 */
export async function toBeAccount(
	received: Address,
	client: TevmClient,
	accountType?: AccountType,
): Promise<{ pass: boolean; message: () => string } & AccountMatcher> {
	try {
		// Get account information
		const account = await client.getAccount({ address: received })

		if (!account) {
			const result = {
				pass: false,
				message: () => `Expected ${received} to be an initialized account but it was not found`,
				withState: async () => ({
					pass: false,
					message: () => `Expected ${received} to be an initialized account but it was not found`,
				}),
			}
			return result
		}

		// Check account type if specified
		if (accountType) {
			const code = await client.getCode({ address: received })
			const isContract = code !== '0x' && code !== '0x0'
			const actualType: AccountType = isContract ? 'contract' : 'EOA'

			if (actualType !== accountType) {
				const result = {
					pass: false,
					message: () => `Expected ${received} to be a ${accountType} account but it is a ${actualType} account`,
					withState: async () => ({
						pass: false,
						message: () => `Expected ${received} to be a ${accountType} account but it is a ${actualType} account`,
					}),
				}
				return result
			}
		}

		// Return successful result with withState chaining capability
		const result = {
			pass: true,
			message: () => {
				const typeDescription = accountType ? ` ${accountType}` : ''
				return `Expected ${received} NOT to be an initialized${typeDescription} account`
			},
			withState: async (expectedState: AccountState) => {
				// Delegate to toHaveState logic
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
					const code = await client.getCode({ address: received })
					if (code !== expectedState.code) {
						mismatches.push(`code: expected ${expectedState.code}, got ${code}`)
					}
				}

				const pass = mismatches.length === 0

				return {
					pass,
					message: () => {
						if (pass) {
							return `Expected account ${received} NOT to have state ${JSON.stringify(expectedState)}`
						}
						return `Expected account ${received} to have state ${JSON.stringify(expectedState)}, but found mismatches:\n${mismatches.join('\n')}`
					},
				}
			},
		}

		return result
	} catch (error) {
		const result = {
			pass: false,
			message: () => `Error checking account ${received}: ${error instanceof Error ? error.message : String(error)}`,
			withState: async () => ({
				pass: false,
				message: () => `Error checking account ${received}: ${error instanceof Error ? error.message : String(error)}`,
			}),
		}
		return result
	}
}
