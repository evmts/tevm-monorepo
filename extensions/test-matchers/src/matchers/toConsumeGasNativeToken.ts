/**
 * @fileoverview toConsumeGasNativeToken matcher for testing gas consumption in native token units
 */

import type { GasComparison, TevmClient, TransactionLike } from '../types/index.js'

/**
 * Asserts that a transaction consumes a specific amount of gas in native token units
 *
 * @param received - Transaction object to simulate
 * @param client - Tevm client to simulate transaction
 * @param expectedGasValue - Expected gas consumption in native token units (wei)
 * @param comparison - Comparison type ('equal', 'lessThan', 'greaterThan')
 * @returns Promise<{pass: boolean, message: () => string}>
 *
 * @example
 * ```typescript
 * import { expect } from 'vitest'
 * import { toConsumeGasNativeToken } from '@tevm/test-matchers'
 *
 * // Test exact gas consumption in wei
 * await expect(transaction).toConsumeGasNativeToken(client, 21000000000000000n) // 21000 gas * 1 gwei
 *
 * // Test gas consumption less than
 * await expect(transaction).toConsumeGasNativeToken(client, 50000000000000000n, 'lessThan')
 *
 * // Test gas consumption greater than
 * await expect(transaction).toConsumeGasNativeToken(client, 20000000000000000n, 'greaterThan')
 * ```
 */
export async function toConsumeGasNativeToken(
	received: TransactionLike,
	client: TevmClient,
	expectedGasValue: bigint,
	comparison: GasComparison = 'equal',
): Promise<{ pass: boolean; message: () => string }> {
	try {
		// Estimate gas for the transaction
		let actualGas: bigint
		let gasPrice: bigint

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

		// Determine gas price from transaction or use default
		if (received.gasPrice) {
			gasPrice = received.gasPrice
		} else if (received.maxFeePerGas) {
			gasPrice = received.maxFeePerGas
		} else {
			// Default to 1 gwei if no gas price specified
			gasPrice = 1000000000n
		}

		// Calculate actual gas cost in native token units
		const actualGasValue = actualGas * gasPrice

		// Compare gas consumption based on comparison type
		let pass: boolean
		let comparisonText: string

		switch (comparison) {
			case 'equal':
				pass = actualGasValue === expectedGasValue
				comparisonText = 'exactly'
				break
			case 'lessThan':
				pass = actualGasValue < expectedGasValue
				comparisonText = 'less than'
				break
			case 'greaterThan':
				pass = actualGasValue > expectedGasValue
				comparisonText = 'greater than'
				break
			default:
				throw new Error(`Unknown comparison type: ${comparison}`)
		}

		return {
			pass,
			message: () => {
				if (pass) {
					return `Expected transaction NOT to consume ${comparisonText} ${expectedGasValue} wei in gas`
				}
				return `Expected transaction to consume ${comparisonText} ${expectedGasValue} wei in gas, but it consumed ${actualGasValue} wei (${actualGas} gas * ${gasPrice} gas price)`
			},
		}
	} catch (error) {
		return {
			pass: false,
			message: () =>
				`Error estimating gas consumption in native token: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}

/**
 * Convenience function for testing gas consumption in native token less than expected
 */
export async function toConsumeGasNativeTokenLessThan(
	received: TransactionLike,
	client: TevmClient,
	expectedGasValue: bigint,
): Promise<{ pass: boolean; message: () => string }> {
	return toConsumeGasNativeToken(received, client, expectedGasValue, 'lessThan')
}

/**
 * Convenience function for testing gas consumption in native token greater than expected
 */
export async function toConsumeGasNativeTokenGreaterThan(
	received: TransactionLike,
	client: TevmClient,
	expectedGasValue: bigint,
): Promise<{ pass: boolean; message: () => string }> {
	return toConsumeGasNativeToken(received, client, expectedGasValue, 'greaterThan')
}
