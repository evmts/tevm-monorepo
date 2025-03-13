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

	it('should throw error with correct message', () => {
		const message = 'Custom error message'
		expect(() => invariant(false, message)).toThrowError(message)

		const longMessage =
			'This is a much longer error message with more details about what went wrong in the invariant check'
		expect(() => invariant(false, longMessage)).toThrowError(longMessage)
	})

	it('should handle different truthy and falsy values', () => {
		// Truthy values
		expect(() => invariant(true, 'error')).not.toThrow()
		expect(() => invariant(1, 'error')).not.toThrow()
		expect(() => invariant('string', 'error')).not.toThrow()
		expect(() => invariant({}, 'error')).not.toThrow()
		expect(() => invariant([], 'error')).not.toThrow()

		// Falsy values
		expect(() => invariant(false, 'error')).toThrow()
		expect(() => invariant(0, 'error')).toThrow()
		expect(() => invariant('', 'error')).toThrow()
		expect(() => invariant(null, 'error')).toThrow()
		expect(() => invariant(undefined, 'error')).toThrow()
	})

	it('should throw an Error with the correct properties', () => {
		try {
			invariant(false, 'test error')
			// Using expect.fail() to explicitly mark this code as unreachable for TypeScript
			// @ts-expect-error - This code is unreachable but we need it for test coverage
			expect.fail('invariant did not throw an error')
		} catch (error: unknown) {
			// Type guard to check and handle the error type
			if (error instanceof Error) {
				expect(error.message).toBe('test error')
			} else {
				expect.fail('error is not an instance of Error')
			}
		}
	})
})
