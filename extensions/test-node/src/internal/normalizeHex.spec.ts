import type { Hex } from 'viem'
import { describe, expect, it } from 'vitest'
import { normalizeHex } from './normalizeHex.js'

describe('normalizeHex', () => {
	it('should convert uppercase hex to lowercase', () => {
		const hex = '0xABCDEF123456' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0xabcdef123456')
	})

	it('should keep lowercase hex unchanged', () => {
		const hex = '0xabcdef123456' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0xabcdef123456')
	})

	it('should handle mixed case hex', () => {
		const hex = '0xAbCdEf123456' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0xabcdef123456')
	})

	it('should handle short hex values', () => {
		const hex = '0x1' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0x1')
	})

	it('should handle zero value', () => {
		const hex = '0x0' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0x0')
	})

	it('should handle empty hex', () => {
		const hex = '0x' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0x')
	})

	it('should return "0x" for null input', () => {
		const result = normalizeHex(null)
		expect(result).toBe('0x')
	})

	it('should return "0x" for undefined input', () => {
		const result = normalizeHex(undefined)
		expect(result).toBe('0x')
	})

	it('should handle long hex addresses', () => {
		const hex = '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0x742d35cc6634c0532925a3b844bc9e7595f93b7a')
	})

	it('should handle transaction hashes', () => {
		const hex = '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b')
	})

	it('should handle block hashes', () => {
		const hex = '0xB3B20624F8F0F86EB50DD04688409E5CEA4BD02D700BF6E79E9384D47D6A5A35' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35')
	})

	it('should handle data with alphanumeric characters', () => {
		const hex = '0xCAFEBABE123456789ABCDEF' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0xcafebabe123456789abcdef')
	})

	it('should handle numeric-only hex', () => {
		const hex = '0x123456789' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0x123456789')
	})

	it('should handle alpha-only hex', () => {
		const hex = '0xABCDEF' as Hex
		const result = normalizeHex(hex)
		expect(result).toBe('0xabcdef')
	})
})
