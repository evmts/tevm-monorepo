import { describe, expect, it } from 'vitest'
import { zBlockParam } from './zBlockParam.js'

describe('zBlockParam', () => {
	describe('string block tags', () => {
		it('should accept "latest"', () => {
			expect(zBlockParam.parse('latest')).toBe('latest')
		})

		it('should accept "earliest"', () => {
			expect(zBlockParam.parse('earliest')).toBe('earliest')
		})

		it('should accept "pending"', () => {
			expect(zBlockParam.parse('pending')).toBe('pending')
		})

		it('should accept "safe"', () => {
			expect(zBlockParam.parse('safe')).toBe('safe')
		})

		it('should accept "finalized"', () => {
			expect(zBlockParam.parse('finalized')).toBe('finalized')
		})
	})

	describe('bigint block numbers', () => {
		it('should accept bigint 0', () => {
			expect(zBlockParam.parse(0n)).toBe(0n)
		})

		it('should accept bigint block numbers', () => {
			expect(zBlockParam.parse(1234567n)).toBe(1234567n)
		})

		it('should accept large bigint block numbers', () => {
			const largeBlock = 99999999999999n
			expect(zBlockParam.parse(largeBlock)).toBe(largeBlock)
		})
	})

	describe('number block numbers (transforms to bigint)', () => {
		it('should transform number 0 to bigint', () => {
			expect(zBlockParam.parse(0)).toBe(0n)
		})

		it('should transform positive number to bigint', () => {
			expect(zBlockParam.parse(1234567)).toBe(1234567n)
		})
	})

	describe('hex block numbers', () => {
		it('should accept hex block number 0x0', () => {
			expect(zBlockParam.parse('0x0')).toBe('0x0')
		})

		it('should accept hex block number', () => {
			expect(zBlockParam.parse('0x12d687')).toBe('0x12d687')
		})

		it('should accept uppercase hex', () => {
			expect(zBlockParam.parse('0xABCDEF')).toBe('0xABCDEF')
		})

		it('should accept mixed case hex', () => {
			expect(zBlockParam.parse('0xAbCdEf')).toBe('0xAbCdEf')
		})
	})

	describe('invalid values', () => {
		it('should reject invalid string tags', () => {
			expect(() => zBlockParam.parse('invalid')).toThrow()
		})

		it('should reject empty string', () => {
			expect(() => zBlockParam.parse('')).toThrow()
		})

		it('should reject null', () => {
			expect(() => zBlockParam.parse(null)).toThrow()
		})

		it('should reject undefined', () => {
			expect(() => zBlockParam.parse(undefined)).toThrow()
		})

		it('should reject objects', () => {
			expect(() => zBlockParam.parse({ block: 'latest' })).toThrow()
		})

		it('should reject arrays', () => {
			expect(() => zBlockParam.parse([1, 2, 3])).toThrow()
		})
	})
})
