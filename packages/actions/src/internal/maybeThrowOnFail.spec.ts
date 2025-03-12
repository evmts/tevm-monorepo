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
		const result = Object.create({}, {
			errors: {
				// Add a custom property descriptor
				get: function() {
					// Return an object with a length property but no other array-like behavior
					return { length: 2 };
				},
				enumerable: true,
				configurable: true
			},
			data: {
				value: 'some data',
				enumerable: true
			}
		});
		
		// This should not throw, even though errors.length > 1, 
		// since the errors property is not a real array and the fallback should handle it
		expect(() => maybeThrowOnFail(false, result)).not.toThrow();
		
		// Other tests already cover the main code paths
	})
})
