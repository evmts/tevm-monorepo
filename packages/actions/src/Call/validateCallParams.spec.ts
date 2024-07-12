import { describe, expect, it } from 'bun:test'
import { InvalidBytecodeError, InvalidDataError, InvalidSaltError } from '@tevm/errors'
import { validateBaseCallParams } from '../BaseCall/validateBaseCallParams.js'
import { validateCallParams } from './validateCallParams.js'

describe('validateCallParams', () => {
	it('should return no errors for valid params', () => {
		const action = { data: '0x1234', code: '0x5678', salt: '0x90ab' }

		const errors = validateCallParams(action as any)
		expect(errors).toEqual([])
	})

	it('should return InvalidSaltError for invalid salt', () => {
		const action = { salt: 1234 } // invalid salt

		const errors = validateCallParams(action as any)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidSaltError)
	})

	it('should return InvalidDataError for invalid data', () => {
		const action = { data: 1234 } // invalid data

		const errors = validateCallParams(action as any)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidDataError)
	})

	it('should return InvalidBytecodeError for invalid code', () => {
		const action = { code: 1234 } // invalid code

		const errors = validateCallParams(action as any)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidBytecodeError)
	})

	it('should return multiple errors for multiple invalid fields', () => {
		const action = { salt: 1234, data: 5678, code: 9012 } // all invalid

		const errors = validateCallParams(action as any)
		expect(errors).toHaveLength(3)
		expect(errors).toEqual([
			expect.any(InvalidSaltError),
			expect.any(InvalidDataError),
			expect.any(InvalidBytecodeError),
		])
	})

	it('should return errors from validateBaseCallParams', () => {
		const action = {}
		const baseErrors = validateBaseCallParams(action)

		const errors = validateCallParams(action)
		expect(errors).toEqual(baseErrors)
	})

	it('should combine base errors and zod errors', () => {
		const action = { salt: 1234, data: 5678, code: 9012 } // all invalid
		const baseErrors = validateBaseCallParams(action as any)

		const errors = validateCallParams(action as any)
		expect(errors).toHaveLength(baseErrors.length + 3)
		expect(errors).toEqual([
			...baseErrors,
			expect.any(InvalidSaltError),
			expect.any(InvalidDataError),
			expect.any(InvalidBytecodeError),
		])
	})

	it('code and deployedbytecode', () => {
		const action = { code: '0x1234', deployedBytecode: '0x5678' }

		const errors = validateCallParams(action as any)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toMatchSnapshot()
	})

	it('createTransaction and stateOverrideSet', () => {
		const action = {
			createTransaction: true,
			stateOverrideSet: {
				'0x1234': { nonce: 0n, balance: 0n, code: '0x5678' },
			},
		}

		const errors = validateCallParams(action as any)
		expect(errors).toHaveLength(2)
		expect(errors[0]).toMatchSnapshot()
	})
})
