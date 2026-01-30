import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { NonceTooHighError } from './NonceTooHighError.js'

describe('NonceTooHighError', () => {
	it('should create a NonceTooHighError with all properties', () => {
		const error = new NonceTooHighError({
			address: '0x1234567890123456789012345678901234567890',
			expected: 5n,
			actual: 10n,
		})

		expect(error.address).toBe('0x1234567890123456789012345678901234567890')
		expect(error.expected).toBe(5n)
		expect(error.actual).toBe(10n)
		expect(error._tag).toBe('NonceTooHighError')
		expect(error.code).toBe(-32003)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/noncetoohigherror/')
	})

	it('should generate a default message with expected and actual', () => {
		const error = new NonceTooHighError({
			address: '0x1234',
			expected: 5n,
			actual: 10n,
		})

		expect(error.message).toBe('Nonce too high: expected 5, got 10')
	})

	it('should generate a default message without nonce values', () => {
		const error = new NonceTooHighError({
			address: '0x1234',
		})

		expect(error.message).toBe('Transaction nonce too high')
	})

	it('should allow custom message', () => {
		const error = new NonceTooHighError({
			address: '0x1234',
			expected: 5n,
			actual: 10n,
			message: 'Custom nonce too high message',
		})

		expect(error.message).toBe('Custom nonce too high message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new NonceTooHighError({
			address: '0x1234',
			expected: 5n,
			actual: 10n,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('NonceTooHighError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new NonceTooHighError({
			address: '0x1234',
			expected: 5n,
			actual: 10n,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('NonceTooHighError', (e) =>
				Effect.succeed(`Gap of ${e.actual !== undefined && e.expected !== undefined ? e.actual - e.expected : 0n} for ${e.address}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Gap of 5 for 0x1234')
	})

	it('should have correct static properties', () => {
		expect(NonceTooHighError.code).toBe(-32003)
		expect(NonceTooHighError.docsPath).toBe('/reference/tevm/errors/classes/noncetoohigherror/')
	})

	it('should create with empty props', () => {
		const error = new NonceTooHighError()

		expect(error.address).toBeUndefined()
		expect(error.expected).toBeUndefined()
		expect(error.actual).toBeUndefined()
		expect(error._tag).toBe('NonceTooHighError')
		expect(error.message).toBe('Transaction nonce too high')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new NonceTooHighError({
			address: '0x1234567890123456789012345678901234567890',
			expected: 5n,
			actual: 10n,
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Missing transactions')
		const error = new NonceTooHighError({
			address: '0x1234567890123456789012345678901234567890',
			expected: 5n,
			actual: 10n,
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Missing transactions')
	})

	it('should have undefined cause when not provided', () => {
		const error = new NonceTooHighError({
			address: '0x1234',
			expected: 5n,
			actual: 10n,
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new NonceTooHighError({
				address: '0x1234567890123456789012345678901234567890',
				expected: 5n,
				actual: 10n,
			})
			const error2 = new NonceTooHighError({
				address: '0x1234567890123456789012345678901234567890',
				expected: 5n,
				actual: 10n,
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new NonceTooHighError({
				address: '0x1234',
				expected: 5n,
				actual: 10n,
			})
			const error2 = new NonceTooHighError({
				address: '0x1234',
				expected: 5n,
				actual: 15n,
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new NonceTooHighError({
				address: '0xABCD',
				expected: 7n,
				actual: 12n,
			})
			const error2 = new NonceTooHighError({
				address: '0xABCD',
				expected: 7n,
				actual: 12n,
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new NonceTooHighError({
				address: '0x1111',
				expected: 5n,
				actual: 10n,
			})
			const error2 = new NonceTooHighError({
				address: '0x2222',
				expected: 5n,
				actual: 10n,
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new NonceTooHighError({
				address: '0xDEAD',
				expected: 100n,
				actual: 150n,
			})
			const error2 = new NonceTooHighError({
				address: '0xDEAD',
				expected: 100n,
				actual: 150n,
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
