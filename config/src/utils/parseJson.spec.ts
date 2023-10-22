import { ParseJsonError, parseJson } from './parseJson.js'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'

describe(parseJson.name, () => {
	it('should parse json', () => {
		const json = '{"foo": "bar"}'
		const parsed = runSync(parseJson(json))
		expect(parsed).toEqual({ foo: 'bar' })
	})
	it('should parse json with comments', () => {
		const json = `{
// comment
"foo": "bar"
}`
		const parsed = runSync(parseJson(json))
		expect(parsed).toEqual({ foo: 'bar' })
	})
	it('should parse json with trailing commas', () => {
		const json = `{
"foo": "bar",
}`
		const parsed = runSync(parseJson(json))
		expect(parsed).toEqual({ foo: 'bar' })
	})
	it(`it should throw a ${ParseJsonError.name} if the json is invalid`, () => {
		const json = `{
"foo"::'} "bar",
`
		expect(() => runSync(parseJson(json))).toThrowError(new ParseJsonError())
	})
})
