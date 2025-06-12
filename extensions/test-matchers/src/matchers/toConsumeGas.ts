/**
 * @fileoverview toConsumeGas matcher for testing gas consumption
 */

import type { GasComparison, TevmClient, TransactionLike } from '../types/index.js'

/**
 * Asserts that a transaction consumes a specific amount of gas
 *
 * @param received - Transaction object to simulate
 * @param client - Tevm client to simulate transaction
 * @param expectedGas - Expected gas consumption
 * @param comparison - Comparison type ('equal', 'lessThan', 'greaterThan')
 * @returns Promise<{pass: boolean, message: () => string}>
 *
 * @example
 * ```typescript
 * import { expect } from 'vitest'
 * import { toConsumeGas } from '@tevm/test-matchers'
 *
 * // Test exact gas consumption
 * await expect(transaction).toConsumeGas(client, 21000n)
 *
 * // Test gas consumption less than
 * await expect(transaction).toConsumeGas(client, 50000n, 'lessThan')
 *
 * // Test gas consumption greater than
 * await expect(transaction).toConsumeGas(client, 20000n, 'greaterThan')
 * ```
 */
export async function toConsumeGas(
	received: TransactionLike,
	client: TevmClient,
	expectedGas: bigint,
	comparison: GasComparison = 'equal',
): Promise<{ pass: boolean; message: () => string }> {
	try {
		// Estimate gas for the transaction
		let actualGas: bigint

		if (client.simulateContract && received.to) {
			// Try contract simulation first if available
			try {
				const result = await client.simulateContract({
					address: received.to,
					...received,
				})
				actualGas = result.gas || result.gasUsed || 0n
			} catch {
				// Fall back to call if simulateContract fails
				if (client.call) {
					const result = await client.call(received)
					actualGas = result.gas || result.gasUsed || 0n
				} else {
					throw new Error('Client does not support gas estimation')
				}
			}
		} else if (client.call) {
			const result = await client.call(received)
			actualGas = result.gas || result.gasUsed || 0n
		} else {
			throw new Error('Client does not support gas estimation')
		}

		// Compare gas consumption based on comparison type
		let pass: boolean
		let comparisonText: string

		switch (comparison) {
			case 'equal':
				pass = actualGas === expectedGas
				comparisonText = 'exactly'
				break
			case 'lessThan':
				pass = actualGas < expectedGas
				comparisonText = 'less than'
				break
			case 'greaterThan':
				pass = actualGas > expectedGas
				comparisonText = 'greater than'
				break
			default:
				throw new Error(`Unknown comparison type: ${comparison}`)
		}

		return {
			pass,
			message: () => {
				if (pass) {
					return `Expected transaction NOT to consume ${comparisonText} ${expectedGas} gas`
				}
				return `Expected transaction to consume ${comparisonText} ${expectedGas} gas, but it consumed ${actualGas} gas`
			},
		}
	} catch (error) {
		return {
			pass: false,
			message: () => `Error estimating gas consumption: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}

/**
 * Convenience function for testing gas consumption less than expected
 */
export async function toConsumeGasLessThan(
	received: TransactionLike,
	client: TevmClient,
	expectedGas: bigint,
): Promise<{ pass: boolean; message: () => string }> {
	return toConsumeGas(received, client, expectedGas, 'lessThan')
}

/**
 * Convenience function for testing gas consumption greater than expected
 */
export async function toConsumeGasGreaterThan(
	received: TransactionLike,
	client: TevmClient,
	expectedGas: bigint,
): Promise<{ pass: boolean; message: () => string }> {
	return toConsumeGas(received, client, expectedGas, 'greaterThan')
}
