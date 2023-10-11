import {
	isUINT8,
	isUINT16,
	isUINT32,
	isUINT64,
	isUINT128,
	isUINT256,
	parseUINT8,
	parseUINT16,
	parseUINT32,
	parseUINT64,
	parseUINT128,
	parseUINT256,
} from './index.js'
import { assertType, describe, expect, it } from 'vitest'

const testCases = [
	{
		type: 'UINT8',
		max: 255,
		parse: parseUINT8,
		exceedsMax: 256,
	},
	{
		type: 'UINT16',
		max: 65535,
		parse: parseUINT16,
		exceedsMax: 65536,
	},
	{
		type: 'UINT32',
		max: '4294967295',
		parse: parseUINT32,
		exceedsMax: '4294967296',
	},
	{
		type: 'UINT64',
		max: '18446744073709551615',
		parse: parseUINT64,
		exceedsMax: '18446744073709551616',
	},
	{
		type: 'UINT128',
		max: '340282366920938463463374607431768211455',
		parse: parseUINT128,
		exceedsMax: '340282366920938463463374607431768211456',
	},
	{
		type: 'UINT256',
		max: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
		parse: parseUINT256,
		exceedsMax:
			'115792089237316195423570985008687907853269984665640564039457584007913129639936',
	},
]

const testCasesIsEqual = [
	{
		type: 'UINT8',
		func: isUINT8,
		max: 255,
		exceedsMax: 256,
	},
	{
		type: 'UINT16',
		func: isUINT16,
		max: 65535,
		exceedsMax: 65536,
	},
	{
		type: 'UINT32',
		func: isUINT32,
		max: 4294967295,
		exceedsMax: 4294967296,
	},
	{
		type: 'UINT64',
		func: isUINT64,
		max: '18446744073709551615',
		exceedsMax: '18446744073709551616',
	},
	{
		type: 'UINT128',
		func: isUINT128,
		max: '340282366920938463463374607431768211455',
		exceedsMax: '340282366920938463463374607431768211456',
	},
	{
		type: 'UINT256',
		func: isUINT256,
		max: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
		exceedsMax: (
			BigInt(
				'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
			) + BigInt(1)
		).toString(),
	},
] as const

describe.each(testCasesIsEqual)('%j', (testCase) => {
	it(`should return true for valid ${testCase.type} values`, () => {
		expect(testCase.func(BigInt(0))).toBe(true)
		expect(testCase.func(BigInt(testCase.max))).toBe(true)
	})

	it(`should return false for out of bounds values for ${testCase.type}`, () => {
		expect(testCase.func(BigInt(testCase.exceedsMax))).toBe(false)
	})

	it(`should return false for non-bigint values for ${testCase.type}`, () => {
		expect(testCase.func(BigInt(-1))).toBe(false)
		expect(testCase.func('0x52' as any)).toBe(false)
		expect(testCase.func(testCase.max.toString() as any)).toBe(false)
		expect(testCase.func('' as any)).toBe(false)
		expect(testCase.func(true as any)).toBe(false)
		expect(testCase.func({} as any)).toBe(false)
		expect(testCase.func('not an int' as any)).toBe(false)
		expect(testCase.func(Number(testCase.max) as any)).toBe(false)
		expect(testCase.func(undefined as any)).toBe(false)
		expect(testCase.func(null as any)).toBe(false)
	})
})

describe.each(testCases)('parse%j', (testCase) => {
	it(`should return a valid ${testCase.type}`, () => {
		const expected = BigInt(testCase.max)
		const result = testCase.parse(expected)
		expect(result).toMatchSnapshot(`"${testCase.max.toString()}"`)
		assertType<typeof expected>(result)
	})

	it(`should throw if value is out of ${testCase.type} range`, () => {
		expect(() =>
			testCase.parse(testCase.exceedsMax as any),
		).toThrowErrorMatchingSnapshot()
		expect(() =>
			testCase.parse(BigInt(-1) as any),
		).toThrowErrorMatchingSnapshot()
	})

	it(`should throw if value is not a bigint for ${testCase.type}`, () => {
		expect(() => testCase.parse('0x52' as any)).toThrowErrorMatchingSnapshot()
		expect(() =>
			testCase.parse(testCase.max.toString() as any),
		).toThrowErrorMatchingSnapshot()
		expect(() => testCase.parse('' as any)).toThrowErrorMatchingSnapshot()
		expect(() => testCase.parse(true as any)).toThrowErrorMatchingSnapshot()
		expect(() => testCase.parse({} as any)).toThrowErrorMatchingSnapshot()
		expect(() =>
			testCase.parse('not an int' as any),
		).toThrowErrorMatchingSnapshot()
		expect(() => testCase.parse(52 as any)).toThrowErrorMatchingSnapshot()
		expect(() =>
			testCase.parse(undefined as any),
		).toThrowErrorMatchingSnapshot()
		expect(() => testCase.parse(null as any)).toThrowErrorMatchingSnapshot()
	})
})
