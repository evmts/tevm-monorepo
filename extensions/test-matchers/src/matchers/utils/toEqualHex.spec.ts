import type { Hex } from '@tevm/utils'
import { describe, expect, it } from 'vitest'

describe('toEqualHex', () => {
	const validHexPairs: [Hex, Hex][] = [
		// Same hex - different cases
		['0x1234abcd', '0x1234ABCD'],
		['0xdeadbeef', '0xDEADBEEF'],
		['0x0', '0x00'],
		['0x', '0x'],
		// Transaction hashes (same value, different case)
		[
			'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
			'0x1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF',
		],
		// Function selectors
		['0xa9059cbb', '0xA9059CBB'], // transfer(address,uint256)
		// Addresses (should work too since they're just hex)
		['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC', '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac'],
		// Leading zeros (normalized by default)
		['0x000123', '0x123'],
		['0x0000000000000001', '0x1'],
	]

	const differentHexPairs: [Hex, Hex][] = [
		['0x1234abcd', '0x1234abce'],
		['0xdeadbeef', '0xdeadbeee'],
		['0x0', '0x1'],
		['0x123', '0x124'],
		['0x1234567890abcdef', '0x1234567890abcdee'],
	]

	const invalidHexPairs: [Hex | string, Hex | string][] = [
		['0x123g', '0x1234'], // invalid hex char
		['0x1234', '0x123g'], // invalid hex char
		['invalid', '0x1234'], // completely invalid
		['0x1234', 'invalid'], // completely invalid
		['123', '0x1234'], // missing 0x prefix
		['0x1234', '123'], // missing 0x prefix
	]

	const normalizedPairs: [Hex, Hex][] = [
		// These should be equal with default (normalized) comparison
		['0x0', '0x00'],
		['0x000123', '0x123'],
		['0x0000000000000001', '0x1'],
		['0x00000000', '0x0'],
		['0x000abc', '0xabc'],
		['0x000000000000000000000000000000000000000000000000000000000000001a', '0x1a'],
	]

	const exactMismatchPairs: [Hex, Hex][] = [
		// These should NOT be equal with exact comparison but ARE equal with normalized
		['0x0', '0x00'],
		['0x000123', '0x123'],
		['0x0000000000000001', '0x1'],
		['0x00000000', '0x0'],
		['0x000abc', '0xabc'],
	]

	it('should pass when comparing equal hex (default normalized mode)', () => {
		validHexPairs.forEach(([hex1, hex2]) => {
			expect(hex1).toEqualHex(hex2)
		})
	})

	it('should fail when comparing different hex', () => {
		differentHexPairs.forEach(([hex1, hex2]) => {
			expect(() => expect(hex1).toEqualHex(hex2)).toThrow()
		})
	})

	it('should fail when comparing invalid hex', () => {
		invalidHexPairs.forEach(([hex1, hex2]) => {
			expect(() => expect(hex1).toEqualHex(hex2)).toThrow()
		})
	})

	describe('normalized comparison (default behavior)', () => {
		it('should normalize leading zeros by default', () => {
			normalizedPairs.forEach(([hex1, hex2]) => {
				expect(hex1).toEqualHex(hex2)
				expect(hex2).toEqualHex(hex1)
			})
		})

		it('should normalize leading zeros with explicit exact: false', () => {
			normalizedPairs.forEach(([hex1, hex2]) => {
				expect(hex1).toEqualHex(hex2, { exact: false })
				expect(hex2).toEqualHex(hex1, { exact: false })
			})
		})
	})

	describe('exact comparison mode', () => {
		it('should require exact match including leading zeros when exact: true', () => {
			exactMismatchPairs.forEach(([hex1, hex2]) => {
				expect(() => expect(hex1).toEqualHex(hex2, { exact: true })).toThrow()
				expect(() => expect(hex2).toEqualHex(hex1, { exact: true })).toThrow()
			})
		})

		it('should pass when hex strings are exactly the same', () => {
			const exactMatchPairs = [
				['0x1234abcd', '0x1234abcd'],
				['0x000123', '0x000123'],
				['0x0', '0x0'],
				['0x00', '0x00'],
				['0x', '0x'],
				['0x1234ABCD', '0x1234ABCD'], // same case
			]

			exactMatchPairs.forEach(([hex1, hex2]) => {
				expect(hex1).toEqualHex(hex2, { exact: true })
			})
		})

		it('should still handle case differences in exact mode', () => {
			const caseDifferentPairs = [
				['0x1234abcd', '0x1234ABCD'],
				['0xdeadbeef', '0xDEADBEEF'],
				['0x000abc', '0x000ABC'],
			]

			caseDifferentPairs.forEach(([hex1, hex2]) => {
				expect(hex1).toEqualHex(hex2, { exact: true })
			})
		})
	})

	it('should work with .not', () => {
		differentHexPairs.forEach(([hex1, hex2]) => {
			expect(hex1).not.toEqualHex(hex2)
		})
		validHexPairs.forEach(([hex1, hex2]) => {
			expect(() => expect(hex1).not.toEqualHex(hex2)).toThrow()
		})

		// Test .not with exact mode
		exactMismatchPairs.forEach(([hex1, hex2]) => {
			expect(hex1).not.toEqualHex(hex2, { exact: true })
		})
	})

	it('should provide helpful error messages', () => {
		try {
			expect('0x1234abcd').toEqualHex('0x1234abce')
		} catch (error: any) {
			expect(error.message).toBe('Expected hex strings to be equal (normalized comparison)')
			expect(error.actual).toBe('0x1234abcd')
			expect(error.expected).toBe('0x1234abce')
		}

		try {
			expect('0x123g').toEqualHex('0x1234')
		} catch (error: any) {
			expect(error.message).toBe('Expected 0x123g to be a valid hex string')
			expect(error.actual).toBe('0x123g')
			expect(error.expected).toBe('0x1234')
		}

		try {
			expect('0x000123').toEqualHex('0x123', { exact: true })
		} catch (error: any) {
			expect(error.message).toBe('Expected hex strings to be equal (exact match)')
			expect(error.actual).toBe('0x000123')
			expect(error.expected).toBe('0x123')
		}
	})

	it('should work with real-world examples', () => {
		// Transaction hash comparison
		const txHash1 = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
		const txHash2 = '0x1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF'
		expect(txHash1).toEqualHex(txHash2)
		expect(txHash1).toEqualHex(txHash2, { exact: true }) // same length, just case difference

		// Function selector comparison
		const selector1 = '0xa9059cbb' // transfer(address,uint256)
		const selector2 = '0xA9059CBB'
		expect(selector1).toEqualHex(selector2)
		expect(selector1).toEqualHex(selector2, { exact: true })

		// Contract address comparison
		const addr1 = '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'
		const addr2 = '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac'
		expect(addr1).toEqualHex(addr2)
		expect(addr1).toEqualHex(addr2, { exact: true })

		// Leading zero scenarios
		const paddedValue = '0x0000000000000000000000000000000000000000000000000000000000000001'
		const trimmedValue = '0x1'
		expect(paddedValue).toEqualHex(trimmedValue) // normalized (default)
		expect(() => expect(paddedValue).toEqualHex(trimmedValue, { exact: true })).toThrow() // exact mode fails
	})

	it('should handle edge cases', () => {
		// Empty hex
		expect('0x').toEqualHex('0x')
		expect('0x').toEqualHex('0x', { exact: true })

		// Single byte
		expect('0x12').toEqualHex('0x12')
		expect('0x12').toEqualHex('0x12', { exact: true })

		// Zero values with different representations
		expect('0x0').toEqualHex('0x00') // normalized
		expect('0x0000').toEqualHex('0x00') // normalized
		expect(() => expect('0x0').toEqualHex('0x00', { exact: true })).toThrow() // exact fails
		expect(() => expect('0x0000').toEqualHex('0x00', { exact: true })).toThrow() // exact fails
	})
})
