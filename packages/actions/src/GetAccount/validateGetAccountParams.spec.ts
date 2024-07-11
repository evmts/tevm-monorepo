import { describe, expect, it } from 'bun:test'
import { validateGetAccountParams } from './validateGetAccountParams.js'
import { InvalidAddressError, InvalidRequestError } from '@tevm/errors'

describe('validateGetAccountParams', () => {
	it('should return an empty array if parameters are valid', () => {
		const validParams = {
			address: `0x${'1'.repeat(40)}`,
			throwOnFail: true,
			returnStorage: true,
		} as const
		const errors = validateGetAccountParams(validParams)
		expect(errors).toEqual([])
	})

	it('should return InvalidAddressError for an invalid address', () => {
		const invalidParams = {
			address: 'invalidAddress',
			throwOnFail: true,
			returnStorage: true,
		}
		const errors = validateGetAccountParams(invalidParams as any)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidAddressError)
		expect(errors).toMatchSnapshot()
	})

	it('should return InvalidRequestError for an invalid throwOnFail parameter', () => {
		const invalidParams = {
			address: `0x${'1'.repeat(40)}`,
			throwOnFail: 'notABoolean',
			returnStorage: true,
		}
		const errors = validateGetAccountParams(invalidParams as any)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidRequestError)
		expect(errors).toMatchSnapshot()
	})

	it('should return InvalidRequestError for an invalid returnStorage parameter', () => {
		const invalidParams = {
			address: `0x${'1'.repeat(40)}`,
			throwOnFail: true,
			returnStorage: 'notABoolean',
		}
		const errors = validateGetAccountParams(invalidParams as any)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidRequestError)
		expect(errors).toMatchSnapshot()
	})

	it('should return multiple errors for multiple invalid parameters', () => {
		const invalidParams = {
			address: 'invalidAddress',
			throwOnFail: 'notABoolean',
			returnStorage: 'notABoolean',
		}
		const errors = validateGetAccountParams(invalidParams as any)
		expect(errors).toHaveLength(3)
		expect(errors).toMatchSnapshot()
	})

	it('should handle additional errors in the formattedErrors._errors array', () => {
		const invalidParams = {
			address: `0x${'1'.repeat(40)}`,
			throwOnFail: true,
			returnStorage: true,
		}
		const errors = validateGetAccountParams(invalidParams as any)
		// Manually adding an error to the _errors array for testing
		errors.push(new InvalidRequestError('Test error'))
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidRequestError)
		expect(errors).toMatchSnapshot()
	})
})
