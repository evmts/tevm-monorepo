import type { Address } from './SAddress.js'
import { parseAddress } from './parseAddress.js'
import { assertType, describe, expect, it } from 'vitest'

describe(parseAddress.name, () => {
	it('should return an address book', () => {
		const expected =
			'0x4320a88a199120aD52Dd9742C7430847d3cB2CD4' satisfies Address
		const address = parseAddress(expected) satisfies Address
		expect(address).toMatchInlineSnapshot(
			'"0x4320a88a199120aD52Dd9742C7430847d3cB2CD4"',
		)
		assertType<typeof expected>(address)
	})

	it('should throw if invalid address', () => {
		expect(() => parseAddress('0x52')).toThrowErrorMatchingSnapshot()
		expect(() =>
			parseAddress('0xzz20a88a199120aD52Dd9742C7430847d3cB2CD4'),
		).toThrowErrorMatchingSnapshot()
		expect(() => parseAddress('0x' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseAddress('0' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseAddress('' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseAddress(true as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseAddress({} as any).toThrowErrorMatchingSnapshot())
		expect(() =>
			parseAddress('not an address' as any),
		).toThrowErrorMatchingSnapshot()
		expect(() => parseAddress(52 as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseAddress(52n as any)).toThrowErrorMatchingSnapshot()
	})
})
