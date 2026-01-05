import { describe, expect, it } from 'vitest'
import { errorMsg } from './errorMessage.js'

describe('errorMsg', () => {
	it('should format error message with block and tx errorStr methods', () => {
		const block = {
			errorStr: () => 'block[number=123 hash=0xabc...]',
		}
		const tx = {
			errorStr: () => 'tx[hash=0xdef... nonce=5]',
		}

		const result = errorMsg('Transaction failed', block as any, tx as any)

		expect(result).toBe('Transaction failed -> block[number=123 hash=0xabc...] -> tx[hash=0xdef... nonce=5])')
	})

	it('should use "block" when block has no errorStr method', () => {
		const block = { number: 123n }
		const tx = {
			errorStr: () => 'tx[hash=0xdef...]',
		}

		const result = errorMsg('Validation error', block as any, tx as any)

		expect(result).toBe('Validation error -> block -> tx[hash=0xdef...])')
	})

	it('should use "tx" when tx has no errorStr method', () => {
		const block = {
			errorStr: () => 'block[number=456]',
		}
		const tx = { nonce: 10n }

		const result = errorMsg('Execution error', block as any, tx as any)

		expect(result).toBe('Execution error -> block[number=456] -> tx)')
	})

	it('should use "block" and "tx" when neither has errorStr method', () => {
		const block = { number: 789n }
		const tx = { nonce: 15n }

		const result = errorMsg('Unknown error', block as any, tx as any)

		expect(result).toBe('Unknown error -> block -> tx)')
	})

	it('should handle empty message', () => {
		const block = {
			errorStr: () => 'block[number=1]',
		}
		const tx = {
			errorStr: () => 'tx[hash=0x123]',
		}

		const result = errorMsg('', block as any, tx as any)

		expect(result).toBe(' -> block[number=1] -> tx[hash=0x123])')
	})

	it('should handle complex error messages', () => {
		const block = {
			errorStr: () => 'block[number=1000 baseFeePerGas=1000000000]',
		}
		const tx = {
			errorStr: () => 'tx[type=2 maxFeePerGas=50000000000 to=0x1234...]',
		}

		const result = errorMsg(
			'EIP-1559 transaction has insufficient gas: maxFeePerGas < baseFee',
			block as any,
			tx as any,
		)

		expect(result).toBe(
			'EIP-1559 transaction has insufficient gas: maxFeePerGas < baseFee -> block[number=1000 baseFeePerGas=1000000000] -> tx[type=2 maxFeePerGas=50000000000 to=0x1234...])',
		)
	})
})
