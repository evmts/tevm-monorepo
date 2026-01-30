import { describe, expect, it } from 'vitest'
import { toBaseError } from './toBaseError.js'
import { TevmError } from '../TevmError.js'
import { InsufficientBalanceError } from '../evm/InsufficientBalanceError.js'
import { OutOfGasError } from '../evm/OutOfGasError.js'

describe('toBaseError', () => {
	it('should convert TevmError to BaseError-like object', () => {
		const error = new TevmError({
			message: 'Test error',
			code: -32000,
			docsPath: '/reference/tevm/errors/',
		})

		const result = toBaseError(error)

		expect(result._tag).toBe('TevmError')
		expect(result.name).toBe('TevmError')
		expect(result.message).toBe('Test error')
		expect(result.code).toBe(-32000)
		expect(result.docsPath).toBe('/reference/tevm/errors/')
		expect(result.shortMessage).toBe('Test error')
		expect(result.version).toBe('1.0.0-next.148')
	})

	it('should convert InsufficientBalanceError to BaseError-like object', () => {
		const error = new InsufficientBalanceError({
			address: '0x1234567890123456789012345678901234567890',
			required: 100n,
			available: 50n,
		})

		const result = toBaseError(error)

		expect(result._tag).toBe('InsufficientBalanceError')
		expect(result.name).toBe('InsufficientBalanceError')
		expect(result.code).toBe(-32000)
		expect(result.docsPath).toBe('/reference/tevm/errors/classes/insufficientbalanceerror/')
	})

	it('should preserve error-specific properties on InsufficientBalanceError', () => {
		const error = new InsufficientBalanceError({
			address: '0x1234567890123456789012345678901234567890',
			required: 100n,
			available: 50n,
		})

		const result = toBaseError(error) as ReturnType<typeof toBaseError> & {
			address: string
			required: bigint
			available: bigint
		}

		expect(result.address).toBe('0x1234567890123456789012345678901234567890')
		expect(result.required).toBe(100n)
		expect(result.available).toBe(50n)
	})

	it('should convert OutOfGasError to BaseError-like object', () => {
		const error = new OutOfGasError({
			gasUsed: 100000n,
			gasLimit: 21000n,
		})

		const result = toBaseError(error)

		expect(result._tag).toBe('OutOfGasError')
		expect(result.name).toBe('OutOfGasError')
		expect(result.code).toBe(-32003)
	})

	it('should preserve error-specific properties on OutOfGasError', () => {
		const error = new OutOfGasError({
			gasUsed: 100000n,
			gasLimit: 21000n,
		})

		const result = toBaseError(error) as ReturnType<typeof toBaseError> & {
			gasUsed: bigint
			gasLimit: bigint
		}

		expect(result.gasUsed).toBe(100000n)
		expect(result.gasLimit).toBe(21000n)
	})

	it('should produce an Error instance', () => {
		const error = new TevmError({
			message: 'Test error',
			code: -32000,
		})

		const result = toBaseError(error)

		expect(result).toBeInstanceOf(Error)
	})

	it('should be throwable', () => {
		const error = new TevmError({
			message: 'Throwable error',
			code: -32000,
		})

		const result = toBaseError(error)

		expect(() => {
			throw result
		}).toThrow('Throwable error')
	})

	it('should preserve undefined docsPath', () => {
		const error = new TevmError({
			message: 'Test error',
			code: -32000,
		})

		const result = toBaseError(error)

		expect(result.docsPath).toBeUndefined()
	})

	describe('walk method', () => {
		it('should have a walk method', () => {
			const error = new TevmError({
				message: 'Test error',
				code: -32000,
			})

			const result = toBaseError(error)

			expect(typeof result.walk).toBe('function')
		})

		it('should return the error itself when called without a predicate', () => {
			const error = new TevmError({
				message: 'Test error',
				code: -32000,
			})

			const result = toBaseError(error)
			const walked = result.walk()

			expect(walked).toBe(result)
		})

		it('should return the error when predicate matches', () => {
			const error = new TevmError({
				message: 'Test error',
				code: -32000,
			})

			const result = toBaseError(error)
			const walked = result.walk((err) => err instanceof Error)

			expect(walked).toBe(result)
		})

		it('should return null when predicate does not match', () => {
			const error = new TevmError({
				message: 'Test error',
				code: -32000,
			})

			const result = toBaseError(error)
			const walked = result.walk((err) => err === 'never matches')

			expect(walked).toBeNull()
		})

		it('should traverse error chain through cause property', () => {
			// Create a chain of errors
			const rootCause = new Error('Root cause')
			const middleError = new Error('Middle error')
			// @ts-expect-error - adding cause property
			middleError.cause = rootCause

			const topError = new TevmError({
				message: 'Top error',
				code: -32000,
				cause: middleError,
			})

			const result = toBaseError(topError)
			// @ts-expect-error - result has cause property
			result.cause = middleError

			// Find the first error that is a plain Error (no _tag property)
			// This should traverse from result (has _tag) to middleError (no _tag)
			const walked = result.walk((err) => {
				return err instanceof Error && !('_tag' in (err as object))
			})

			// Should find middleError since it's the first in the chain without _tag
			expect(walked).toBe(middleError)
		})
	})
})
