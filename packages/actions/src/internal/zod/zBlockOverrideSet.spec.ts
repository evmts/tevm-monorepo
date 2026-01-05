import { describe, expect, it } from 'vitest'
import { zBlockOverrideSet } from './zBlockOverrideSet.js'

describe('zBlockOverrideSet', () => {
	describe('valid inputs', () => {
		it('should accept empty object', () => {
			const result = zBlockOverrideSet.parse({})
			expect(result).toEqual({})
		})

		it('should accept number override', () => {
			const result = zBlockOverrideSet.parse({ number: 100n })
			expect(result).toEqual({ number: 100n })
		})

		it('should accept time override', () => {
			const result = zBlockOverrideSet.parse({ time: 1704067200n })
			expect(result).toEqual({ time: 1704067200n })
		})

		it('should accept gasLimit override', () => {
			const result = zBlockOverrideSet.parse({ gasLimit: 30000000n })
			expect(result).toEqual({ gasLimit: 30000000n })
		})

		it('should accept coinbase override', () => {
			const result = zBlockOverrideSet.parse({
				coinbase: '0x1234567890123456789012345678901234567890',
			})
			expect(result).toEqual({
				coinbase: '0x1234567890123456789012345678901234567890',
			})
		})

		it('should accept baseFee override', () => {
			const result = zBlockOverrideSet.parse({ baseFee: 1000000000n })
			expect(result).toEqual({ baseFee: 1000000000n })
		})

		it('should accept blobBaseFee override', () => {
			const result = zBlockOverrideSet.parse({ blobBaseFee: 100000n })
			expect(result).toEqual({ blobBaseFee: 100000n })
		})

		it('should accept all overrides together', () => {
			const result = zBlockOverrideSet.parse({
				number: 100n,
				time: 1704067200n,
				gasLimit: 30000000n,
				coinbase: '0x1234567890123456789012345678901234567890',
				baseFee: 1000000000n,
				blobBaseFee: 100000n,
			})
			expect(result).toEqual({
				number: 100n,
				time: 1704067200n,
				gasLimit: 30000000n,
				coinbase: '0x1234567890123456789012345678901234567890',
				baseFee: 1000000000n,
				blobBaseFee: 100000n,
			})
		})

		it('should accept zero values', () => {
			const result = zBlockOverrideSet.parse({
				number: 0n,
				time: 0n,
				gasLimit: 0n,
				baseFee: 0n,
				blobBaseFee: 0n,
			})
			expect(result).toEqual({
				number: 0n,
				time: 0n,
				gasLimit: 0n,
				baseFee: 0n,
				blobBaseFee: 0n,
			})
		})
	})

	describe('invalid inputs', () => {
		it('should reject negative number', () => {
			expect(() => zBlockOverrideSet.parse({ number: -1n })).toThrow()
		})

		it('should reject negative time', () => {
			expect(() => zBlockOverrideSet.parse({ time: -1n })).toThrow()
		})

		it('should reject negative gasLimit', () => {
			expect(() => zBlockOverrideSet.parse({ gasLimit: -1n })).toThrow()
		})

		it('should reject negative baseFee', () => {
			expect(() => zBlockOverrideSet.parse({ baseFee: -1n })).toThrow()
		})

		it('should reject negative blobBaseFee', () => {
			expect(() => zBlockOverrideSet.parse({ blobBaseFee: -1n })).toThrow()
		})

		it('should reject invalid coinbase address', () => {
			expect(() => zBlockOverrideSet.parse({ coinbase: 'not-an-address' })).toThrow()
		})

		it('should reject unknown properties (strict object)', () => {
			expect(() => zBlockOverrideSet.parse({ unknownProp: 'value' })).toThrow()
		})

		it('should reject null', () => {
			expect(() => zBlockOverrideSet.parse(null)).toThrow()
		})

		it('should reject non-bigint number values', () => {
			expect(() => zBlockOverrideSet.parse({ number: 100 })).toThrow()
		})
	})
})
