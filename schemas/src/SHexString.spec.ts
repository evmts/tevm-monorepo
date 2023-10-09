import { type HexString, isHexString, parseHexStringString } from './SHexString'
import { assertType, describe, expect, it } from 'vitest'

describe(isHexString.name, () => {
	it('should return true for valid HexString', () => {
		expect(isHexString('0x')).toBe(true)
		expect(isHexString('0x0')).toBe(true)
		expect(isHexString('0xabcde')).toBe(true)
	})

	it('should return false for invalid HexString', () => {
		expect(isHexString(52n as any)).toBe(false)
		expect(isHexString('0' as any)).toBe(false)
		expect(isHexString('0xz' as any)).toBe(false)
		expect(isHexString('x0' as any)).toBe(false)
		expect(isHexString('' as any)).toBe(false)
		expect(isHexString('x' as any)).toBe(false)
		expect(isHexString(true as any)).toBe(false)
	})
})

describe(parseHexStringString.name, () => {
	it('should return the validated HexString', () => {
		const expected = '0x5523423' satisfies HexString
		const res = parseHexStringString(expected) satisfies HexString
		expect(res).toBe(expected)
		assertType<typeof expected>(res)
		expect(parseHexStringString('0x')).toBe('0x')
		expect(parseHexStringString('0x0')).toBe('0x0')
		expect(parseHexStringString('0xabcde')).toBe('0xabcde')
	})

	it('should throw if invalid HexString', () => {
		expect(() =>
			parseHexStringString(52n as any),
		).toThrowErrorMatchingSnapshot()
		expect(() =>
			parseHexStringString('0' as any),
		).toThrowErrorMatchingSnapshot()
		expect(() =>
			parseHexStringString('x0' as any),
		).toThrowErrorMatchingSnapshot()
		expect(() => parseHexStringString('' as any)).toThrowErrorMatchingSnapshot()
		expect(() =>
			parseHexStringString(true as any),
		).toThrowErrorMatchingSnapshot()
		expect(() => parseHexStringString({} as any)).toThrowErrorMatchingSnapshot()
		expect(() =>
			parseHexStringString('not a hex' as any),
		).toThrowErrorMatchingSnapshot()
	})
})
