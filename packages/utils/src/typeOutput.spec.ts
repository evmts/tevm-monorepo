import { describe, expect, it } from 'vitest'
import { TypeOutput, toType } from './typeOutput.js'

describe('TypeOutput', () => {
	it('should have the correct enum values', () => {
		expect(TypeOutput.Number).toBe(0)
		expect(TypeOutput.BigInt).toBe(1)
		expect(TypeOutput.Uint8Array).toBe(2)
		expect(TypeOutput.PrefixedHexString).toBe(3)
	})
})

describe('toType', () => {
	describe('null and undefined handling', () => {
		it('should return null when input is null', () => {
			expect(toType(null, TypeOutput.BigInt)).toBe(null)
			expect(toType(null, TypeOutput.Number)).toBe(null)
			expect(toType(null, TypeOutput.Uint8Array)).toBe(null)
			expect(toType(null, TypeOutput.PrefixedHexString)).toBe(null)
		})

		it('should return undefined when input is undefined', () => {
			expect(toType(undefined, TypeOutput.BigInt)).toBe(undefined)
			expect(toType(undefined, TypeOutput.Number)).toBe(undefined)
			expect(toType(undefined, TypeOutput.Uint8Array)).toBe(undefined)
			expect(toType(undefined, TypeOutput.PrefixedHexString)).toBe(undefined)
		})
	})

	describe('BigInt output', () => {
		it('should convert hex string to BigInt', () => {
			expect(toType('0x5208', TypeOutput.BigInt)).toBe(21000n)
			expect(toType('0x1', TypeOutput.BigInt)).toBe(1n)
			expect(toType('0x0', TypeOutput.BigInt)).toBe(0n)
			expect(toType('0x', TypeOutput.BigInt)).toBe(0n)
		})

		it('should convert number to BigInt', () => {
			expect(toType(21000, TypeOutput.BigInt)).toBe(21000n)
			expect(toType(0, TypeOutput.BigInt)).toBe(0n)
			expect(toType(1, TypeOutput.BigInt)).toBe(1n)
		})

		it('should convert bigint to BigInt', () => {
			expect(toType(21000n, TypeOutput.BigInt)).toBe(21000n)
			expect(toType(0n, TypeOutput.BigInt)).toBe(0n)
		})

		it('should convert Uint8Array to BigInt', () => {
			expect(toType(new Uint8Array([0x52, 0x08]), TypeOutput.BigInt)).toBe(21000n)
			expect(toType(new Uint8Array([0]), TypeOutput.BigInt)).toBe(0n)
			expect(toType(new Uint8Array([1]), TypeOutput.BigInt)).toBe(1n)
		})
	})

	describe('Number output', () => {
		it('should convert hex string to Number', () => {
			expect(toType('0x5208', TypeOutput.Number)).toBe(21000)
			expect(toType('0x1', TypeOutput.Number)).toBe(1)
			expect(toType('0x0', TypeOutput.Number)).toBe(0)
		})

		it('should convert number to Number', () => {
			expect(toType(21000, TypeOutput.Number)).toBe(21000)
			expect(toType(0, TypeOutput.Number)).toBe(0)
		})

		it('should convert bigint to Number', () => {
			expect(toType(21000n, TypeOutput.Number)).toBe(21000)
		})

		it('should throw for values exceeding MAX_SAFE_INTEGER', () => {
			const unsafeValue = '0x' + 'ffffffffffffffff' // 18446744073709551615
			expect(() => toType(unsafeValue, TypeOutput.Number)).toThrow(
				'The provided number is greater than MAX_SAFE_INTEGER',
			)
		})
	})

	describe('Uint8Array output', () => {
		it('should convert hex string to Uint8Array', () => {
			const result = toType('0x5208', TypeOutput.Uint8Array)
			expect(result).toEqual(new Uint8Array([0x52, 0x08]))
		})

		it('should convert number to Uint8Array', () => {
			const result = toType(21000, TypeOutput.Uint8Array)
			expect(result).toEqual(new Uint8Array([0x52, 0x08]))
		})

		it('should convert bigint to Uint8Array', () => {
			const result = toType(21000n, TypeOutput.Uint8Array)
			expect(result).toEqual(new Uint8Array([0x52, 0x08]))
		})

		it('should pass through Uint8Array', () => {
			const input = new Uint8Array([0x52, 0x08])
			const result = toType(input, TypeOutput.Uint8Array)
			expect(result).toEqual(input)
		})
	})

	describe('PrefixedHexString output', () => {
		it('should convert Uint8Array to hex string', () => {
			expect(toType(new Uint8Array([0x52, 0x08]), TypeOutput.PrefixedHexString)).toBe('0x5208')
			expect(toType(new Uint8Array([0]), TypeOutput.PrefixedHexString)).toBe('0x00')
		})

		it('should convert number to hex string', () => {
			expect(toType(21000, TypeOutput.PrefixedHexString)).toBe('0x5208')
			expect(toType(0, TypeOutput.PrefixedHexString)).toBe('0x00')
		})

		it('should convert bigint to hex string', () => {
			expect(toType(21000n, TypeOutput.PrefixedHexString)).toBe('0x5208')
		})

		it('should pass through hex string', () => {
			expect(toType('0x5208', TypeOutput.PrefixedHexString)).toBe('0x5208')
		})
	})

	describe('error handling', () => {
		it('should throw for non-prefixed hex string', () => {
			expect(() => toType('5208', TypeOutput.BigInt)).toThrow('A string must be provided with a 0x-prefix')
			expect(() => toType('hello', TypeOutput.BigInt)).toThrow('A string must be provided with a 0x-prefix')
		})

		it('should throw for unsafe integer input', () => {
			const unsafeInt = Number.MAX_SAFE_INTEGER + 1
			expect(() => toType(unsafeInt, TypeOutput.BigInt)).toThrow(
				'The provided number is greater than MAX_SAFE_INTEGER',
			)
		})

		it('should throw for unknown output type', () => {
			// @ts-expect-error - testing invalid input
			expect(() => toType('0x1', 999)).toThrow('unknown outputType')
		})
	})

	describe('edge cases', () => {
		it('should handle Address-like objects with .bytes property', () => {
			// Test objects that have a .bytes property (like Address objects)
			const addressLike = {
				bytes: new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x12, 0x34, 0x56, 0x78]),
			}

			// Should extract .bytes and convert
			const resultUint8Array = toType(addressLike as any, TypeOutput.Uint8Array)
			expect(resultUint8Array).toEqual(addressLike.bytes)

			const resultHex = toType(addressLike as any, TypeOutput.PrefixedHexString)
			expect(resultHex).toBe('0x123456789abcdef0123456789abcdef012345678')

			const resultBigInt = toType(addressLike as any, TypeOutput.BigInt)
			expect(resultBigInt).toBe(0x123456789abcdef0123456789abcdef012345678n)
		})

		it('should handle empty hex string', () => {
			expect(toType('0x', TypeOutput.BigInt)).toBe(0n)
			expect(toType('0x', TypeOutput.Number)).toBe(0)
			expect(toType('0x', TypeOutput.PrefixedHexString)).toBe('0x') // matches ethereumjs behavior
		})

		it('should handle zero values', () => {
			expect(toType(0, TypeOutput.BigInt)).toBe(0n)
			expect(toType(0n, TypeOutput.BigInt)).toBe(0n)
			expect(toType('0x0', TypeOutput.BigInt)).toBe(0n)
			expect(toType(new Uint8Array([0]), TypeOutput.BigInt)).toBe(0n)
		})

		it('should handle large hex values', () => {
			const largeHex = '0xffffffffffffffffffffffffffffffff' // 128-bit max
			const result = toType(largeHex, TypeOutput.BigInt)
			expect(result).toBe(340282366920938463463374607431768211455n)
		})
	})
})
