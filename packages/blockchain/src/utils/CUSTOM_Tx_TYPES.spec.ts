import { describe, it, expect } from 'vitest'
import { customTxTypes } from './CUSTOM_Tx_TYPES.js'

describe('customTxTypes', () => {
	it('should be an array', () => {
		expect(Array.isArray(customTxTypes)).toBe(true)
	})

	it('should have 8 custom transaction types', () => {
		// 1 EIP-7702, 1 Optimism, 6 Arbitrum = 8 total
		expect(customTxTypes).toHaveLength(8)
	})

	it('should include EIP-7702 EOA Code tx type (0x4)', () => {
		expect(customTxTypes).toContain('0x4')
	})

	it('should include Optimism deposit tx type (0x7e)', () => {
		// Optimism uses type 0x7e (126 in decimal) for deposit transactions
		// These are L1 -> L2 bridge deposits
		expect(customTxTypes).toContain('0x7e')
	})

	describe('Arbitrum transaction types', () => {
		it('should include ArbitrumDepositTxType (0x6a)', () => {
			expect(customTxTypes).toContain('0x6a')
		})

		it('should include ArbitrumUnsignedTxType (0x6b)', () => {
			expect(customTxTypes).toContain('0x6b')
		})

		it('should include ArbitrumContractTxType (0x6c)', () => {
			expect(customTxTypes).toContain('0x6c')
		})

		it('should include ArbitrumRetryTxType (0x6d)', () => {
			expect(customTxTypes).toContain('0x6d')
		})

		it('should include ArbitrumSubmitRetryableTxType (0x6e)', () => {
			expect(customTxTypes).toContain('0x6e')
		})

		it('should include ArbitrumInternalTxType (0x6f)', () => {
			expect(customTxTypes).toContain('0x6f')
		})
	})

	it('should have all values as lowercase hex strings', () => {
		for (const txType of customTxTypes) {
			expect(txType).toMatch(/^0x[a-f0-9]+$/i)
		}
	})

	it('should have Arbitrum types in the 0x6a-0x6f range', () => {
		const arbitrumTypes = customTxTypes.filter((t) => {
			const num = parseInt(t, 16)
			return num >= 0x6a && num <= 0x6f
		})
		expect(arbitrumTypes).toHaveLength(6)
	})

	it('should not include standard Ethereum transaction types', () => {
		// Standard Ethereum types: 0x0 (legacy), 0x1 (EIP-2930), 0x2 (EIP-1559), 0x3 (EIP-4844)
		expect(customTxTypes).not.toContain('0x0')
		expect(customTxTypes).not.toContain('0x1')
		expect(customTxTypes).not.toContain('0x2')
		expect(customTxTypes).not.toContain('0x3')
	})

	it('should be usable for type checking', () => {
		// Example use case: checking if a transaction type is L2-specific
		const isL2TxType = (type: string) => customTxTypes.includes(type)

		// L2 types should return true
		expect(isL2TxType('0x7e')).toBe(true) // Optimism deposit
		expect(isL2TxType('0x6a')).toBe(true) // Arbitrum deposit

		// Standard types should return false
		expect(isL2TxType('0x0')).toBe(false) // Legacy
		expect(isL2TxType('0x2')).toBe(false) // EIP-1559
		expect(isL2TxType('0x3')).toBe(false) // EIP-4844 blob
	})
})
