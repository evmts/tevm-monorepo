import {
	isBytes1,
	isBytes2,
	isBytes3,
	isBytes4,
	isBytes5,
	isBytes6,
	isBytes7,
	isBytes8,
	isBytes9,
	isBytes10,
	isBytes11,
	isBytes12,
	isBytes13,
	isBytes14,
	isBytes15,
	isBytes16,
	isBytes17,
	isBytes18,
	isBytes19,
	isBytes20,
	isBytes21,
	isBytes22,
	isBytes23,
	isBytes24,
	isBytes25,
	isBytes26,
	isBytes27,
	isBytes28,
	isBytes29,
	isBytes30,
	isBytes31,
	isBytes32,
	parseBytes1,
	parseBytes2,
	parseBytes3,
	parseBytes4,
	parseBytes5,
	parseBytes6,
	parseBytes7,
	parseBytes8,
	parseBytes9,
	parseBytes10,
	parseBytes11,
	parseBytes12,
	parseBytes13,
	parseBytes14,
	parseBytes15,
	parseBytes16,
	parseBytes17,
	parseBytes18,
	parseBytes19,
	parseBytes20,
	parseBytes21,
	parseBytes22,
	parseBytes23,
	parseBytes24,
	parseBytes25,
	parseBytes26,
	parseBytes27,
	parseBytes28,
	parseBytes29,
	parseBytes30,
	parseBytes31,
	parseBytes32,
} from './index.js'
import { assertType, describe, expect, it } from 'vitest'

const byteTestCases = [
	{
		type: 'Bytes1',
		value: '0xff',
		parse: parseBytes1,
		isEqual: isBytes1,
		invalidHex: 'ff',
		toBig: '0xffff',
		toSmall: '0x',
	},
	{
		type: 'Bytes2',
		value: '0xffaa',
		parse: parseBytes2,
		isEqual: isBytes2,
		invalidHex: 'ffaabb',
		toBig: '0xffffaa',
		toSmall: '0xff',
	},
	{
		type: 'Bytes3',
		value: '0xffaabb',
		parse: parseBytes3,
		isEqual: isBytes3,
		invalidHex: 'ffaabbcc',
		toBig: '0xffffaabb',
		toSmall: '0xffaa',
	},
	{
		type: 'Bytes4',
		value: '0xffaabbcc',
		parse: parseBytes4,
		isEqual: isBytes4,
		invalidHex: 'ffaabbccdd',
		toBig: '0xffffaabbcc',
		toSmall: '0xffaabb',
	},
	{
		type: 'Bytes5',
		value: '0xffaabbccdd',
		parse: parseBytes5,
		isEqual: isBytes5,
		invalidHex: 'ffaabbccddee',
		toBig: '0xffffaabbccdd',
		toSmall: '0xffaabbcc',
	},
	{
		type: 'Bytes6',
		value: '0xaabbccddeeff',
		parse: parseBytes6,
		isEqual: isBytes6,
		invalidHex: 'ffaabbccddeeff00',
		toBig: '0xffaabbccddeeff',
		toSmall: '0xaabbccdd',
	},
	{
		type: 'Bytes7',
		value: '0xaabbccddeeff00',
		parse: parseBytes7,
		isEqual: isBytes7,
		invalidHex: 'ffaabbccddeeff0011',
		toBig: '0xffaabbccddeeff00',
		toSmall: '0xaabbccddeeff',
	},
	{
		type: 'Bytes8',
		value: '0xaabbccddeeff0011',
		parse: parseBytes8,
		isEqual: isBytes8,
		invalidHex: 'ffaabbccddeeff001122',
		toBig: '0xffaabbccddeeff0011',
		toSmall: '0xaabbccddeeff00',
	},
	{
		type: 'Bytes9',
		value: '0xaabbccddeeff001122',
		parse: parseBytes9,
		isEqual: isBytes9,
		invalidHex: 'ffaabbccddeeff00112233',
		toBig: '0xffaabbccddeeff001122',
		toSmall: '0xaabbccddeeff0011',
	},
	{
		type: 'Bytes10',
		value: '0xaabbccddeeff00112233',
		parse: parseBytes10,
		isEqual: isBytes10,
		invalidHex: 'ffaabbccddeeff0011223344',
		toBig: '0xffaabbccddeeff00112233',
		toSmall: '0xaabbccddeeff001122',
	},
	{
		type: 'Bytes11',
		value: '0xaabbccddeeff0011223344',
		parse: parseBytes11,
		isEqual: isBytes11,
		invalidHex: 'ffaabbccddeeff001122334455',
		toBig: '0xffaabbccddeeff0011223344',
		toSmall: '0xaabbccddeeff00112233',
	},
	{
		type: 'Bytes12',
		value: '0xaabbccddeeff001122334455',
		parse: parseBytes12,
		isEqual: isBytes12,
		invalidHex: 'ffaabbccddeeff00112233445566',
		toBig: '0xffaabbccddeeff001122334455',
		toSmall: '0xaabbccddeeff0011223344',
	},
	{
		type: 'Bytes13',
		value: '0xaabbccddeeff00112233445566',
		parse: parseBytes13,
		isEqual: isBytes13,
		invalidHex: 'ffaabbccddeeff0011223344556677',
		toBig: '0xffaabbccddeeff00112233445566',
		toSmall: '0xaabbccddeeff001122334455',
	},
	{
		type: 'Bytes14',
		value: '0xaabbccddeeff0011223344556677',
		parse: parseBytes14,
		isEqual: isBytes14,
		invalidHex: 'ffaabbccddeeff001122334455667788',
		toBig: '0xffaabbccddeeff0011223344556677',
		toSmall: '0xaabbccddeeff00112233445566',
	},
	{
		type: 'Bytes15',
		value: '0xaabbccddeeff001122334455667788',
		parse: parseBytes15,
		isEqual: isBytes15,
		invalidHex: 'ffaabbccddeeff00112233445566778899',
		toBig: '0xffaabbccddeeff001122334455667788',
		toSmall: '0xaabbccddeeff0011223344556677',
	},
	{
		type: 'Bytes16',
		value: '0xaabbccddeeff00112233445566778899',
		parse: parseBytes16,
		isEqual: isBytes16,
		invalidHex: 'ffaabbccddeeff00112233445566778899aa',
		toBig: '0xffaabbccddeeff00112233445566778899',
		toSmall: '0xaabbccddeeff001122334455667788',
	},
	{
		type: 'Bytes17',
		value: '0xaabbccddeeff00112233445566778899aa',
		parse: parseBytes17,
		isEqual: isBytes17,
		invalidHex: 'ffaabbccddeeff00112233445566778899aabb',
		toBig: '0xffaabbccddeeff00112233445566778899aa',
		toSmall: '0xaabbccddeeff00112233445566778899',
	},
	{
		type: 'Bytes18',
		value: '0xaabbccddeeff00112233445566778899aabb',
		parse: parseBytes18,
		isEqual: isBytes18,
		invalidHex: 'ffaabbccddeeff00112233445566778899aabbcc',
		toBig: '0xffaabbccddeeff00112233445566778899aabb',
		toSmall: '0xaabbccddeeff00112233445566778899aa',
	},
	{
		type: 'Bytes19',
		value: '0xaabbccddeeff00112233445566778899aabbcc',
		parse: parseBytes19,
		isEqual: isBytes19,
		invalidHex: 'ffaabbccddeeff00112233445566778899aabbccdd',
		toBig: '0xffaabbccddeeff00112233445566778899aabbcc',
		toSmall: '0xaabbccddeeff00112233445566778899aabb',
	},
	{
		type: 'Bytes20',
		value: '0xaabbccddeeff00112233445566778899aabbccdd',
		parse: parseBytes20,
		isEqual: isBytes20,
		invalidHex: 'ffaabbccddeeff00112233445566778899aabbccddeeff',
		toBig: '0xffaabbccddeeff00112233445566778899aabbccdd',
		toSmall: '0xaabbccddeeff00112233445566778899aabbcc',
	},
	{
		type: 'Bytes21',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff',
		parse: parseBytes21,
		isEqual: isBytes21,
		invalidHex: 'ffbbccddeeff00112233445566778899aabbccddeeff00',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff',
		toSmall: '0xbbccddeeff00112233445566778899aabbccdd',
	},
	{
		type: 'Bytes22',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff00',
		parse: parseBytes22,
		isEqual: isBytes22,
		invalidHex: 'ffbbccddeeff00112233445566778899bbccddeeff0011',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff00',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff',
	},
	{
		type: 'Bytes23',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff0011',
		parse: parseBytes23,
		isEqual: isBytes23,
		invalidHex: 'ffbbccddeeff00112233445566778899aabbccddeeff001122',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff0011',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff00',
	},
	{
		type: 'Bytes24',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff001122',
		parse: parseBytes24,
		isEqual: isBytes24,
		invalidHex: 'ffbbccddeeff00112233445566778899aabbccddeeff00112233',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff001122',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff0011',
	},
	{
		type: 'Bytes25',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff00112233',
		parse: parseBytes25,
		isEqual: isBytes25,
		invalidHex: 'ffbbccddeeff00112233445566778899aabbccddeeff0011223344',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff00112233',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff001122',
	},
	{
		type: 'Bytes26',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff0011223344',
		parse: parseBytes26,
		isEqual: isBytes26,
		invalidHex: 'ffbbccddeeff00112233445566778899aabbccddeeff001122334455',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff0011223344',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff00112233',
	},
	{
		type: 'Bytes27',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff001122334455',
		parse: parseBytes27,
		isEqual: isBytes27,
		invalidHex: 'ffbbccddeeff00112233445566778899aabbccddeeff00112233445566',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff001122334455',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff0011223344',
	},
	{
		type: 'Bytes28',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff00112233445566',
		parse: parseBytes28,
		isEqual: isBytes28,
		invalidHex: 'ffbbccddeeff00112233445566778899aabbccddeeff0011223344556677',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff00112233445566',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff001122334455',
	},
	{
		type: 'Bytes29',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff0011223344556677',
		parse: parseBytes29,
		isEqual: isBytes29,
		invalidHex:
			'ffbbccddeeff00112233445566778899aabbccddeeff001122334455667788',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff0011223344556677',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff00112233445566',
	},
	{
		type: 'Bytes30',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff001122334455667788',
		parse: parseBytes30,
		isEqual: isBytes30,
		invalidHex:
			'ffbbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff001122334455667788',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff0011223344556677',
	},
	{
		type: 'Bytes31',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
		parse: parseBytes31,
		isEqual: isBytes31,
		invalidHex:
			'ffbbccddeeff00112233445566778899aabbccddeeff00112233445566778899aa',
		toBig: '0xffbbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff001122334455667788',
	},
	{
		type: 'Bytes32',
		value: '0xbbccddeeff00112233445566778899aabbccddeeff00112233445566778899aa',
		parse: parseBytes32,
		isEqual: isBytes32,
		invalidHex:
			'ffbbccddeeff00112233445566778899aabbccddeeff00112233445566778899aabb',
		toBig:
			'0xffbbccddeeff00112233445566778899aabbccddeeff00112233445566778899aa',
		toSmall: '0xbbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
	},
] as const

describe.each(byteTestCases)('%j', (testCase) => {
	it(`should return true for valid ${testCase.type} values`, () => {
		expect(testCase.isEqual(testCase.value)).toBe(true)
	})

	it(`should return false for non-string values for ${testCase.type}`, () => {
		expect(testCase.isEqual(testCase.toBig)).toBe(false)
		expect(testCase.isEqual(testCase.toSmall)).toBe(false)
		expect(testCase.isEqual(testCase.invalidHex)).toBe(false)
		expect(testCase.isEqual(42 as any)).toBe(false)
		expect(testCase.isEqual({} as any)).toBe(false)
		expect(testCase.isEqual(true as any)).toBe(false)
		expect(testCase.isEqual(undefined as any)).toBe(false)
		expect(testCase.isEqual(null as any)).toBe(false)
		expect(testCase.isEqual([] as any)).toBe(false)
		expect(testCase.isEqual(() => ({}) as any)).toBe(false)
	})
})

describe.each(byteTestCases)('parse%j', (testCase) => {
	it(`should return a valid ${testCase.type}`, () => {
		const expected = testCase.value
		const result = testCase.parse(expected)
		expect(result).toMatchSnapshot(`"${expected}"`)
		assertType<typeof expected>(result)
	})

	it(`should throw if value is not a valid string for ${testCase.type}`, () => {
		expect(() =>
			// @ts-expect-error
			testCase.parse(testCase.invalidHex),
		).toThrowErrorMatchingSnapshot()
		expect(() =>
			testCase.parse(testCase.toSmall),
		).toThrowErrorMatchingSnapshot()
		expect(() => testCase.parse(testCase.toBig)).toThrowErrorMatchingSnapshot()
		expect(() =>
			testCase.parse('invalid' as any),
		).toThrowErrorMatchingSnapshot()
		expect(() =>
			testCase.parse(BigInt(testCase.value) as any),
		).toThrowErrorMatchingSnapshot()
	})
})
