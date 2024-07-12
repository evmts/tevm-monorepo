import { describe, expect, it } from 'bun:test'
import { DefensiveNullCheckError } from '@tevm/errors'
import { invariant } from './invariant.js'

describe('invariant', () => {
	it('should not throw an error if the condition is true', () => {
		expect(() => invariant(true)).not.toThrow()
	})

	it('should throw a DefensiveNullCheckError if the condition is false and no error is provided', () => {
		expect(() => invariant(false)).toThrow(DefensiveNullCheckError)
	})

	it('should throw the provided error if the condition is false', () => {
		class CustomError extends Error {}
		const customError = new CustomError('Custom error message')
		expect(() => invariant(false, customError)).toThrow(customError)
	})

	it('should not throw an error for truthy conditions', () => {
		expect(() => invariant(1)).not.toThrow()
		expect(() => invariant('non-empty string')).not.toThrow()
		expect(() => invariant([])).not.toThrow()
		expect(() => invariant({})).not.toThrow()
	})

	it('should throw an error for falsy conditions', () => {
		expect(() => invariant(0)).toThrow(DefensiveNullCheckError)
		expect(() => invariant('')).toThrow(DefensiveNullCheckError)
		expect(() => invariant(null)).toThrow(DefensiveNullCheckError)
		expect(() => invariant(undefined)).toThrow(DefensiveNullCheckError)
		expect(() => invariant(Number.NaN)).toThrow(DefensiveNullCheckError)
	})
})
