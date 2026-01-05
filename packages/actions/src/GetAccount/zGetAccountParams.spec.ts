import { describe, expect, it } from 'vitest'
import { zGetAccountParams } from './zGetAccountParams.js'

describe('zGetAccountParams', () => {
	const validAddress = '0x1234567890123456789012345678901234567890'

	describe('valid inputs', () => {
		it('should accept address only', () => {
			const result = zGetAccountParams.parse({ address: validAddress })
			expect(result).toEqual({ address: validAddress })
		})

		it('should accept address with blockTag "latest"', () => {
			const result = zGetAccountParams.parse({
				address: validAddress,
				blockTag: 'latest',
			})
			expect(result).toEqual({ address: validAddress, blockTag: 'latest' })
		})

		it('should accept address with blockTag "pending"', () => {
			const result = zGetAccountParams.parse({
				address: validAddress,
				blockTag: 'pending',
			})
			expect(result).toEqual({ address: validAddress, blockTag: 'pending' })
		})

		it('should accept address with blockTag "earliest"', () => {
			const result = zGetAccountParams.parse({
				address: validAddress,
				blockTag: 'earliest',
			})
			expect(result).toEqual({ address: validAddress, blockTag: 'earliest' })
		})

		it('should accept address with bigint block number', () => {
			const result = zGetAccountParams.parse({
				address: validAddress,
				blockTag: 100n,
			})
			expect(result).toEqual({ address: validAddress, blockTag: 100n })
		})

		it('should accept address with hex block number', () => {
			const result = zGetAccountParams.parse({
				address: validAddress,
				blockTag: '0x64',
			})
			expect(result).toEqual({ address: validAddress, blockTag: '0x64' })
		})

		it('should accept returnStorage: true', () => {
			const result = zGetAccountParams.parse({
				address: validAddress,
				returnStorage: true,
			})
			expect(result).toEqual({ address: validAddress, returnStorage: true })
		})

		it('should accept returnStorage: false', () => {
			const result = zGetAccountParams.parse({
				address: validAddress,
				returnStorage: false,
			})
			expect(result).toEqual({ address: validAddress, returnStorage: false })
		})

		it('should accept all parameters together', () => {
			const result = zGetAccountParams.parse({
				address: validAddress,
				blockTag: 'latest',
				returnStorage: true,
				throwOnFail: true,
			})
			expect(result).toEqual({
				address: validAddress,
				blockTag: 'latest',
				returnStorage: true,
				throwOnFail: true,
			})
		})

		it('should inherit throwOnFail from zBaseParams', () => {
			const result = zGetAccountParams.parse({
				address: validAddress,
				throwOnFail: false,
			})
			expect(result).toEqual({ address: validAddress, throwOnFail: false })
		})
	})

	describe('invalid inputs', () => {
		it('should reject missing address', () => {
			expect(() => zGetAccountParams.parse({})).toThrow()
		})

		it('should reject invalid address', () => {
			expect(() => zGetAccountParams.parse({ address: 'not-an-address' })).toThrow()
		})

		it('should reject invalid blockTag', () => {
			expect(() =>
				zGetAccountParams.parse({
					address: validAddress,
					blockTag: 'invalid',
				}),
			).toThrow()
		})

		it('should reject non-boolean returnStorage', () => {
			expect(() =>
				zGetAccountParams.parse({
					address: validAddress,
					returnStorage: 'true',
				}),
			).toThrow()
		})

		it('should reject null', () => {
			expect(() => zGetAccountParams.parse(null)).toThrow()
		})

		it('should reject undefined', () => {
			expect(() => zGetAccountParams.parse(undefined)).toThrow()
		})
	})

	describe('schema properties', () => {
		it('should have a description', () => {
			expect(zGetAccountParams.description).toBe('Params to create an account or contract')
		})
	})
})
