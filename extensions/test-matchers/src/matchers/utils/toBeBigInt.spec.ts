import { describe, expect, it } from 'vitest'

describe('toBeBigInt', () => {
	const bigints = [BigInt(42), 123n, BigInt(0), BigInt('999999999999999999999')]

	const nonBigints = [42, '42', null, undefined, {}, []]

	it('should pass for BigInt values', () => {
		bigints.forEach((bigint) => expect(bigint).toBeBigInt())
	})

	it('should fail for non-BigInt values', () => {
		nonBigints.forEach((nonBigint) => expect(() => expect(nonBigint).toBeBigInt()).toThrow())
	})

	it('should work with .not modifier', () => {
		nonBigints.forEach((nonBigint) => expect(nonBigint).not.toBeBigInt())
		bigints.forEach((bigint) => expect(() => expect(bigint).not.toBeBigInt()).toThrow())
	})

	it('should provide helpful error messages', () => {
		try {
			expect(42).toBeBigInt()
		} catch (error: any) {
			expect(error.message).toBe('Expected 42 to be a BigInt')
			expect(error.actual).toBe(42)
		}

		try {
			expect('hello').toBeBigInt()
		} catch (error: any) {
			expect(error.message).toBe('Expected hello to be a BigInt')
			expect(error.actual).toBe('hello')
		}
	})
})
