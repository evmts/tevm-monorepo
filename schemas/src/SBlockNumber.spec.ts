import {
	type BlockNumber,
	isBlockNumber,
	parseBlockNumber,
} from './SBlockNumber.js'
import { assertType, describe, expect, it } from 'vitest'

describe(isBlockNumber.name, () => {
	it('should return true for valid block number', () => {
		expect(isBlockNumber(0)).toBe(true)
		expect(isBlockNumber(5)).toBe(true)
		expect(isBlockNumber(90000000000)).toBe(true)
	})

	it('should return false for invalid block number', () => {
		expect(isBlockNumber(0.5)).toBe(false)
		expect(isBlockNumber(-1)).toBe(false)
		expect(isBlockNumber(52n as any)).toBe(false)
		expect(isBlockNumber(52n as any)).toBe(false)
		expect(isBlockNumber('0x' as any)).toBe(false)
		expect(isBlockNumber('0' as any)).toBe(false)
		expect(isBlockNumber('' as any)).toBe(false)
		expect(isBlockNumber(true as any)).toBe(false)
	})
})

describe(parseBlockNumber.name, () => {
	it('should return the validated block number', () => {
		const expected = 5 satisfies BlockNumber
		const bn = parseBlockNumber(expected) satisfies BlockNumber
		assertType<typeof expected>(bn)
		expect(parseBlockNumber(0)).toBe(0)
		expect(parseBlockNumber(5)).toBe(5)
		expect(parseBlockNumber(90000000000)).toBe(90000000000)
	})

	it('should throw if invalid block number', () => {
		expect(() => parseBlockNumber(0.5)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber(-1)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber(52n as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber('0x' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber('0' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber('' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber(true as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseBlockNumber({} as any)).toThrowErrorMatchingSnapshot()
		expect(() =>
			parseBlockNumber('not an block number' as any),
		).toThrowErrorMatchingSnapshot()
	})
})
