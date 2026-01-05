import { describe, expect, it } from 'vitest'
import { getContractError, RawContractError } from './getContractError.js'
import {
	ContractFunctionExecutionError,
	ContractFunctionRevertedError,
	ContractFunctionZeroDataError,
} from '@tevm/errors'

describe('getContractError', () => {
	const mockAbi = [
		{
			type: 'function',
			name: 'transfer',
			inputs: [
				{ type: 'address', name: 'to' },
				{ type: 'uint256', name: 'amount' },
			],
		},
		{
			type: 'error',
			name: 'InsufficientBalance',
			inputs: [
				{ type: 'uint256', name: 'available' },
				{ type: 'uint256', name: 'required' },
			],
		},
	] as const

	const baseOptions = {
		abi: mockAbi,
		functionName: 'transfer',
		address: '0x1234567890123456789012345678901234567890' as const,
		args: ['0x0000000000000000000000000000000000000001' as const, '100'],
		sender: '0x0000000000000000000000000000000000000002' as const,
	}

	describe('basic error wrapping', () => {
		it('should wrap a plain Error in ContractFunctionExecutionError', () => {
			const err = new Error('Something went wrong')
			const result = getContractError(err, baseOptions)

			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
			expect(result.cause).toBe(err)
		})

		it('should preserve all context in the wrapped error', () => {
			const err = new Error('Something went wrong')
			const result = getContractError(err, {
				...baseOptions,
				docsPath: '/docs/errors',
			})

			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
			// The error should contain function context
			expect(result.message).toContain('transfer')
		})
	})

	describe('RawContractError handling', () => {
		it('should handle RawContractError with data', () => {
			const rawError = new RawContractError({
				data: '0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000124e6f7420656e6f7567682062616c616e63650000000000000000000000000000',
			})
			const result = getContractError(rawError, baseOptions)

			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
		})
	})

	describe('execution reverted errors', () => {
		it('should create ContractFunctionRevertedError for code 3', () => {
			const err = Object.assign(new Error('execution reverted'), {
				code: 3,
				data: '0x08c379a0' as const,
			})
			const result = getContractError(err, baseOptions)

			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
			expect(result.cause).toBeInstanceOf(ContractFunctionRevertedError)
		})

		it('should create ContractFunctionRevertedError for code -32603', () => {
			const err = Object.assign(new Error('internal error'), {
				code: -32603,
				message: 'execution reverted',
			})
			const result = getContractError(err, baseOptions)

			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
			expect(result.cause).toBeInstanceOf(ContractFunctionRevertedError)
		})

		it('should create ContractFunctionRevertedError for code -32000 with execution reverted details', () => {
			const err = Object.assign(new Error('invalid input'), {
				code: -32000,
				details: 'execution reverted',
			})
			const result = getContractError(err, baseOptions)

			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
			expect(result.cause).toBeInstanceOf(ContractFunctionRevertedError)
		})

		it('should handle nested data objects', () => {
			const err = Object.assign(new Error('execution reverted'), {
				code: 3,
				data: { data: '0x08c379a0' as const },
			})
			const result = getContractError(err, baseOptions)

			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
			expect(result.cause).toBeInstanceOf(ContractFunctionRevertedError)
		})
	})

	describe('AbiDecodingZeroDataError handling', () => {
		it('should create ContractFunctionZeroDataError for AbiDecodingZeroDataError', () => {
			const err = Object.assign(new Error('ABI decoding zero data'), {
				name: 'AbiDecodingZeroDataError',
			})
			const result = getContractError(err, baseOptions)

			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
			expect(result.cause).toBeInstanceOf(ContractFunctionZeroDataError)
		})
	})

	describe('error with walk method', () => {
		it('should use walk to find error with data', () => {
			const innerError = Object.assign(new Error('inner'), {
				data: '0x08c379a0' as const,
				code: 3,
			})
			const err = Object.assign(new Error('outer'), {
				walk: (fn?: (e: unknown) => boolean) => {
					if (fn) {
						return fn(innerError) ? innerError : undefined
					}
					return innerError
				},
			})

			const result = getContractError(err, baseOptions)

			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
			expect(result.cause).toBeInstanceOf(ContractFunctionRevertedError)
		})

		it('should fall back to walk() without args when no data found', () => {
			const innerError = new Error('deepest error')
			const err = Object.assign(new Error('outer'), {
				walk: (fn?: (e: unknown) => boolean) => {
					if (fn) {
						// Return undefined to indicate nothing with 'data' was found
						return undefined
					}
					return innerError
				},
			})

			const result = getContractError(err, baseOptions)

			// When walk() finds nothing with data, extractErrorData returns result of walk()
			// but determineCause still uses originalErr as the cause since there are no
			// special error codes to trigger ContractFunctionRevertedError
			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
			// The cause is the original error passed to determineCause
			expect(result.cause).toBe(err)
		})
	})

	describe('shortMessage usage', () => {
		it('should use shortMessage over message when available', () => {
			const err = Object.assign(new Error('full message'), {
				code: 3,
				data: '0x08c379a0' as const,
				shortMessage: 'short msg',
			})
			const result = getContractError(err, baseOptions)

			expect(result).toBeInstanceOf(ContractFunctionExecutionError)
			expect(result.cause).toBeInstanceOf(ContractFunctionRevertedError)
		})
	})
})
