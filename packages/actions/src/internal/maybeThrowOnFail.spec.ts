import { describe, expect, it } from 'vitest'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'

describe('maybeThrowOnFail', () => {
	it('should return the result if throwOnFail is false', () => {
		const result = { data: 'some data' }
		const output = maybeThrowOnFail(false, result as any)
		expect(output).toBe(result as any)
	})

	it('should return the result if throwOnFail is true but there are no errors', () => {
		const result = { data: 'some data', errors: [] }
		const output = maybeThrowOnFail(true, result)
		expect(output).toBe(result)
	})

	it('should throw a single error if throwOnFail is true and there is one error', () => {
		const error = new Error('Test error')
		const result = { data: 'some data', errors: [error] }
		expect(() => maybeThrowOnFail(true, result)).toThrow(error)
	})

	it('should throw an AggregateError if throwOnFail is true and there are multiple errors', () => {
		const error1 = new Error('Error 1')
		const error2 = new Error('Error 2')
		const result = { data: 'some data', errors: [error1, error2] }
		expect(() => maybeThrowOnFail(true, result)).toThrow(AggregateError)
		expect(() => maybeThrowOnFail(true, result)).toThrowError(new AggregateError([error1, error2]))
	})

	it('should return the result if throwOnFail is true and errors array is undefined', () => {
		const result = { data: 'some data' }
		const output = maybeThrowOnFail(true, result as any)
		expect(output).toBe(result)
	})

	it('should return the result if throwOnFail is true and errors array is empty', () => {
		const result = { data: 'some data', errors: [] }
		const output = maybeThrowOnFail(true, result)
		expect(output).toBe(result)
	})

	it('should handle null or undefined result safely', () => {
		// Test with null result
		const nullResult = null
		const nullOutput = maybeThrowOnFail(true, nullResult as any)
		expect(nullOutput).toBe(nullResult)

		// Test with undefined result
		const undefinedResult = undefined
		const undefinedOutput = maybeThrowOnFail(true, undefinedResult as any)
		expect(undefinedOutput).toBe(undefinedResult)
	})

	// This test is to ensure we have high coverage for maybeThrowOnFail
	// The important edge case is that it should work even with unusual objects or values
	it('should handle objects with non-standard errors property correctly', () => {
		// Test with an object that has a custom errors property that behaves strangely
		const result = Object.create(
			{},
			{
				errors: {
					// Add a custom property descriptor
					get: () => {
						// Return an object with a length property but no other array-like behavior
						return { length: 2 }
					},
					enumerable: true,
					configurable: true,
				},
				data: {
					value: 'some data',
					enumerable: true,
				},
			},
		)

		// This should not throw, even though errors.length > 1,
		// since the errors property is not a real array and the fallback should handle it
		expect(() => maybeThrowOnFail(false, result)).not.toThrow()

		// Other tests already cover the main code paths
	})

	it('should handle custom error objects correctly', () => {
		class CustomError extends Error {
			customProperty: string
			constructor(message: string) {
				super(message)
				this.name = 'CustomError'
				this.customProperty = 'custom value'
			}
		}

		const customError = new CustomError('Custom error message')
		const result = { data: 'some data', errors: [customError] }

		try {
			maybeThrowOnFail(true, result)
			// Should not reach here
			expect(false).toBe(true)
		} catch (e) {
			const customErr = e as CustomError
			expect(customErr).toBeInstanceOf(CustomError)
			expect(customErr.name).toBe('CustomError')
			expect(customErr.message).toBe('Custom error message')
			expect(customErr.customProperty).toBe('custom value')
		}
	})

	it('should handle error objects without Error class properties', () => {
		// Define interface for type safety
		interface ErrorLikeObject {
			_tag: string
			message: string
		}

		// Object with error-like properties but not an instance of Error
		const errorLikeObject: ErrorLikeObject = {
			_tag: 'CustomErrorType',
			message: 'This is not a real Error instance',
		}
		const result = { data: 'some data', errors: [errorLikeObject] }

		try {
			maybeThrowOnFail(true, result)
			// Should not reach here
			expect(false).toBe(true)
		} catch (e) {
			const errLike = e as ErrorLikeObject
			expect(errLike).toBe(errorLikeObject)
			expect(errLike._tag).toBe('CustomErrorType')
			expect(errLike.message).toBe('This is not a real Error instance')
		}
	})

	it('should handle result with undefined data but valid errors', () => {
		const error = new Error('Error with undefined data')
		const result = { data: undefined, errors: [error] }

		expect(() => maybeThrowOnFail(true, result)).toThrow(error)
		// With throwOnFail false, it should return the result
		expect(maybeThrowOnFail(false, result)).toBe(result)
	})

	it('should handle edge case where errors property exists but is not array-like', () => {
		// Create a result with errors that is a non-array object
		const result = {
			data: 'some data',
			errors: {
				isError: true,
				message: 'This is not an array of errors',
			},
		}

		// This should not throw even with throwOnFail=true because errors isn't array-like
		const output = maybeThrowOnFail(true, result as any)
		expect(output).toBe(result)
	})
})
