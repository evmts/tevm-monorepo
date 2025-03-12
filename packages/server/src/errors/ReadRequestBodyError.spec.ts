import { describe, expect, it } from 'vitest'
import { ReadRequestBodyError } from './ReadRequestBodyError.js'

describe('ReadRequestBodyError', () => {
	it('should create an error with the correct properties', () => {
		const error = new ReadRequestBodyError('Test error message', {
			cause: new Error('Test details'),
		})

		expect(error.message).toContain('Test error message')
		expect(error.cause).toBeInstanceOf(Error)
		expect(error.cause.message).toBe('Test details')
		expect(error.name).toBe('ReadRequestBodyError')
		expect(error._tag).toBe('ReadRequestBodyError')
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/readrequestbodyerror/')
	})

	it('should create an error without optional parameters', () => {
		const error = new ReadRequestBodyError('Test error message')

		expect(error.message).toContain('Test error message')
		expect(error.name).toBe('ReadRequestBodyError')
		expect(error._tag).toBe('ReadRequestBodyError')
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/readrequestbodyerror/')
	})
})
