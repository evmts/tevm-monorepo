import { type Bytes, isBytes, parseBytes } from './index.js'
import { assertType, describe, expect, it } from 'vitest'

describe(isBytes.name, () => {
	it('should return true for valid Bytes', () => {
		expect(isBytes('0x')).toBe(true)
		expect(isBytes('0x0')).toBe(true)
		expect(isBytes('0xabcde')).toBe(true)
	})

	it('should return false for invalid Bytes', () => {
		expect(isBytes(52n as any)).toBe(false)
		expect(isBytes('0' as any)).toBe(false)
		expect(isBytes('0xz' as any)).toBe(false)
		expect(isBytes('x0' as any)).toBe(false)
		expect(isBytes('' as any)).toBe(false)
		expect(isBytes('x' as any)).toBe(false)
		expect(isBytes(true as any)).toBe(false)
	})
})

describe(parseBytes.name, () => {
	it('should return the validated Bytes', () => {
		const expected = '0x5523423' satisfies Bytes
		const res = parseBytes(expected) satisfies Bytes
		expect(res).toBe(expected)
		assertType<typeof expected>(res)
		expect(parseBytes('0x')).toBe('0x')
		expect(parseBytes('0x0')).toBe('0x0')
		expect(parseBytes('0xabcde')).toBe('0xabcde')
	})

	it('should throw if invalid HexString', () => {
		expect(() => parseBytes(52n as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBytes('0' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBytes('x0' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBytes('' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBytes(true as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBytes({} as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBytes('not a hex' as any)).toThrowErrorMatchingSnapshot()
	})
})
