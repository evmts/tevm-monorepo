import { InvalidAddressError, InvalidBalanceError, InvalidNonceError, InvalidRequestError } from '@tevm/errors'
import { describe, expect, it } from 'vitest'
import { validateMineParams } from './validateMineParams.js'

describe('validateMineParams', () => {
	it('should return no errors for valid params', () => {
		const action = {
			blockCount: 5,
			interval: 10,
			throwOnFail: false,
		}
		const errors = validateMineParams(action)
		expect(errors).toEqual([])
	})

	it('should return InvalidAddressError for invalid blockCount', () => {
		const action = {
			blockCount: -1, // invalid blockCount
			interval: 10,
			throwOnFail: false,
		}
		const errors = validateMineParams(action)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidAddressError)
	})

	it('should return InvalidNonceError for invalid interval', () => {
		const action = {
			blockCount: 5,
			interval: -10, // invalid interval
			throwOnFail: false,
		}
		const errors = validateMineParams(action)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidNonceError)
	})

	it('should return InvalidBalanceError for invalid throwOnFail', () => {
		const action = {
			blockCount: 5,
			interval: 10,
			throwOnFail: 'invalid' as any, // invalid throwOnFail
		}
		const errors = validateMineParams(action)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidBalanceError)
	})

	it('should return multiple errors for multiple invalid fields', () => {
		const action = {
			blockCount: -1, // invalid blockCount
			interval: -10, // invalid interval
			throwOnFail: 'invalid' as any, // invalid throwOnFail
		}
		const errors = validateMineParams(action)
		expect(errors).toHaveLength(3)
		expect(errors).toMatchSnapshot()
	})

	it('should return InvalidRequestError for invalid base params', () => {
		const action = 'huh' as any
		const errors = validateMineParams(action)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidRequestError)
	})
})