import { type BlockNumber, parseBlockNumber } from './SBlockNumber'
import { assertType, describe, expect, it } from 'vitest'

describe(parseBlockNumber.name, () => {
	it('should return the validated block number', () => {
		const expected = 5 satisfies BlockNumber
		const bn = parseBlockNumber(expected) satisfies BlockNumber
		assertType<typeof expected>(bn)
		expect(parseBlockNumber(0)).toBe(0)
		expect(parseBlockNumber(5)).toBe(5)
		expect(parseBlockNumber(90000000000)).toBe(90000000000)
	})

	it('should throw if invalid address', () => {
		expect(() => parseBlockNumber(52n as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber('0x' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber('0' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber('' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber(true as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber({} as any)).toThrowErrorMatchingSnapshot()
		expect(() =>
			parseBlockNumber('not an address' as any),
		).toThrowErrorMatchingSnapshot()
	})
})
