import { describe, expect, it } from 'vitest'
import { DefensiveNullCheckError } from './DefensiveNullCheckError.js'
import { UnreachableCodeError } from './UnreachableCodeError.js'

describe('DefensiveNullCheckError', () => {
	it('should create a DefensiveNullCheckError with a custom message', () => {
		const error = new DefensiveNullCheckError('Custom null check error')
		expect(error.message).toContain('Custom null check error')
		expect(error.name).toBe('DefensiveNullCheckError')
		expect(error._tag).toBe('DefensiveNullCheckError')
	})

	it('should create a DefensiveNullCheckError with default message if none provided', () => {
		const error = new DefensiveNullCheckError()
		expect(error.message).toContain('Defensive null check error occurred.')
		expect(error.name).toBe('DefensiveNullCheckError')
	})

	it('should create a DefensiveNullCheckError with docs link in message', () => {
		// Note: InternalError class hardcodes the docsBaseUrl and docsPath, so custom values won't be used
		const error = new DefensiveNullCheckError('Custom error')
		// The message should contain a docs URL
		expect(error.message).toContain('https://tevm.sh')
		expect(error.message).toContain('/reference/tevm/errors/classes/internalerror/')
	})

	it('should create a DefensiveNullCheckError with meta information', () => {
		const error = new DefensiveNullCheckError('Custom error', {
			metaMessages: ['Additional info', 'More info'],
			details: 'Detailed explanation',
			meta: { key: 'value' },
		})
		expect(error.metaMessages).toEqual(['Additional info', 'More info'])
		// Details might be included in the message
		expect(error.message).toContain('Custom error')
		expect(error.meta).toEqual({ key: 'value' })
	})
})

describe('UnreachableCodeError', () => {
	it('should create an UnreachableCodeError with a value and custom message', () => {
		const value = { type: 'unknownShape' }
		const error = new UnreachableCodeError(value, 'Unreachable code execution')
		expect(error.message).toContain('Unreachable code execution')
		expect(error.value).toBe(value)
		expect(error.name).toBe('UnreachableCodeError')
		expect(error._tag).toBe('UnreachableCodeError')
	})

	it('should create an UnreachableCodeError with just a value using default message', () => {
		const value = 'invalidValue'
		const error = new UnreachableCodeError(value)
		expect(error.message).toContain('Unreachable code executed with value:')
		expect(error.message).toContain('"invalidValue"')
		expect(error.value).toBe(value)
	})

	it('should create an UnreachableCodeError with docs link in message', () => {
		// Note: InternalError class hardcodes the docsBaseUrl and docsPath, so custom values won't be used
		const error = new UnreachableCodeError('value', 'Custom error')
		// The message should contain a docs URL
		expect(error.message).toContain('https://tevm.sh')
		expect(error.message).toContain('/reference/tevm/errors/classes/internalerror/')
	})

	it('should create an UnreachableCodeError with complex value and stringify it correctly', () => {
		const complexValue = { nested: { array: [1, 2, 3], nullValue: null } }
		const error = new UnreachableCodeError(complexValue)
		const valueJson = JSON.stringify(complexValue)
		expect(error.message).toContain(valueJson)
		expect(error.value).toBe(complexValue)
	})
})
