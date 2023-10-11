import {
	isINT8,
	isINT16,
	isINT32,
	isINT64,
	isINT128,
	isINT256,
	parseInt8,
	parseInt16,
	parseInt32,
	parseInt64,
	parseInt128,
	parseInt256,
} from './index.js'
import { assertType, describe, expect, it } from 'vitest'

const testCases = [
	{
		type: 'INT8',
		max: 127,
		min: -128,
		parse: parseInt8,
		isEqual: isINT8,
		exceedsMax: 128,
		belowMin: -129,
	},
	{
		type: 'INT16',
		max: 32767,
		min: -32768,
		parse: parseInt16,
		isEqual: isINT16,
		exceedsMax: 32768,
		belowMin: -32769,
	},
	{
		type: 'INT32',
		max: '2147483647',
		min: '-2147483648',
		parse: parseInt32,
		isEqual: isINT32,
		exceedsMax: '2147483648',
		belowMin: '-2147483649',
	},
	{
		type: 'INT64',
		max: '9223372036854775807',
		min: '-9223372036854775808',
		parse: parseInt64,
		isEqual: isINT64,
		exceedsMax: '9223372036854775808',
		belowMin: '-9223372036854775809',
	},
	{
		type: 'INT128',
		max: '170141183460469231731687303715884105727',
		min: '-170141183460469231731687303715884105728',
		parse: parseInt128,
		isEqual: isINT128,
		exceedsMax: '170141183460469231731687303715884105728',
		belowMin: '-170141183460469231731687303715884105729',
	},
	{
		type: 'INT256',
		max: BigInt(
			'0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
		).toString(),
		min: (-BigInt(
			'0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
		)).toString(),
		parse: parseInt256,
		isEqual: isINT256,
		exceedsMax: (
			BigInt(
				'0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
			) + BigInt(1)
		).toString(),
		belowMin: (
			-BigInt(
				'0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
			) - BigInt(1)
		).toString(),
	},
]

describe.each(testCases)('%j', (testCase) => {
	it(`should return true for valid ${testCase.type} values`, () => {
		expect(testCase.isEqual(BigInt(0))).toBe(true)
		expect(testCase.isEqual(BigInt(testCase.max))).toBe(true)
		expect(testCase.isEqual(BigInt(testCase.min))).toBe(true)
	})

	it(`should return false for out of bounds values for ${testCase.type}`, () => {
		expect(testCase.isEqual(BigInt(testCase.exceedsMax))).toBe(false)
		expect(testCase.isEqual(BigInt(testCase.belowMin))).toBe(false)
	})

	it(`should return false for non-bigint values for ${testCase.type}`, () => {
		expect(testCase.isEqual('0x52' as any)).toBe(false)
		expect(testCase.isEqual(testCase.max.toString() as any)).toBe(false)
		expect(testCase.isEqual('' as any)).toBe(false)
		expect(testCase.isEqual(true as any)).toBe(false)
		expect(testCase.isEqual({} as any)).toBe(false)
		expect(testCase.isEqual('not an int' as any)).toBe(false)
		expect(testCase.isEqual(Number(testCase.max) as any)).toBe(false)
		expect(testCase.isEqual(undefined as any)).toBe(false)
		expect(testCase.isEqual(null as any)).toBe(false)
	})
})
describe.each(testCases)('parse%j', (testCase) => {
	it(`should return a valid ${testCase.type}`, () => {
		const expected = BigInt(testCase.max)
		const result = testCase.parse(expected)
		expect(result).toMatchSnapshot(`"${testCase.max.toString()}"`)
		assertType<typeof expected>(result)
	})

	it(`should throw if value is out of positive ${testCase.type} range`, () => {
		expect(() =>
			testCase.parse(testCase.exceedsMax as any),
		).toThrowErrorMatchingSnapshot()
	})

	it(`should throw if value is out of negative ${testCase.type} range`, () => {
		expect(() =>
			testCase.parse(testCase.belowMin as any),
		).toThrowErrorMatchingSnapshot()
	})

	it(`should throw if value is not a bigint for ${testCase.type}`, () => {
		expect(() => testCase.parse(52 as any)).toThrowErrorMatchingSnapshot()
	})
})
