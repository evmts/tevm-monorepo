import { describe, expect, expectTypeOf, it } from 'vitest'
import { invariant } from './invariant.js'

describe(invariant.name, () => {
	it('should throw an error if condition is false', () => {
		const condition = false
		const message = 'message'
		expect(() => invariant(condition, message)).toThrowErrorMatchingInlineSnapshot('[InvariantError: message]')
	})
	it('should not throw an error if condition is true and cast type to truthy value', () => {
		const condition = {} as {} | undefined
		const message = 'message'
		invariant(condition, message)
		expectTypeOf(condition).toBeObject()
	})
})
