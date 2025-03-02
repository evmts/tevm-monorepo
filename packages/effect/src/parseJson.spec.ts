import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { ParseJsonError, parseJson } from './parseJson.js'

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
		try {
			runSync(parseJson(json))
			// Should not reach here
			expect(true).toBe(false)
		} catch (error) {
			console.log('ParseJson error message:', error)
			expect((error as any).message).toContain('Failed to parse tsconfig.json')
		}
	})
})
