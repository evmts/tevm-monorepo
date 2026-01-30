import { describe, expect, it } from 'vitest'
import { toBaseError } from './toBaseError.js'
import { toTaggedError } from './toTaggedError.js'
import { TevmError } from '../TevmError.js'
import { InsufficientBalanceError } from '../evm/InsufficientBalanceError.js'
import { OutOfGasError } from '../evm/OutOfGasError.js'
import { RevertError } from '../evm/RevertError.js'
import { StackUnderflowError } from '../evm/StackUnderflowError.js'
import { StackOverflowError } from '../evm/StackOverflowError.js'

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
		expect(result.code).toBe(-32015)
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
			const middleError = new Error('Middle error', { cause: rootCause })

			const topError = new TevmError({
				message: 'Top error',
				code: -32000,
				cause: middleError,
			})

			const result = toBaseError(topError)

			// Cause should be automatically preserved by toBaseError
			expect(result.cause).toBe(middleError)

			// Find the first error that is a plain Error (no _tag property)
			// This should traverse from result (has _tag) to middleError (no _tag)
			const walked = result.walk((err) => {
				return err instanceof Error && !('_tag' in (err as object))
			})

			// Should find middleError since it's the first in the chain without _tag
			expect(walked).toBe(middleError)
		})
	})

	describe('cause property preservation', () => {
		it('should explicitly preserve cause property', () => {
			const cause = new Error('Underlying cause')
			const error = new TevmError({
				message: 'Top level error',
				code: -32000,
				cause,
			})

			const result = toBaseError(error)

			expect(result.cause).toBe(cause)
		})

		it('should handle undefined cause', () => {
			const error = new TevmError({
				message: 'No cause',
				code: -32000,
			})

			const result = toBaseError(error)

			expect(result.cause).toBeUndefined()
		})
	})

	describe('details computation', () => {
		it('should compute details from cause message', () => {
			const cause = new Error('This is the underlying error')
			const error = new TevmError({
				message: 'Top error',
				code: -32000,
				cause,
			})

			const result = toBaseError(error)

			expect(result.details).toBe('This is the underlying error')
		})

		it('should compute empty details when no cause', () => {
			const error = new TevmError({
				message: 'No cause',
				code: -32000,
			})

			const result = toBaseError(error)

			expect(result.details).toBe('')
		})

		it('should use string cause directly as details', () => {
			const error = new TevmError({
				message: 'Top error',
				code: -32000,
				cause: 'String cause',
			})

			const result = toBaseError(error)

			expect(result.details).toBe('String cause')
		})

		it('should JSON stringify object causes without message', () => {
			const error = new TevmError({
				message: 'Top error',
				code: -32000,
				cause: { code: 123, data: 'test' },
			})

			const result = toBaseError(error)

			expect(result.details).toBe('{"code":123,"data":"test"}')
		})

		it('should return empty string for non-object primitive cause (e.g., number)', () => {
			const error = new TevmError({
				message: 'Top error',
				code: -32000,
				cause: 12345,
			})

			const result = toBaseError(error)

			expect(result.details).toBe('')
		})

		it('should use errorType property when cause has errorType but no message', () => {
			const error = new TevmError({
				message: 'Top error',
				code: -32000,
				cause: { errorType: 'ValidationError' },
			})

			const result = toBaseError(error)

			expect(result.details).toBe('ValidationError')
		})

		it('should handle circular reference in cause object', () => {
			// Create an object with a circular reference
			const circularCause: Record<string, unknown> = { name: 'circular' }
			circularCause.self = circularCause

			const error = new TevmError({
				message: 'Top error',
				code: -32000,
				cause: circularCause,
			})

			const result = toBaseError(error)

			expect(result.details).toBe('Unable to parse error details')
		})
	})

	describe('round-trip conversion', () => {
		it('should preserve InsufficientBalanceError properties through round-trip', () => {
			const original = new InsufficientBalanceError({
				address: '0x1234567890123456789012345678901234567890',
				required: 1000000n,
				available: 500000n,
			})

			const baseError = toBaseError(original)
			const roundTripped = toTaggedError(baseError)

			expect(roundTripped._tag).toBe('InsufficientBalanceError')
			expect((roundTripped as InsufficientBalanceError).address).toBe('0x1234567890123456789012345678901234567890')
			expect((roundTripped as InsufficientBalanceError).required).toBe(1000000n)
			expect((roundTripped as InsufficientBalanceError).available).toBe(500000n)
		})

		it('should preserve OutOfGasError properties through round-trip', () => {
			const original = new OutOfGasError({
				gasUsed: 50000n,
				gasLimit: 21000n,
			})

			const baseError = toBaseError(original)
			const roundTripped = toTaggedError(baseError)

			expect(roundTripped._tag).toBe('OutOfGasError')
			expect((roundTripped as OutOfGasError).gasUsed).toBe(50000n)
			expect((roundTripped as OutOfGasError).gasLimit).toBe(21000n)
		})

		it('should preserve RevertError properties through round-trip', () => {
			const original = new RevertError({
				raw: '0xaabbccdd',
				reason: 'Insufficient allowance',
			})

			const baseError = toBaseError(original)
			const roundTripped = toTaggedError(baseError)

			expect(roundTripped._tag).toBe('RevertError')
			expect((roundTripped as RevertError).raw).toBe('0xaabbccdd')
			expect((roundTripped as RevertError).reason).toBe('Insufficient allowance')
		})

		it('should preserve StackUnderflowError properties through round-trip', () => {
			const original = new StackUnderflowError({
				requiredItems: 3,
				availableItems: 1,
			})

			const baseError = toBaseError(original)
			const roundTripped = toTaggedError(baseError)

			expect(roundTripped._tag).toBe('StackUnderflowError')
			expect((roundTripped as StackUnderflowError).requiredItems).toBe(3)
			expect((roundTripped as StackUnderflowError).availableItems).toBe(1)
		})

		it('should preserve StackOverflowError properties through round-trip', () => {
			const original = new StackOverflowError({
				stackSize: 1025,
			})

			const baseError = toBaseError(original)
			const roundTripped = toTaggedError(baseError)

			expect(roundTripped._tag).toBe('StackOverflowError')
			expect((roundTripped as StackOverflowError).stackSize).toBe(1025)
		})

		it('should preserve cause through round-trip', () => {
			const cause = new Error('Original cause')
			const original = new TevmError({
				message: 'Test error',
				code: -32000,
				cause,
			})

			const baseError = toBaseError(original)
			const roundTripped = toTaggedError(baseError)

			expect(roundTripped.cause).toBe(cause)
		})
	})

	describe('metaMessages property', () => {
		it('should extract metaMessages from error that has them', () => {
			// Create an error-like object with metaMessages
			const errorWithMeta = Object.assign(
				new TevmError({
					message: 'Test error',
					code: -32000,
				}),
				{ metaMessages: ['Additional info 1', 'Additional info 2'] }
			)

			const result = toBaseError(errorWithMeta)

			expect(result.metaMessages).toEqual(['Additional info 1', 'Additional info 2'])
		})

		it('should have undefined metaMessages when not present on error', () => {
			const error = new TevmError({
				message: 'Test error',
				code: -32000,
			})

			const result = toBaseError(error)

			expect(result.metaMessages).toBeUndefined()
		})
	})
})
