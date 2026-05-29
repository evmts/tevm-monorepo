import { describe, expect, it } from 'vitest'
import { numberToHex, valuesArrayToHeaderData } from './helpers.js'

describe(numberToHex.name, () => {
	it('should return undefined for undefined input', () => {
		expect(numberToHex(undefined)).toBe(undefined)
	})

	it('should pass through 0x-prefixed hex strings', () => {
		expect(numberToHex('0x1a')).toBe('0x1a')
	})

	it('should convert small decimal integer strings to hex', () => {
		expect(numberToHex('255')).toBe('0xff')
	})

	it('should throw on non-numeric strings', () => {
		expect(() => numberToHex('not a number')).toThrow()
	})

	// Regression for #21: large decimal difficulty strings must not lose precision.
	// Number.parseInt routes through a 64-bit float and rounds values above 2^53.
	it('should not lose precision on large decimal difficulty strings', () => {
		const input = '58750003716598352816469'
		// correct value computed with BigInt
		expect(numberToHex(input)).toBe(`0x${BigInt(input).toString(16)}`)
		// explicitly assert it is not the float-rounded result that parseInt produced
		expect(numberToHex(input)).not.toBe(`0x${Number.parseInt(input, 10).toString(16)}`)
		expect(numberToHex(input)).toBe('0xc70d815d562d3cfa955')
	})
})

describe(valuesArrayToHeaderData.name, () => {
	const field = new Uint8Array([1])
	const makeValues = (n: number) => Array.from({ length: n }, () => field)

	it('should report the correct max field count (21) when too many values are given', () => {
		// Regression for #36: the guard permits up to 21 values, so the error
		// message must say "Max: 21", not "Max: 20".
		expect(() => valuesArrayToHeaderData(makeValues(22) as any)).toThrow(/Max: 21, got: 22/)
	})

	it('should accept exactly 21 values (full EIP-7685 header)', () => {
		expect(() => valuesArrayToHeaderData(makeValues(21) as any)).not.toThrow()
	})

	it('should throw when fewer than 15 values are given', () => {
		expect(() => valuesArrayToHeaderData(makeValues(14) as any)).toThrow(/Min: 15, got: 14/)
	})
})
