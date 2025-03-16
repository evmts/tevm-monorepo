import { describe, expect, expectTypeOf, it } from 'vitest'
import { invariant } from './invariant.js'

describe(invariant.name, () => {
	it('should throw an error if condition is false', () => {
		const condition = false
		const message = 'message'
		expect(() => invariant(condition, message)).toThrowError(message)
	})
	it('should not throw an error if condition is true and cast type to truthy value', () => {
		const condition = {} as {} | undefined
		const message = 'message'
		invariant(condition, message)
		expectTypeOf(condition).toBeObject()
	})

	it('should handle falsy values correctly', () => {
		const falsyValues = [false, 0, '', null, undefined]

		falsyValues.forEach((value) => {
			expect(() => invariant(value, 'falsy value')).toThrowError('falsy value')
		})
	})

	it('should narrow union types when condition is truthy', () => {
		// Test with string | null
		const maybeString = Math.random() > 0.5 ? 'hello' : null

		if (maybeString !== null) {
			invariant(maybeString, 'String is null')
			// After invariant, TypeScript should know maybeString is a string
			expectTypeOf(maybeString).toBeString()
		}

		// Test with number | undefined
		const maybeNumber = Math.random() > 0.5 ? 42 : undefined

		if (maybeNumber !== undefined) {
			invariant(maybeNumber, 'Number is undefined')
			// After invariant, TypeScript should know maybeNumber is a number
			expectTypeOf(maybeNumber).toBeNumber()
		}
	})
})
