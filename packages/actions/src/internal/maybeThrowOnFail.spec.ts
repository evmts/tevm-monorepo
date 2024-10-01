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
})
