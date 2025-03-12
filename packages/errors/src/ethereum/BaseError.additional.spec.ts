import { describe, expect, it } from 'vitest'
import { BaseError } from './BaseError.js'

describe('BaseError (additional cases)', () => {
	class CustomError extends BaseError {
		constructor(message: string, args: any) {
			super(message, args, 'CustomError')
		}
	}

	// Create a custom error with errorType for testing
	// This class is part of the test suite setup, even if not directly used in this file
	// @ts-ignore: Used for testing purposes but may not be directly used
	class CustomErrorWithType extends Error {
		errorType = 'CustomTypeError'
	}

	it('should handle null cause', () => {
		const error = new CustomError('Error with null cause', {
			cause: null,
		})
		expect(error.message).not.toContain('Details:')
	})

	it('should handle undefined cause', () => {
		const error = new CustomError('Error with undefined cause', {
			cause: undefined,
		})
		expect(error.message).not.toContain('Details:')
	})

	it('should handle primitive non-object cause', () => {
		const error = new CustomError('Error with number cause', {
			cause: 42,
		})
		expect(error.message).toContain('Details:')
	})

	// The error's errorType is only used when the cause is an Error object
	// Let's test with both approaches
	it('should handle plain object with errorType property', () => {
		// Create a plain object that will get JSON.stringified
		const mockError = {
			errorType: 'CustomTypeError',
		}
		const error = new CustomError('Error with errorType object', {
			cause: mockError,
		})
		// For plain objects, the entire object is stringified
		expect(error.message).toContain('Details: {"errorType":"CustomTypeError"}')
	})

	// Let's skip this test for now since it's difficult to test this edge case directly
	// The branch coverage for the lines 67-71 in BaseError.js is lower priority
	it('should handle Error instance gracefully', () => {
		const mockErrorInstance = new Error('Regular error')
		const error = new CustomError('Error wrapper', {
			cause: mockErrorInstance,
		})
		expect(error.message).toContain('Details: Regular error')
	})

	it('should handle Error instance with errorType property', () => {
		const mockErrorWithType = new CustomErrorWithType('Error with type')
		const error = new CustomError('Error wrapper', {
			cause: mockErrorWithType,
		})

		// For Error instances with errorType property, the property is used as the details
		expect(error.message).toContain('Details: Error with type')
	})

	it('should handle error with cause that cannot be stringified', () => {
		// Create a circular reference that can't be JSON stringified
		const circular: any = {}
		circular.self = circular

		const error = new CustomError('Error with circular reference cause', {
			cause: circular,
		})
		expect(error.message).toContain('Details: Unable to parse error details')
	})

	it('should return null when walking with predicate and no match found', () => {
		const error = new CustomError('Test error', {})
		const result = error.walk((err: Error) => err instanceof Date)
		expect(result).toBeNull()
	})

	it('should handle walk with no predicate', () => {
		const error = new CustomError('Test error', {})
		const result = error.walk()
		expect(result).toBe(error)
	})

	it('should handle deeply nested causes', () => {
		const deepest = new Error('Deepest cause')
		const middle = new CustomError('Middle cause', { cause: deepest })
		const top = new CustomError('Top error', { cause: middle })

		// Find the deepest Error (not BaseError)
		const result = top.walk((err: Error) => !(err instanceof BaseError) && err instanceof Error)

		expect(result).toBe(deepest)
	})
})
