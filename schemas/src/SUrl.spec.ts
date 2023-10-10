import { type Url, parseUrl } from './SUrl.js'
import { assertType, describe, expect, it } from 'vitest'

describe(parseUrl.name, () => {
	it('should return an validated url', () => {
		const expected = 'https://ima.url' satisfies Url
		const res = parseUrl(expected) satisfies Url
		expect(res).toMatchInlineSnapshot('"https://ima.url"')
		assertType<typeof expected>(res)
	})

	it('should throw if invalid url', () => {
		expect(() => parseUrl('not a url')).toThrowErrorMatchingSnapshot()
		expect(() =>
			parseUrl('0xzz20a88a199120aD52Dd9742C7430847d3cB2CD4'),
		).toThrowErrorMatchingSnapshot()
		expect(() => parseUrl('0x' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseUrl('0' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseUrl('' as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseUrl(true as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseUrl({} as any).toThrowErrorMatchingSnapshot())
		expect(() =>
			parseUrl('not an address' as any),
		).toThrowErrorMatchingSnapshot()
		expect(() => parseUrl(52 as any)).toThrowErrorMatchingSnapshot()
		expect(() => parseUrl(52n as any)).toThrowErrorMatchingSnapshot()
	})
})
