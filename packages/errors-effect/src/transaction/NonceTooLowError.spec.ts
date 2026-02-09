import { Effect, Equal, Hash, HashSet } from 'effect'
import { describe, expect, it } from 'vitest'
import { NonceTooLowError } from './NonceTooLowError.js'

describe('NonceTooLowError', () => {
	it('should create a NonceTooLowError with all properties', () => {
		const error = new NonceTooLowError({
			address: '0x1234567890123456789012345678901234567890',
			expected: 5n,
			actual: 3n,
		})

		expect(error.address).toBe('0x1234567890123456789012345678901234567890')
		expect(error.expected).toBe(5n)
		expect(error.actual).toBe(3n)
		expect(error._tag).toBe('NonceTooLowError')
		expect(error.code).toBe(-32003)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/noncetoolowerror/')
	})

	it('should generate a default message with expected and actual', () => {
		const error = new NonceTooLowError({
			address: '0x1234',
			expected: 5n,
			actual: 3n,
		})

		expect(error.message).toBe('Nonce too low: expected 5, got 3')
	})

	it('should generate a default message without nonce values', () => {
		const error = new NonceTooLowError({
			address: '0x1234',
		})

		expect(error.message).toBe('Transaction nonce too low')
	})

	it('should allow custom message', () => {
		const error = new NonceTooLowError({
			address: '0x1234',
			expected: 5n,
			actual: 3n,
			message: 'Custom nonce too low message',
		})

		expect(error.message).toBe('Custom nonce too low message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new NonceTooLowError({
			address: '0x1234',
			expected: 5n,
			actual: 3n,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('NonceTooLowError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new NonceTooLowError({
			address: '0x1234',
			expected: 5n,
			actual: 3n,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('NonceTooLowError', (e) =>
				Effect.succeed(
					`Missing ${e.expected !== undefined && e.actual !== undefined ? e.expected - e.actual : 0n} transactions for ${e.address}`,
				),
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Missing 2 transactions for 0x1234')
	})

	it('should have correct static properties', () => {
		expect(NonceTooLowError.code).toBe(-32003)
		expect(NonceTooLowError.docsPath).toBe('/reference/tevm/errors/classes/noncetoolowerror/')
	})

	it('should create with empty props', () => {
		const error = new NonceTooLowError()

		expect(error.address).toBeUndefined()
		expect(error.expected).toBeUndefined()
		expect(error.actual).toBeUndefined()
		expect(error._tag).toBe('NonceTooLowError')
		expect(error.message).toBe('Transaction nonce too low')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new NonceTooLowError({
			address: '0x1234567890123456789012345678901234567890',
			expected: 5n,
			actual: 3n,
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Already processed')
		const error = new NonceTooLowError({
			address: '0x1234567890123456789012345678901234567890',
			expected: 5n,
			actual: 3n,
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Already processed')
	})

	it('should have undefined cause when not provided', () => {
		const error = new NonceTooLowError({
			address: '0x1234',
			expected: 5n,
			actual: 3n,
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new NonceTooLowError({
				address: '0x1234567890123456789012345678901234567890',
				expected: 5n,
				actual: 3n,
			})
			const error2 = new NonceTooLowError({
				address: '0x1234567890123456789012345678901234567890',
				expected: 5n,
				actual: 3n,
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new NonceTooLowError({
				address: '0x1234',
				expected: 5n,
				actual: 3n,
			})
			const error2 = new NonceTooLowError({
				address: '0x1234',
				expected: 10n,
				actual: 3n,
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new NonceTooLowError({
				address: '0xABCD',
				expected: 7n,
				actual: 4n,
			})
			const error2 = new NonceTooLowError({
				address: '0xABCD',
				expected: 7n,
				actual: 4n,
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new NonceTooLowError({
				address: '0x1111',
				expected: 5n,
				actual: 3n,
			})
			const error2 = new NonceTooLowError({
				address: '0x2222',
				expected: 5n,
				actual: 3n,
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new NonceTooLowError({
				address: '0xDEAD',
				expected: 100n,
				actual: 50n,
			})
			const error2 = new NonceTooLowError({
				address: '0xDEAD',
				expected: 100n,
				actual: 50n,
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
