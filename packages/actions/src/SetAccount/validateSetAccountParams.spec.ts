import {
	InvalidAddressError,
	InvalidBalanceError,
	InvalidDeployedBytecodeError,
	InvalidNonceError,
	InvalidRequestError,
	InvalidStorageRootError,
} from '@tevm/errors'
import { describe, expect, it } from 'vitest'
import { validateSetAccountParams } from './validateSetAccountParams.js'

describe('validateSetAccountParams', () => {
	it('should return no errors for valid input', () => {
		const validParams = {
			address: '0x1234567890123456789012345678901234567890' as const,
			nonce: 1n,
			balance: 100n,
			deployedBytecode: '0x1234' as const,
			storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as const,
			state: { '0x01': '0x02' } as const,
		}
		const errors = validateSetAccountParams(validParams)
		expect(errors).toHaveLength(0)
	})

	it('should return InvalidAddressError for invalid address', () => {
		const invalidParams = {
			address: '0x123' as const, // Too short
		}
		const errors = validateSetAccountParams(invalidParams)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidAddressError)
	})

	it('should return InvalidNonceError for invalid nonce', () => {
		const invalidParams = {
			address: '0x1234567890123456789012345678901234567890' as const,
			nonce: -1n,
		}
		const errors = validateSetAccountParams(invalidParams)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidNonceError)
	})

	it('should return InvalidBalanceError for invalid balance', () => {
		const invalidParams = {
			address: '0x1234567890123456789012345678901234567890' as const,
			balance: -100n,
		}
		const errors = validateSetAccountParams(invalidParams)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidBalanceError)
	})

	it('should return InvalidDeployedBytecodeError for invalid deployedBytecode', () => {
		const invalidParams = {
			address: '0x1234567890123456789012345678901234567890' as const,
			deployedBytecode: '0x123' as const, // Odd number of characters
		}
		const errors = validateSetAccountParams(invalidParams)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidDeployedBytecodeError)
	})

	it('should return InvalidStorageRootError for invalid storageRoot', () => {
		const invalidParams = {
			address: '0x1234567890123456789012345678901234567890' as const,
			storageRoot: '0x123' as const, // Too short
		}
		const errors = validateSetAccountParams(invalidParams)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidStorageRootError)
	})

	it('should return InvalidRequestError for invalid state', () => {
		const invalidParams = {
			address: '0x1234567890123456789012345678901234567890' as const,
			state: 'what is this',
		}
		// @ts-expect-error - Intentionally invalid state
		const errors = validateSetAccountParams(invalidParams)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidRequestError)
	})

	it('should return InvalidRequestError for invalid stateDiff', () => {
		const invalidParams = {
			address: '0x1234567890123456789012345678901234567890' as const,
			stateDiff: true,
		}
		// @ts-expect-error - Intentionally invalid stateDiff
		const errors = validateSetAccountParams(invalidParams)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidRequestError)
	})

	it('should return multiple errors for multiple invalid fields', () => {
		const invalidParams = {
			address: '0x123' as const, // Invalid
			nonce: -1n, // Invalid
			balance: -100n, // Invalid
			deployedBytecode: '0x123' as const, // Invalid
			storageRoot: '0x123' as const, // Invalid
			state: { '0x123': 'not a hex value' }, // Invalid
		}
		// @ts-expect-error - Intentionally invalid params
		const errors = validateSetAccountParams(invalidParams)
		expect(errors.length).toBeGreaterThan(1)
		expect(errors.some((e) => e instanceof InvalidAddressError)).toBe(true)
		expect(errors.some((e) => e instanceof InvalidNonceError)).toBe(true)
		expect(errors.some((e) => e instanceof InvalidBalanceError)).toBe(true)
		expect(errors.some((e) => e instanceof InvalidDeployedBytecodeError)).toBe(true)
		expect(errors.some((e) => e instanceof InvalidStorageRootError)).toBe(true)
	})

	it('should return InvalidRequestError for invalid throwOnFail', () => {
		const invalidParams = {
			address: '0x1234567890123456789012345678901234567890' as const,
			throwOnFail: 'not a boolean',
		}
		// @ts-expect-error - Intentionally invalid throwOnFail
		const errors = validateSetAccountParams(invalidParams)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toBeInstanceOf(InvalidRequestError)
	})

	it('should handle undefined optional fields', () => {
		const params = {
			address: '0x1234567890123456789012345678901234567890' as const,
		}
		const errors = validateSetAccountParams(params)
		expect(errors).toHaveLength(0)
	})
})
