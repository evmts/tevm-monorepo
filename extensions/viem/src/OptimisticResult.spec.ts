import type { Abi } from 'abitype'
import type { Chain } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import type { GenError } from './GenError.js'
import type { GenResult } from './GenResult.js'
import type { OptimisticResult } from './OptimisticResult.js'
import type { TypedError } from './TypedError.js'

describe('OptimisticResult type', () => {
	it('should validate GenResult structure', () => {
		// This is a type test that verifies the structure conforms to the expected type
		const mockAbi = [{ name: 'test', type: 'function', inputs: [], outputs: [] }] as const

		// We're creating an object matching the GenResult type, which is part of OptimisticResult
		const successResult: GenResult<unknown, 'OPTIMISTIC_RESULT'> = {
			success: true,
			tag: 'OPTIMISTIC_RESULT',
			data: { some: 'data' },
		}

		// Type assertion
		expect(successResult.success).toBe(true)
		expect(successResult.tag).toBe('OPTIMISTIC_RESULT')
		expect(successResult.data).toBeDefined()
	})

	it('should validate GenError structure', () => {
		// Create an error object matching the GenError type
		const errorResult: GenError<Error, 'OPTIMISTIC_RESULT'> = {
			success: false,
			tag: 'OPTIMISTIC_RESULT',
			error: new Error('Something went wrong'),
		}

		// Type assertion
		expect(errorResult.success).toBe(false)
		expect(errorResult.tag).toBe('OPTIMISTIC_RESULT')
		expect(errorResult.error).toBeInstanceOf(Error)
	})

	it('should validate TypedError structure', () => {
		// Create a typed error
		const error = new Error('Custom error') as TypedError<'TEST_ERROR'>
		error.tag = 'TEST_ERROR'

		// Type assertion
		expect(error.message).toBe('Custom error')
		expect(error.tag).toBe('TEST_ERROR')
	})

	it('should correctly type an OptimisticResult instance', () => {
		// Define minimal ABI and function name for testing
		type TestAbi = [{ name: 'test'; type: 'function'; inputs: []; outputs: [] }]
		const mockAbi = [{ name: 'test', type: 'function', inputs: [], outputs: [] }] as const

		// Create an optimistic result value for successful contract call
		const optimisticResult: OptimisticResult<TestAbi, 'test', Chain> = {
			success: true,
			tag: 'OPTIMISTIC_RESULT',
			data: { [Symbol.iterator]: () => ({ next: () => ({ done: true, value: undefined }) }) },
		}

		// Type assertion
		expect(optimisticResult.success).toBe(true)
		expect(optimisticResult.tag).toBe('OPTIMISTIC_RESULT')
	})
})
